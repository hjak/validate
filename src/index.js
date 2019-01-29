'use strict'

const { configure, isEmpty } = require('./configuration.js')
const validateString = require('./types/string')
const validateObject = require('./types/object')
const validateNumber = require('./types/number')
const validateBoolean = require('./types/boolean')
const validateEmail = require('./types/email')
const validateMatch = require('./types/match')
const validateRef = require('./types/ref')
const validateSwitch = require('./types/switch')
const validateArray = require('./types/array')


function Schema() {
  const ref = {}
  this.handleRef = (name, value, fn) => {
    if (name in ref) {
      const [v, _fn] = ref[name]
      if (fn) {
        fn(v, value)
        delete ref[name]
      }
      else if (_fn) {
        _fn(value, v)
        delete ref[name]
      }
    }
    else {
      ref[name] = [value, fn]
    }
  }
}

Schema.prototype.configure = configure

Schema.prototype.create = function(schema) {
  const result = {}
  return function(data) {
    const errors = {}
    delete result.errors
    delete result.data
    result.status = true
    
    const arr = Object.keys(schema)
    for (let i = 0; i < arr.length; i++) {
      const k = arr[i]
      const validate = typeof schema[k] === 'function'? schema[k] : schema[k].validate
      const value = data[k]

      const error = validate(value, k, errors)
      if (error) errors[k] = error
    }
    if (!isEmpty(errors)) {
      result.status = false
      result.errors = errors
    }

    return result
  }
}

Schema.prototype.string = validateString
Schema.prototype.object = validateObject
Schema.prototype.number = validateNumber
Schema.prototype.email = validateEmail
Schema.prototype.boolean = validateBoolean
Schema.prototype.match = validateMatch
Schema.prototype.ref = validateRef
Schema.prototype.switch = validateSwitch
Schema.prototype.array = validateArray

module.exports = new Schema()