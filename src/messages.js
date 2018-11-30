'use strict'


const messages = {
  required: 'Is required',
  pattern: 'Not a valid pattern',
  enum: 'Should be one of values',

  string: {
    type: 'Should be a string',
    min: 'Should be minimum {{ n }} characters',
    max: 'Should be maximum {{ n }} characters',
    exact: 'Should be exact {{ n }} characters',
  },

  number: {
    type: 'Should be a number',
    min: 'Should be more than {{ n }}',
    max: 'Should be less than {{ n }}',
  },

  object: {
    type: 'Should be an object',
  },

  array: {
    type: 'Should be an array',
    min: 'Should contain minimum {{ n }} items',
    max: 'Should contain maximum {{ n }} items',
  },

  boolean: {
    type: 'Should be a boolean'
  }
}

module.exports = messages