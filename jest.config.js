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
      "branches": 58,
      "functions": 82,
      "lines": 89,
      "statements": 88
    }
  }
}