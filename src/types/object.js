'use strict'

const { isEmpty } = require('../configuration')


module.exports = function(schema) {
  return function(data) {
    const errors = {}
    const arr = Object.keys(schema)
    for (let i = 0; i < arr.length; i++) {
      const k = arr[i]
      const validate = schema[k]

      const error = validate((data || {})[k], k, errors)
      if (error) errors[k] = error
    }
    return isEmpty(errors)? null : errors
  }
}