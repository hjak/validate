'use strict'


const { setConfig } = require('./common')


function switchCases(caseKey) {
  const rules = ['any', true]
  const config = {}
  return {
    case(condition, rule) {
      rules.push(condition, (value) => rule.validate(value));
      return this
    },
    errors(data) { setConfig(data, 'messages', config); return this },
    validate(value, valueKey, rootData) {
      const len = rules.length
      for (let i = 2; i < len; i += 2) {
        const condition = rules[i]
        const validate = rules[i + 1]
        const keys = caseKey.split('.')
        const caseValue = keys.reduce((v, key) => {
          v = v[key]; return v
        }, rootData)
        
        if (caseValue === condition) {
          const err = validate(value, config)
          if (err) return err
        }
      }
    }
  }
}

module.exports = switchCases