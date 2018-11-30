'use strict'


const {
  required,
  setConfig,
  flattenSchema,
  validateRules,
  isType,
  validateSchema
} = require('./common')


function object(schema) {
  if (!isType(schema, 'object')) return
  const rules = ['object', true]
  const config = {}
  flattenSchema(schema)
  return {
    required() { required(rules); return this },
    errors(data) { setConfig(data, 'messages', config); return this },
    validate(data, dataKey, rootData) {
      const errors = validateSchema((rules[1] && !data? {} : data), schema, rootData)
      const err = validateRules(rules, config)(data)
      if (err) errors['_base'] = err
      
      return !Object.keys(errors).length? null : errors
    }
  }
}

module.exports = object