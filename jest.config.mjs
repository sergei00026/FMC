import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  collectCoverageFrom: [
    'src/features/auth/model/authSlice.ts',
    'src/shared/api/axiosBaseQuery.ts',
    'src/features/reports/lib/processReportInWorker.ts',
    'src/shared/ui/Button/Button.tsx',
    'src/shared/ui/Input/Input.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
};

export default createJestConfig(customJestConfig);
