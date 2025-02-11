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
    },
  },
};
