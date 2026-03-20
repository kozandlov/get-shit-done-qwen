#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Парсинг аргументов
const args = process.argv.slice(2);
const sourceDir = args.find((_, i) => args[i - 1] === '--source') || './upstream';
const targetDir = args.find((_, i) => args[i - 1] === '--target') || './transformed';
const upstreamVersion = args.find((_, i) => args[i - 1] === '--upstream-version') || 'latest';

console.log(`🔄 Transforming GSD ${upstreamVersion} for Qwen Code CLI`);
console.log(`   Source: ${sourceDir}`);
console.log(`   Target: ${targetDir}`);

// Маппинг инструментов Claude Code → Qwen Code CLI
const TOOL_MAPPING = {
  'Read': 'read_file',
  'Write': 'write_file',
  'Edit': 'edit',
  'Bash': 'run_shell_command',
  'Task': 'task',
  'AskUserQuestion': 'ask_user_question',
  'Glob': 'glob',
  'Grep': 'grep_search',
  'WebFetch': 'web_fetch',
  'WebSearch': 'web_search',
  'TodoWrite': 'todo_write',
  'ExitPlanMode': 'exit_plan_mode'
};

// Выполняем трансформацию
transformCommandsToSkills();
updateWorkflowFiles();
updateTemplatesFiles();
updateReferencesFiles();
updateBinFiles();
updateReadme();
updatePackageJson();

console.log('✅ Transformation complete');

// Трансформация commands/gsd/*.md в skills/gsd-*/SKILL.md
function transformCommandsToSkills() {
  const commandsDir = path.join(sourceDir, 'commands', 'gsd');
  const skillsDir = path.join(targetDir, 'skills');

  if (!fs.existsSync(commandsDir)) {
    console.warn('⚠️  No commands/gsd directory found');
    return;
  }

  const files = fs.readdirSync(commandsDir);

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const commandName = file.replace('.md', '');
    const skillDir = path.join(skillsDir, `gsd-${commandName}`);
    const skillFile = path.join(skillDir, 'SKILL.md');

    const content = fs.readFileSync(path.join(commandsDir, file), 'utf8');
    const transformed = transformCommandContent(content, commandName);

    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(skillFile, transformed);
    console.log(`   ✓ commands/gsd/${file} → skills/gsd-${commandName}/SKILL.md`);
  }
}

// Трансформация содержимого команды в формат SKILL.md
function transformCommandContent(content, commandName) {
  let transformed = content;

  // 1. Обновляем YAML frontmatter
  transformed = transformed.replace(
    /^name: gsd:(.+?)$/m,
    'name: gsd-$1'
  );

  // 2. Обновляем аргумент-hint (если есть)
  transformed = transformed.replace(
    /^argument-hint: "(.*)"/m,
    (match, hint) => {
      // Конвертируем формат аргументов
      return `argument-hint: "${hint.replace(/\/gsd:/g, '$gsd-')}"`;
    }
  );

  // 3. Маппинг инструментов в allowed-tools
  for (const [claudeTool, qwenTool] of Object.entries(TOOL_MAPPING)) {
    transformed = transformed.replace(
      new RegExp(`\\b${claudeTool}\\b`, 'g'),
      qwenTool
    );
  }

  // 4. Заменяем формат команд в тексте
  transformed = transformed.replace(
    /\/gsd:([a-zA-Z0-9-]+)/g,
    '$gsd-$1'
  );

  // 5. Обновляем пути
  transformed = transformed.replace(
    /~\/\.claude\/get-shit-done/g,
    '~/.qwen/get-shit-done'
  );

  // 6. Обновляем @references
  transformed = transformed.replace(
    /@~\/\.claude/g,
    '@~/.qwen'
  );

  // 7. Обновляем пути в workflow ссылках
  transformed = transformed.replace(
    /@~\/\.qwen\/get-shit-done\/workflows/g,
    '@~/.qwen/get-shit-done/workflows'
  );

  // 8. Добавляем Qwen-specific секцию в конец
  transformed += `\n\n---\n\n## Qwen Code CLI\n\n**Установка:**\n\`\`\`bash\n# Глобально\nln -s ~/.qwen/get-shit-done/skills/gsd-${commandName} ~/.qwen/skills/gsd-${commandName}\n\n# Локально (в проект)\nln -s .qwen/get-shit-done/skills/gsd-${commandName} .qwen/skills/gsd-${commandName}\n\`\`\`\n\n**Использование:**\n\`\`\`bash\n$gsd-${commandName}\n\`\`\`\n`;

  return transformed;
}

