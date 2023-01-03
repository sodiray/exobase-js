module.exports = {
  "roots": [
    "<rootDir>/packages"
  ],
  "testMatch": [
    "**/src/tests/**/*test.ts",
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "coverageThreshold": {
    "global": {
      "branches": 63,
      "functions": 89,
      "lines": 92,
      "statements": 92
    }
  }
}