'use strict'


const string = require('./string')
const number = require('./number')
const boolean = require('./boolean')
const matchEnum = require('./enum')
const object = require('./object')
const array = require('./array')
const switchCases = require('./switch')
const {
  flattenSchema,
  validateSchema,
  configure
} = require('./common')


function create(schema) {
  flattenSchema(schema)
  return (data) => {
    const res = { status: true }
    const errors = validateSchema(data, schema, data)
    if (Object.keys(errors).length) {
      res.status = false
      res.errors = errors
    }
    return res
  }
}

module.exports = {
  string,
  number,
  boolean,
  object,
  array,
  enum: matchEnum,
  switch: switchCases,
  create,
  configure
}