// Обновление workflow файлов
function updateWorkflowFiles() {
  const workflowsDir = path.join(targetDir, 'get-shit-done', 'workflows');

  if (!fs.existsSync(workflowsDir)) {
    console.warn('⚠️  No get-shit-done/workflows directory found');
    return;
  }

  const files = fs.readdirSync(workflowsDir);

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(workflowsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Обновляем пути
    content = content.replace(
      /~\/\.claude\/get-shit-done/g,
      '~/.qwen/get-shit-done'
    );

    // Обновляем формат команд
    content = content.replace(
      /\/gsd:([a-zA-Z0-9-]+)/g,
      '$gsd-$1'
    );

    // Маппинг инструментов
    for (const [claudeTool, qwenTool] of Object.entries(TOOL_MAPPING)) {
      content = content.replace(
        new RegExp(`\\b${claudeTool}\\b`, 'g'),
        qwenTool
      );
    }

    fs.writeFileSync(filePath, content);
    console.log(`   ✓ workflows/${file} — updated`);
  }
}

// Обновление templates файлов
function updateTemplatesFiles() {
  const templatesDir = path.join(targetDir, 'get-shit-done', 'templates');

  if (!fs.existsSync(templatesDir)) {
    console.warn('⚠️  No get-shit-done/templates directory found');
    return;
  }

  const files = fs.readdirSync(templatesDir);

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(templatesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Обновляем пути
    content = content.replace(
      /~\/\.claude\/get-shit-done/g,
      '~/.qwen/get-shit-done'
    );

    // Обновляем формат команд
    content = content.replace(
      /\/gsd:([a-zA-Z0-9-]+)/g,
      '$gsd-$1'
    );

    fs.writeFileSync(filePath, content);
    console.log(`   ✓ templates/${file} — updated`);
  }
}

// Обновление references файлов
function updateReferencesFiles() {
  const referencesDir = path.join(targetDir, 'get-shit-done', 'references');

  if (!fs.existsSync(referencesDir)) {
    console.warn('⚠️  No get-shit-done/references directory found');
    return;
  }

  const files = fs.readdirSync(referencesDir);

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(referencesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Обновляем пути
    content = content.replace(
      /~\/\.claude\/get-shit-done/g,
      '~/.qwen/get-shit-done'
    );

    // Обновляем формат команд
    content = content.replace(
      /\/gsd:([a-zA-Z0-9-]+)/g,
      '$gsd-$1'
    );

    fs.writeFileSync(filePath, content);
    console.log(`   ✓ references/${file} — updated`);
  }
}

