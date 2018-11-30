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
