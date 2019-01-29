'use strict'

const { getError, isDefined } = require('validate/src/configuration')


module.exports = function({ name }, messages) {
  return (value, key, errors) => {
    const err = []

    this.handleRef(name, value, (v1, v2) => {
      if ((isDefined(v1) || isDefined(v2)) && v1 !== v2) {
        err.push(getError('ref', { messages, key: name }))
        errors[key] = err
      }
    })
  }
}
