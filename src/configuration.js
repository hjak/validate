'use strict'

const CONFIG = {
  forceErrors: false,
  messages: {
    required: `Is required`,
    match: `Should match one of values: {{ values }}`,
    ref: `Should match a reference`,
    switch: {
      case: 'Incorrect value'
    },
    email: {
      type: `Should be a string`,
      pattern: `Should be a valid email`,
    },
    boolean: {
      type: `Should be a boolean`,
    },
    array: {
      type: `Should be an array`,
      min: `Minimum items: {{ n }}`,
      max: `Maximum items: {{ n }}`,
    },
    string: {
      type: `Should be a string`,
      min: 'Minimum characters: {{ n }}',
      max: 'Maximum characters: {{ n }}',
      exact: 'Should be exact characters: {{ n }}',
      pattern: 'Should match a pattern',
    },
    number: {
      type: `Should be a number`,
      min: 'Minimum value: {{ n }}',
      max: 'Maximum value: {{ n }}',
    },
    object: {
      type: 'Should be an object'
    },
    
  }
}

function configure(config) {
  for (const k in CONFIG) {
    if (k in config) {
      if (typeof config[k] !== typeof CONFIG[k]) {
        throw new Error(`Configuration error: wrong type of '${ k }', required: ${ typeof CONFIG[k] }`)
      }
      CONFIG[k] = config[k]
    }
  }
}

function getError(path, { messages, key, n, values }) {
  const str = getValue(messages, path)
  return str? modifyError(str, key, n, values) : modifyError(getValue(CONFIG.messages, path), key, n, values)
}

const K = new RegExp('{{[ key]+}}', 'gi')
const N = new RegExp('{{[ n]+}}', 'gi')
const VALUES = new RegExp('{{[ values]+}}', 'gi')
function modifyError(str, key, n, values) {
  if (key && K.test(str)) str = str.replace(K, key)
  if (n && N.test(str)) str = str.replace(N, n)
  if (values && VALUES.test(str)) {
    str = str.replace(VALUES, values.reduce((str, x) => `${ str? str + ', ' : str }${ x }`, ''))
  }
  return str
}

function getValue(data, path) {
  if (!data) return null
  else if (isString(data)) return data
  const arr = path.split('.')
  return arr.reduce((str, k) => {
    if (str && str[k]) str = str[k]
    return str
  }, data)
}

const isDefined = (value) => value !== undefined && value !== null
const isString = (value) => typeof value === 'string'
const isNumber = (value) => typeof value === 'number'
const isBoolean = (value) => typeof value === 'boolean'
const isObject = (value) => (typeof value === 'object' && value !== null && value.constructor === Object)
const isEmpty = (data) => {
  if (!isDefined(data) || !isObject(data)) return true
  for (const k in data) {
    if (k in data) return false
  }
  return true
}

module.exports = {
  CONFIG,
  configure,
  getError,
  getValue,
  isDefined,
  isString,
  isNumber,
  isObject,
  isBoolean,
  isEmpty,
}