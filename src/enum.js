'use strict'


const {
  required,
  oneOf,
  setConfig,
  validateRules
} = require('./common')


function matchEnum(...arg) {
  const rules = ['any', false]
  const config = {}
  oneOf(arg, rules)
  return {
    required() { required(rules); return this },
    errors(data) { setConfig(data, 'messages', config); return this },
    validate: validateRules(rules, config),
  }
}

module.exports = matchEnum