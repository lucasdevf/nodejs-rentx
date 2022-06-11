import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

export default {
  bail: true,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/modules/**/useCases/**/*.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text-summary"],
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: ["**/*.spec.ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src/",
  }),
  testTimeout: 20000,
};
