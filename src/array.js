'use strict'


const {
  minLength,
  maxLength,
  required,
  setConfig,
  validateRules
} = require('./common')


function array(item) {
  const rules = ['array', true]
  const config = { key: null }
  return {
    required() { required(rules); return this },
    min(n) { minLength(n, rules); return this },
    max(n) { maxLength(n, rules); return this },
    errors(data) { setConfig(data, 'messages', config); return this },
    key(v) { setConfig(v, 'key', config); return this },
    validate(data) {
      const errors = {}
      const err = validateRules(rules, config)(data)
      if (err) errors['_base'] = err
      if (item && data) {
        const len = data.length
        for (let i = 0; i < len; i++) {
          const err = item.validate(data[i])
          const errKey = (config.key && data[i][config.key])? data[i][config.key] : i
          if (err) errors[errKey] = err
        }
      }
      return !Object.keys(errors).length? null : errors
    }
  }
}

module.exports = array