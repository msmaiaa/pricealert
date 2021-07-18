"use strict";
exports.__esModule = true;
exports["default"] = {
    roots: ['<rootDir>/src'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    testEnvironment: "node",
    transform: {
        '.+\\.ts$': 'ts-jest'
    }
};
