'use strict'

const { getError, isDefined } = require('../configuration')


const match = (value, arr) => !!~arr.indexOf(value)

module.exports = function({ required = true, values, ref }, messages) {
  return (value, key) => {
    if (ref) this.handleRef(ref, value)

    const err = []
    
    if (match(value, values)) return null
    else {
      if (required && !isDefined(value)) {
        err.push(getError('required', { messages, key }))
      }
      else {
        err.push(getError('match', { messages, key, values }))
      }
    }

    return err
  }
}
