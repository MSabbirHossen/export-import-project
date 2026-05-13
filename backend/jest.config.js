export default {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
    "!src/config/swagger.js",
  ],
  testMatch: ["**/tests/**/*.test.js"],
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testTimeout: 30000,
  verbose: true,
};
