(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Validate = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'


const {
  minLength,
  maxLength,
  required,
  setConfig,
  validateRules
} = require('./common')


function array(item) {
  const rules = ['array', true]
  const config = { key: null }
  return {
    required() { required(rules); return this },
    min(n) { minLength(n, rules); return this },
    max(n) { maxLength(n, rules); return this },
    errors(data) { setConfig(data, 'messages', config); return this },
    key(v) { setConfig(v, 'key', config); return this },
    validate(data) {
      const errors = {}
      const err = validateRules(rules, config)(data)
      if (err) errors['_base'] = err
      if (item && data) {
        const len = data.length
        for (let i = 0; i < len; i++) {
          const err = item.validate(data[i])
          const errKey = (config.key && data[i][config.key])? data[i][config.key] : i
          if (err) errors[errKey] = err
        }
      }
      return !Object.keys(errors).length? null : errors
    }
  }
}

module.exports = array
},{"./common":3}],2:[function(require,module,exports){
'use strict'


const {
  required,
  setConfig,
  validateRules
} = require('./common')


function boolean() {
  const rules = ['boolean', false]
  const config = {}
  return {
    required() { required(rules); return this },
    errors(data) { setConfig(data, 'messages', config); return this },
    validate: validateRules(rules, config)
  }
}

module.exports = boolean
},{"./common":3}],3:[function(require,module,exports){
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
  return config && config.messages? config.messages[k] : null
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
    case 'key':
      if (!checkType(v, 'string')) return
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
  setConfig,
  configure,
  validateRules,
  validateSchema,
  flattenSchema,
}
},{"./messages":6}],4:[function(require,module,exports){
'use strict'


const {
  required,
  oneOf,
  setConfig,
  validateRules
} = require('./common')


function matchEnum(...arg) {
  const rules = ['any', false]
  const config = {}
  oneOf(arg, rules)
  return {
    required() { required(rules); return this },
    errors(data) { setConfig(data, 'messages', config); return this },
    validate: validateRules(rules, config),
  }
}

module.exports = matchEnum
},{"./common":3}],5:[function(require,module,exports){
'use strict'


const string = require('./string')
const number = require('./number')
const boolean = require('./boolean')
const matchEnum = require('./enum')
const object = require('./object')
const array = require('./array')
const switchCases = require('./switch')
const {
  flattenSchema,
  validateSchema,
  configure
} = require('./common')


function create(schema) {
  flattenSchema(schema)
  return (data) => {
    const res = { status: true }
    const errors = validateSchema(data, schema, data)
    if (Object.keys(errors).length) {
      res.status = false
      res.errors = errors
    }
    return res
  }
}

module.exports = {
  string,
  number,
  boolean,
  object,
  array,
  enum: matchEnum,
  switch: switchCases,
  create,
  configure
}

},{"./array":1,"./boolean":2,"./common":3,"./enum":4,"./number":7,"./object":8,"./string":9,"./switch":10}],6:[function(require,module,exports){
'use strict'


const messages = {
  required: 'Is required',
  pattern: 'Not a valid pattern',
  enum: 'Should be one of values',

  string: {
    type: 'Should be a string',
    min: 'Should be minimum {{ n }} characters',
    max: 'Should be maximum {{ n }} characters',
    exact: 'Should be exact {{ n }} characters',
  },

  number: {
    type: 'Should be a number',
    min: 'Should be more than {{ n }}',
    max: 'Should be less than {{ n }}',
  },

  object: {
    type: 'Should be an object',
  },

  array: {
    type: 'Should be an array',
    min: 'Should contain minimum {{ n }} items',
    max: 'Should contain maximum {{ n }} items',
  },

  boolean: {
    type: 'Should be a boolean'
  }
}

module.exports = messages
},{}],7:[function(require,module,exports){
'use strict'


const {
  minNumber,
  maxNumber,
  pattern,
  required,
  setConfig,
  validateRules
} = require('./common')


function number() {
  const rules = ['number', false]
  const config = {}
  return {
    required() { required(rules); return this },
    min(n) { minNumber(n, rules); return this },
    max(n) { maxNumber(n, rules); return this },
    pattern(regex) { pattern(regex, rules); return this },
    errors(data) { setConfig(data, 'messages', config); return this },
    validate: validateRules(rules, config)
  }
}

module.exports = number

},{"./common":3}],8:[function(require,module,exports){
'use strict'


const {
  required,
  setConfig,
  flattenSchema,
  validateRules,
  isType,
  validateSchema
} = require('./common')


function object(schema) {
  if (!isType(schema, 'object')) return
  const rules = ['object', true]
  const config = {}
  flattenSchema(schema)
  return {
    required() { required(rules); return this },
    errors(data) { setConfig(data, 'messages', config); return this },
    validate(data, dataKey, rootData) {
      const errors = validateSchema((rules[1] && !data? {} : data), schema, rootData)
      const err = validateRules(rules, config)(data)
      if (err) errors['_base'] = err
      
      return !Object.keys(errors).length? null : errors
    }
  }
}

module.exports = object
},{"./common":3}],9:[function(require,module,exports){
'use strict'


const {
  minLength,
  maxLength,
  exactLength,
  pattern,
  required,
  setConfig,
  validateRules
} = require('./common')


function string() {
  const rules = ['string', false]
  const config = {}
  return {
    required() { required(rules); return this },
    min(n) { minLength(n, rules); return this },
    max(n) { maxLength(n, rules); return this },
    exact(n) { exactLength(n, rules); return this },
    pattern(regex) { pattern(regex, rules); return this },
    errors(data) { setConfig(data, 'messages', config); return this },
    validate: validateRules(rules, config)
  }
}

module.exports = string

},{"./common":3}],10:[function(require,module,exports){
'use strict'


const { setConfig } = require('./common')


function switchCases(caseKey) {
  const rules = ['any', true]
  const config = {}
  return {
    case(condition, rule) {
      rules.push(condition, (value) => rule.validate(value));
      return this
    },
    errors(data) { setConfig(data, 'messages', config); return this },
    validate(value, valueKey, rootData) {
      const len = rules.length
      for (let i = 2; i < len; i += 2) {
        const condition = rules[i]
        const validate = rules[i + 1]
        const keys = caseKey.split('.')
        const caseValue = keys.reduce((v, key) => {
          v = v[key]; return v
        }, rootData)
        
        if (caseValue === condition) {
          const err = validate(value, config)
          if (err) return err
        }
      }
    }
  }
}

module.exports = switchCases
},{"./common":3}]},{},[5])(5)
});
