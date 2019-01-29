'use strict'

const { isEmpty, isDefined, getError } = require('../configuration')


module.exports = function({ required = true, min, max, items, key: errorKey }, messages) {
  return (data, key) => {
    const errors = {}
    const err = []
    errors._base = err

    const defined = isDefined(data)
    const isArray = Array.isArray(data)

    if (required && !defined) {
      err.push(getError('required', { messages, key }))
      return errors
    }
    if (!isArray) {
      err.push(getError('array.type', { messages, key }))
      return errors
    }
    else {
      if (min && data.length < min) {
        err.push(getError('array.min', { messages, key, n: min }))
        return errors
      }
      if (max && data.length > max) {
        err.push(getError('array.max', { messages, key, n: max }))
        return errors
      }

      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        let error
        if (typeof items === 'function') {
          error = items(item, (item[errorKey] || i), errors)
        }
        if (error) errors[item[errorKey] || i] = error
      }
    }

    if (!err.length) delete errors._base

    return isEmpty(errors)? null : errors
  }
}
