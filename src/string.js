'use strict'


const {
  minLength,
  maxLength,
  exactLength,
  pattern,
  required,
  setConfig,
  validateRules
} = require('./common')


function string() {
  const rules = ['string', false]
  const config = {}
  return {
    required() { required(rules); return this },
    min(n) { minLength(n, rules); return this },
    max(n) { maxLength(n, rules); return this },
    exact(n) { exactLength(n, rules); return this },
    pattern(regex) { pattern(regex, rules); return this },
    errors(data) { setConfig(data, 'messages', config); return this },
    validate: validateRules(rules, config)
  }
}

module.exports = string
