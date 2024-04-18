/** @type {import('ts-jest').JestConfigWithTsJest} */
//puppeteerPreset = import('jest-puppeteer/jest-preset')
import tsPreset from 'ts-jest';
import puppeteerPreset from 'jest-puppeteer'
export default {
    ...tsPreset,
    ...puppeteerPreset,
    //testEnvironment: 'jest-environment-node',
    testPathIgnorePatterns: [".d.ts", ".js"],
    transform: {}
};
