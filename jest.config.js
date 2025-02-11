/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Correção do regex para transformar arquivos .ts e .tsx
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'], // Certifique-se de que o Jest reconheça as extensões corretas
  globals: {
    'ts-jest': {
      isolatedModules: true, // Otimiza a execução para projetos com TS
      tsconfig: 'tsconfig.json', // Configura o TypeScript correto para o Jest
    },
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'], // Especifica os arquivos de teste
  coverageDirectory: '<rootDir>/coverage', // Diretório para armazenar relatórios de cobertura
  collectCoverage: true, // Habilita a coleta de cobertura
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Coleta cobertura dos arquivos da pasta src
    '!src/**/*.d.ts', // Ignora os arquivos de definição
  ],
  preset: 'ts-jest/presets/default', // Usando o preset padrão para ts-jest
  // Outras configurações, se necessário
};