// Обновление bin/ файлов (скрипты .cjs и .js)
function updateBinFiles() {
  const binDir = path.join(targetDir, 'bin');

  if (!fs.existsSync(binDir)) {
    console.warn('⚠️  No bin directory found');
    return;
  }

  const files = fs.readdirSync(binDir);

  for (const file of files) {
    if (!file.endsWith('.cjs') && !file.endsWith('.js')) continue;

    const filePath = path.join(binDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Обновляем пути в скриптах
    content = content.replace(
      /~\/\.claude\/get-shit-done/g,
      '~/.qwen/get-shit-done'
    );

    content = content.replace(
      /\/\.claude\/get-shit-done/g,
      '/.qwen/get-shit-done'
    );

    content = content.replace(
      /get-shit-done-cc/g,
      'gsd-qwen'
    );

    fs.writeFileSync(filePath, content);
    console.log(`   ✓ bin/${file} — updated paths`);
  }
}

// Обновление README.md
function updateReadme() {
  const readmePath = path.join(targetDir, 'README.md');

  if (!fs.existsSync(readmePath)) {
    console.warn('⚠️  No README.md found');
    return;
  }

  let content = fs.readFileSync(readmePath, 'utf8');

  // Обновляем заголовок
  content = content.replace(
    /# GET SHIT DONE\n\n\*\*Система .*? для Claude Code/g,
    `# GET SHIT DONE for Qwen Code CLI\n\n**Система мета-промптинга, контекстного инжиниринга и спеко-ориентированной разработки для Qwen Code CLI`
  );

  // Обновляем название пакета
  content = content.replace(
    /get-shit-done-cc/g,
    'gsd-qwen'
  );

  // Добавляем секцию установки для Qwen после основного заголовка
  const qwenInstallSection = `
## Установка для Qwen Code CLI

\`\`\`bash
# Глобально (все проекты)
git clone https://github.com/YOUR_USERNAME/gsd-qwen.git ~/.qwen/get-shit-done
ln -s ~/.qwen/get-shit-done/skills/* ~/.qwen/skills/

# Локально (только текущий проект)
git clone https://github.com/YOUR_USERNAME/gsd-qwen.git .qwen/get-shit-done
\`\`\`

После установки используйте команды:
\`\`\`bash
$gsd-new-project       # Инициализация нового проекта
$gsd-plan-phase 1      # Планирование фазы 1
$gsd-execute-phase 1   # Выполнение фазы 1
$gsd-verify-work 1     # Верификация работы
$gsd-help              # Справка по всем командам
\`\`\`

`;

  // Вставляем секцию после первого заголовка ## Начало работы или ## Установка
  if (content.includes('## Начало работы')) {
    content = content.replace(
      /## Начало работы/,
      qwenInstallSection + '## Начало работы'
    );
  } else if (content.includes('## Установка')) {
    content = content.replace(
      /## Установка/,
      qwenInstallSection + '## Установка'
    );
  } else {
    // Если нет секции установки, добавляем после основного описания
    content = content.replace(
      /(\*\*Работает на Mac, Windows и Linux\.\*\*)/,
      '$1\n' + qwenInstallSection
    );
  }

  // Добавляем таблицу соответствия команд
  const commandsTable = `
## Соответствие команд

| Claude Code (оригинал) | Qwen Code CLI (адаптация) |
|------------------------|---------------------------|
`;

  const commandsDir = path.join(sourceDir, 'commands', 'gsd');
  if (fs.existsSync(commandsDir)) {
    const files = fs.readdirSync(commandsDir);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const cmd = file.replace('.md', '');
        commandsTable += '| `/' + 'gsd:' + cmd + '` | `$gsd-' + cmd + '`\n';
      }
    }
    content += '\n' + commandsTable;
  }

  fs.writeFileSync(readmePath, content);
  console.log('   ✓ README.md — updated for Qwen');
}

// Обновление package.json
function updatePackageJson() {
  const packagePath = path.join(targetDir, 'package.json');

  if (!fs.existsSync(packagePath)) {
    console.warn('⚠️  No package.json found');
    return;
  }

  let packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  // Обновляем название пакета
  if (packageData.name) {
    packageData.name = packageData.name.replace('get-shit-done-cc', 'gsd-qwen');
  }

  // Обновляем bin
  if (packageData.bin) {
    const newBin = {};
    for (const [key, value] of Object.entries(packageData.bin)) {
      const newKey = key.replace('get-shit-done-cc', 'gsd-qwen');
      newBin[newKey] = value;
    }
    packageData.bin = newBin;
  }

  // Обновляем description
  if (packageData.description) {
    packageData.description = packageData.description.replace(
      'Claude Code',
      'Qwen Code CLI'
    );
  }

  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
  console.log('   ✓ package.json — updated');
}
