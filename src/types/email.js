'use strict'

const { CONFIG } = require('../configuration')
const validateString = require('./string')


const email = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$')

module.exports = function({ required = true, pattern }, messages = CONFIG.messages.email) {
  return validateString({ required, pattern: pattern || email }, messages)
}
