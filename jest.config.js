/** @type {import('ts-jest').JestConfigWithTsJest} */
const tsPreset = require('ts-jest/jest-preset')
const puppeteerPreset = require('jest-puppeteer/jest-preset')

module.exports = {
  ...tsPreset,
  ...puppeteerPreset,
  //testEnvironment: 'node',
  testPathIgnorePatterns: [".d.ts", ".js"]
};