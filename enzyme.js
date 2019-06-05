/** Used in jest.config.js */
import enzyme from 'enzyme' // eslint-disable-line import/no-extraneous-dependencies
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'

enzyme.configure({adapter: new Adapter()})

global.React = React
global.mount = enzyme.mount
global.shallow = enzyme.shallow

const mediaSizeRegex = /\d+/g

function getBreakpoint(query) {
  const regexArr = mediaSizeRegex.exec(query)
  if (regexArr) {
    return parseInt(regexArr[0], 10)
  }
  return null
}

/**
 * Used for checking media size in unit tests
 */
function checkMedia(query, media) {
  const breakpoint = getBreakpoint(query)
  const isWithinMinimum = query.includes('min') && media >= breakpoint
  const isWithinMaximum = query.includes('max') && media <= breakpoint
  const isUndefined = query.includes('undefined')

  return isWithinMinimum || isWithinMaximum || isUndefined
}

/**
 * Jest Manual Implementation
 * https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 */
const callback = jest.fn().mockImplementation((query) => {
  const media = 1024 // browser media size for testing
  const matches = checkMedia(query, media)

  return {
    matches,
    media,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn()
  }
})

window.matchMedia = window.matchMedia || callback
