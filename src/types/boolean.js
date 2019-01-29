'use strict'

const { getError, isDefined, isBoolean } = require('../configuration')


module.exports = function({ required = true, ref }, messages) {
  return (value, key) => {
    if (ref) this.handleRef(ref, value)

    const err = []
    const defined = isDefined(value)

    if (required && !defined) {
      err.push(getError('required', { messages, key }))
      return err
    }
    if ((required || defined) && !isBoolean(value)) {
      err.push(getError('boolean.type', { messages, key }))
      return err
    }

    return err.length? err : null
  }
}
