import { danger, fail, message, warn } from 'danger';
import * as exec from 'child_process';

// Função para rodar os testes e capturar os resultados
const runTests = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec.exec('npm test', (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
        return;
      }
      resolve(stdout);
    });
  });
};

// Função principal que irá rodar a lógica
const runDanger = async () => {
  // Verifica a descrição da PR
  if (!danger.github.pr.body || danger.github.pr.body.length < 10) {
    fail(
      'A descrição da PR está muito curta. Por favor, adicione mais detalhes.',
    );
  }

  // Executa os testes e captura os resultados
  try {
    const testResults = await runTests();
    console.log(testResults); // Exibe os resultados dos testes no console (útil para depuração)

    // Caso queira fazer uma verificação personalizada sobre os testes,
    // você pode analisar os resultados retornados e emitir falhas ou avisos.
    if (testResults.includes('FAIL')) {
      fail(
        'Alguns testes falharam. Verifique os logs dos testes para mais detalhes.',
      );
    } else {
      message('Todos os testes passaram com sucesso!');
    }
  } catch (err) {
    fail(`Erro ao rodar os testes: ${err}`);
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

  const testFiles = danger.git.modified_files.filter((file) =>
    file.endsWith('.test.ts'),
  );
  const srcFiles = danger.git.modified_files.filter((file) =>
    file.includes('src'),
  );

  if (srcFiles.length > 0 && testFiles.length === 0) {
    warn(
      'Parece que você fez alterações no código, mas não adicionou ou atualizou os testes!',
    );
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

  const modifiedFiles = [
    ...danger.git.modified_files,
    ...danger.git.created_files,
  ];
  const logFiles = modifiedFiles.filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js'),
  );

  logFiles.forEach(async (file) => {
    // Verifica se o arquivo é um dos que queremos ignorar
    if (file === 'dangerfile.ts' || file === 'src/server.ts') {
      return; // Ignora a verificação desses arquivos
    }

    const fileContent = await danger.github.utils.fileContents(file);
    if (fileContent.includes('console.log')) {
      warn(
        `Evite usar \`console.log\` no código. Arquivo afetado: **${file}**`,
      );
    }
  });

  const nodeVersion = process.version;
  const supportedVersion = 'v18'; // Exemplo de versão suportada

  if (!nodeVersion.startsWith(supportedVersion)) {
    fail(
      `⚠️ Você está utilizando uma versão do Node.js incompatível. A versão suportada é ${supportedVersion}.`,
    );
  }

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
};

// Chama a função principal
runDanger();
