'use strict'

const { getError, isDefined } = require('../configuration')


function switchCase(name) {
  const cases = {}
  return {
    case(caseValue, validator) {
      cases[`${ caseValue }`] = validator
      return this
    },
    validate: (value, key, errors) => {
      this.handleRef(name, null, (compareValue) => {
        if (!(compareValue in cases)) return

        const validator = cases[`${ compareValue }`]
        if (typeof validator === 'function') {
          const error = validator(value, key, errors)
          if (error) errors[key] = error
        }
        else {
          if (value !== validator) {
            errors[key] = [getError('switch.case', { key })]
            return
          }
        }
      })
    }
  }
}

module.exports = switchCase
