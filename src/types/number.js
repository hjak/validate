'use strict'

const { getError, isDefined, isNumber } = require('../configuration')


const checkMin = (value, n) => value >= n
const checkMax = (value, n) => value <= n

module.exports = function({ required = true, min, max }, messages) {
  return function(value, key) {
    const err = []
    const defined = isDefined(value)

    if (required && !defined) {
      err.push(getError('required', { messages, key }))
      return err
    }
    if ((required || defined) && !isNumber(value)) {
      err.push(getError('number.type', { messages, key }))
      return err
    }
    if (min && (required || defined) && !checkMin(value, min)) {
      err.push(getError('number.min', { messages, key, n: min }))
      return err
    }
    if (max && (required || defined) && !checkMax(value, max)) {
      err.push(getError('number.max', { messages, key, n: max }))
      return err
    }

    return err.length? err : null
  }
}
