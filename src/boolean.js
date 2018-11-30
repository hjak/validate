'use strict'


const {
  required,
  setConfig,
  validateRules
} = require('./common')


function boolean() {
  const rules = ['boolean', false]
  const config = {}
  return {
    required() { required(rules); return this },
    errors(data) { setConfig(data, 'messages', config); return this },
    validate: validateRules(rules, config)
  }
}

module.exports = boolean