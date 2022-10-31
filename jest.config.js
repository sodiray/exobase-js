module.exports = {
  "roots": [
    "<rootDir>/packages"
  ],
  "testMatch": [
    "**/*test.ts",
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "coverageThreshold": {
    "global": {
      "branches": 24,
      "functions": 24,
      "lines": 53,
      "statements": 54
    }
  }
}