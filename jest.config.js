module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [
    "**/packages/**/__tests__/**/*.test.ts",
    "**/packages/**/*.test.ts",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/packages/services/database/dist/",
  ],
  modulePathIgnorePatterns: ["<rootDir>/packages/services/database/dist/"],
  moduleNameMapper: {
    "^@asafe/db$": "<rootDir>/packages/services/database/src",
    "^@asafe/utils$": "<rootDir>/packages/utils/src",
    "^@prisma/client$":
      "<rootDir>/packages/services/database/__mocks__/@prisma/client",
  },
  setupFilesAfterEnv: ["<rootDir>/testSetup.ts"],
};
