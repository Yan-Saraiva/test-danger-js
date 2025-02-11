import { danger, warn, fail, message } from 'danger';
import { prettier } from 'danger-plugin-prettier';

// Verifica a descrição da PR
if (!danger.github.pr.body || danger.github.pr.body.length < 10) {
  fail(
    'A descrição da PR está muito curta. Por favor, adicione mais detalhes.',
  );
}

// Verifica mudanças no código e nos testes
const hasTestChanges = danger.git.modified_files.some((file) =>
  file.includes('test'),
);
const hasSrcChanges = danger.git.modified_files.some((file) =>
  file.includes('src'),
);

if (hasSrcChanges && !hasTestChanges) {
  warn('Parece que você alterou o código, mas não atualizou os testes.');
}

// Verifica alterações em arquivos importantes
const sensitiveFiles = ['package.json', 'ormconfig.ts', 'tsconfig.json'];
sensitiveFiles.forEach((file) => {
  if (danger.git.modified_files.includes(file)) {
    message(
      `⚠️ O arquivo **${file}** foi modificado. Certifique-se de que essa mudança foi intencional.`,
    );
  }
});

// Verifica se há mudanças em dependências no package.json
const packageJsonChanged = danger.git.modified_files.includes('package.json');
if (packageJsonChanged) {
  const addedDeps = danger.git.created_files.filter((file) =>
    file.includes('package.json'),
  );
  if (addedDeps.length) {
    message(
      '🔧 Dependências foram adicionadas ou alteradas em `package.json`. Verifique se todas são necessárias.',
    );
  }
}

// Verifica se o código está bem formatado (com Prettier)
const formattedFiles = danger.git.modified_files.filter(
  (file) => file.endsWith('.ts') || file.endsWith('.tsx'),
);
if (
  formattedFiles.length &&
  !formattedFiles.every((file) => file.match(/.*\.ts$/))
) {
  warn(
    '⚠️ Alguns arquivos TypeScript podem não estar corretamente formatados. Execute o Prettier.',
  );
}

// Rodar o plugin Prettier para verificar a formatação
prettier();

// Verifica se há `console.log` no código
const modifiedFiles = [
  ...danger.git.modified_files,
  ...danger.git.created_files,
];
const logFiles = modifiedFiles.filter(
  (file) => file.endsWith('.ts') || file.endsWith('.js'),
);

logFiles.forEach(async (file) => {
  const fileContent = await danger.github.utils.fileContents(file);
  if (fileContent.includes('console.log')) {
    warn(`Evite usar \`console.log\` no código. Arquivo afetado: **${file}**`);
  }
});

// Verifica se os commits seguem a convenção
const commitMessages = danger.git.commits.map((commit) => commit.message);
const conventionalCommitRegex = /^(\w+)(\([a-z0-9-_]+\))?:\s[A-Z].+/;
commitMessages.forEach((commitMessage) => {
  if (!conventionalCommitRegex.test(commitMessage)) {
    warn(
      `⚠️ O commit "${commitMessage}" não segue o formato convencional. Utilize algo como "feat: adicionar nova funcionalidade" ou "fix: corrigir bug".`,
    );
  }
});
