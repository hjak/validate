'use strict'


const messages = require('./messages')


const defaultConfig = {
  forceErrors: false,
  messages
}

const types = {
  array: (value) => (typeof value === 'object' && value !== null && value.constructor === Array),
  object: (value) => (typeof value === 'object' && value !== null && value.constructor === Object),
  number: (value) => (typeof value === 'number' && isFinite(value)),
  string: (value) => typeof value === 'string',
  regex: (value) => value instanceof RegExp,
  boolean: (value) => typeof value === 'boolean',
}

function getError(keys, n, msg) {
  const error = msg || keys.reduce((acc, k) => (acc = acc[k]), defaultConfig.messages)
  return isDefined(n) && hasValue(n)? error.replace(/{{[ a-z]+}}/gi, n) : error
}

function required(rules) {
  rules[1] = true
}

function oneOf(arg, rules) {
  if (!checkType(arg, 'array')) return
  rules.push((value, config) => {
    const defined = isDefined(value) && hasValue(value)
    switch (true) {
      case config.skip && checkConfig('forceErrors', false, config):
        break
      case (isRequired(rules) && !defined):
      case (defined && !arg.includes(value)):
        return getError(['enum'], null, checkMessage('enum', config))
      default: break
    }
  })
}

function minNumber(n, rules) {
  if (!checkType(n, 'number')) return
  rules.push((value, config) => {
    const defined = isDefined(value) && hasValue(value)
    switch (true) {
      case config.skip && checkConfig('forceErrors', false, config):
        break
      case (isRequired(rules) && !defined):
      case (defined && value < n):
        return getError([rules[0], 'min'], n, checkMessage('min', config))
      default: break
    }
  })
}

function maxNumber(n, rules) {
  if (!checkType(n, 'number')) return
  rules.push((value, config) => {
    const defined = isDefined(value) && hasValue(value)
    switch (true) {
      case config.skip && checkConfig('forceErrors', false, config):
        break
      case (isRequired(rules) && !defined):
      case (defined && value > n):
        return getError([rules[0], 'max'], n, checkMessage('max', config))
      default: break
    }
  })
}

function exactLength(n, rules) {
  if (!checkType(n, 'number')) return
  rules.push((value, config) => {
    const defined = isDefined(value) && hasValue(value)
    switch (true) {
      case config.skip && checkConfig('forceErrors', false, config):
        break
      case (isRequired(rules) && !defined):
      case (defined && value.length !== 0 && value.length !== n):
        return getError([rules[0], 'exact'], n, checkMessage('exact', config))
      default: break
    }
  })
}

function minLength(n, rules) {
  if (!checkType(n, 'number')) return
  rules.push((value, config) => {
    const defined = isDefined(value) && hasValue(value)
    switch (true) {
      case config.skip && checkConfig('forceErrors', false, config):
        break
      case (isRequired(rules) && !defined):
      case (defined && value.length < n):
        return getError([rules[0], 'min'], n, checkMessage('min', config))
      default: break
    }
  })
}

function maxLength(n, rules) {
  if (!checkType(n, 'number')) return
  rules.push((value, config) => {
    const defined = isDefined(value) && hasValue(value)
    switch (true) {
      case config.skip && checkConfig('forceErrors', false, config):
        break
      case (isRequired(rules) && !defined):
      case (defined && value.length > n && value.length !== 0):
        return getError([rules[0], 'max'], n, checkMessage('max', config))
      default: break
    }
  })
}

function pattern(regex, rules) {
  if (!checkType(regex, 'regex')) return
  rules.push((value, config) => {
    const defined = isDefined(value) && hasValue(value)
    switch (true) {
      case config.skip && checkConfig('forceErrors', false, config):
        break
      case (isRequired(rules) && !defined):
      case (defined && !regex.test(value)):
        return getError(['pattern'], null, checkMessage('pattern', config))
      default: break
    }
  })
}

function isDefined(value) {
  return value !== undefined
}

function hasValue(value) {
  return value !== null
}

function isType(value, type) {
  return types[`${ type }`](value)
}

function isRequired(rules) {
  return rules[1]
}

function checkType(value, type) {
  if (!isType(value, type)) {
    throw new Error(`Validator error. Wrong data type of ${ value }. Correct type: ${ type }`)
    return false
  }
  return true
}

function checkConfig(k, v, config) {
  return config[k] === v || defaultConfig[k] === v
}

function checkMessage(k, config) {
  return config && config.messages? config.messages[k] || config.messages._default : null
}

function flattenSchema(obj) {
  for (let k in obj) {
    const o = obj[`${ k }`]
    if (o && o.validate) obj[`${ k }`] = o.validate
  }
}

function validateRules(rules, params = {}) {
  return (value) => {
    const err = []
    const defined = isDefined(value) && hasValue(value)
    const config = { ...params, skip: false }
    if (isRequired(rules) && !defined) {
      err.push(getError(
        ['required'], null, checkMessage('required', config)
      ))
      config.skip = true
    }
    if (rules[0] in types) {
      if ( !(config.skip && checkConfig('forceErrors', false, config)) ) {
        if ((isRequired(rules) && !defined) || (defined && !isType(value, rules[0]))) {
          err.push(getError(
            [rules[0], 'type'], null, checkMessage('type', config)
          ))
          config.skip = true
        }
      }
    }

    const len = rules.length
    for (let i = 2; i < len; i++) {
      const msg = rules[`${ i }`](value, config)
      if (msg) err.push(msg)
    }
    return !err.length? null : err
  }
}

function validateSchema(data, schema, rootData) {
  const errors = {}
  if (data) {
    for (let k in schema) {
      const fn = schema[k]
      const err = fn(data[k], k, rootData)
      if (err) errors[k] = err
    }
  }
  return errors
}

function configure(config) {
  if (!checkType(config, 'object')) return
  for (let k in defaultConfig) {
    if (k in config) {
      if (types.object(defaultConfig[k])) {
        defaultConfig[k] = { ...defaultConfig[k], ...config[k] }
      }
      else defaultConfig[k] = config[k]
    }
  }
}

function setConfig(v, k, config) {
  switch (k) {
    case 'messages':
      if (!checkType(v, 'object')) return
      break
    case 'key':
      if (!checkType(v, 'string')) return
      break
    default: config[k] = v
  }
}


module.exports = {
  required,
  pattern,
  maxLength,
  minLength,
  exactLength,
  maxNumber,
  minNumber,
  oneOf,
  isType,
  setConfig,
  configure,
  validateRules,
  validateSchema,
  flattenSchema,
}