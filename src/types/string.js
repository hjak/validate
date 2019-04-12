'use strict'

const { getError, isDefined, isString } = require('../configuration')


const checkMin = (value, n) => value.length > 0 && value.length >= n
const checkMax = (value, n) => value.length > 0 && value.length <= n
const checkExact = (value, n) => value.length === n
const checkPattern = (value, pattern) => pattern.test(value)

module.exports = function({ required = true, min, max, exact, pattern, ref }, messages) {
  return (value, key) => {
    if (ref) this.handleRef(ref, value)

    const err = []
    const defined = isDefined(value)

    if (required && !defined || !value) {
      err.push(getError('required', { messages, key }))
      return err
    }
    if ((required || defined) && !isString(value)) {
      err.push(getError('string.type', { messages, key }))
      return err
    }
    if (min && (required || defined) && !checkMin(value, min)) {
      err.push(getError('string.min', { messages, key, n: min }))
      return err
    }
    if (max && (required || defined) && !checkMax(value, max)) {
      err.push(getError('string.max', { messages, key, n: max }))
      return err
    }
    if (exact && (required || defined) && !checkExact(value, exact)) {
      err.push(getError('string.exact', { messages, key, n: exact }))
      return err
    }
    if (pattern && (required || defined) && !checkPattern(value, pattern)) {
      err.push(getError('string.pattern', { messages, key, n: exact }))
      return err
    }

    return err.length? err : null
  }
}
