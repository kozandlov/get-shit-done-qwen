#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const sourceDir = args.find((_, i) => args[i - 1] === '--source') || './upstream';
const targetDir = args.find((_, i) => args[i - 1] === '--target') || './transformed';
const upstreamVersion = args.find((_, i) => args[i - 1] === '--upstream-version') || 'latest';

console.log(`Transforming GSD ${upstreamVersion} for Qwen Code CLI`);
console.log(`   Source: ${sourceDir}`);
console.log(`   Target: ${targetDir}`);

const TOOL_MAPPING = {
  Read: 'read_file',
  Write: 'write_file',
  Edit: 'edit',
  Bash: 'run_shell_command',
  Task: 'task',
  AskUserQuestion: 'ask_user_question',
  Glob: 'glob',
  Grep: 'grep_search',
  WebFetch: 'web_fetch',
  WebSearch: 'web_search',
  TodoWrite: 'todo_write',
  ExitPlanMode: 'exit_plan_mode',
};

const MARKDOWN_TOOL_FILES = [
  ['get-shit-done', 'workflows'],
  ['get-shit-done', 'templates'],
  ['get-shit-done', 'references'],
  ['agents'],
];

const BINARY_TEXT_FILES = [
  ['bin'],
  ['get-shit-done', 'bin'],
  ['hooks'],
];

const EXACT_TEXT_FILES = [
  ['package-lock.json'],
];

const DOCUMENT_FILES = [
  ['CHANGELOG.md'],
  ['README.md'],
  ['README.zh-CN.md'],
  ['docs', 'AGENTS.md'],
  ['docs', 'ARCHITECTURE.md'],
  ['docs', 'CLI-TOOLS.md'],
  ['docs', 'COMMANDS.md'],
  ['docs', 'CONFIGURATION.md'],
  ['docs', 'FEATURES.md'],
  ['docs', 'README.md'],
  ['docs', 'USER-GUIDE.md'],
  ['docs', 'context-monitor.md'],
];

main();

function main() {
  transformCommandsToSkills();
  transformMarkdownFiles();
  transformBinaryTextFiles();
  transformAssetFiles();
  updateReadmeFiles();
  updatePackageJson();

  console.log('Transformation complete');
}

function transformCommandsToSkills() {
  const commandsDir = path.join(sourceDir, 'commands', 'gsd');
  const targetCommandsDir = path.join(targetDir, 'commands', 'gsd');
  const skillsDir = path.join(targetDir, 'skills');

  if (!fs.existsSync(commandsDir)) {
    console.warn('No commands/gsd directory found');
    return;
  }

  fs.mkdirSync(skillsDir, { recursive: true });
  fs.mkdirSync(targetCommandsDir, { recursive: true });

  for (const file of fs.readdirSync(commandsDir)) {
    if (!file.endsWith('.md')) continue;

    const commandName = file.replace('.md', '');
    const sourceFile = path.join(commandsDir, file);
    const targetFile = path.join(targetCommandsDir, file);
    const skillDir = path.join(skillsDir, `gsd-${commandName}`);
    const skillFile = path.join(skillDir, 'SKILL.md');

    const originalContent = fs.readFileSync(sourceFile, 'utf8');
    const transformed = transformCommandContent(originalContent, commandName);

    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, transformed);

    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(skillFile, transformed);

    console.log(`   commands/gsd/${file} -> skills/gsd-${commandName}/SKILL.md`);
  }
}

function transformMarkdownFiles() {
  for (const parts of MARKDOWN_TOOL_FILES) {
    transformMarkdownTree(parts);
  }

  for (const parts of DOCUMENT_FILES) {
    transformMarkdownFile(parts);
  }

  transformMarkdownTree(['docs', 'zh-CN']);
}

function transformBinaryTextFiles() {
  for (const parts of BINARY_TEXT_FILES) {
    transformTextTree(parts);
  }

  for (const parts of EXACT_TEXT_FILES) {
    transformTextFile(parts, transformBinaryTextContent);
  }
}

function transformAssetFiles() {
  transformTextTree(['assets'], fileName => fileName.endsWith('.svg'));
}

function transformMarkdownTree(parts) {
  transformTextTree(parts, fileName => fileName.endsWith('.md'));
}

function transformMarkdownFile(parts) {
  const filePath = path.join(targetDir, ...parts);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const transformed = transformMarkdownContent(content);
  if (transformed !== content) {
    fs.writeFileSync(filePath, transformed);
  }
}

function transformTextFile(parts, transformer) {
  const filePath = path.join(targetDir, ...parts);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const transformed = transformer(content);
  if (transformed !== content) {
    fs.writeFileSync(filePath, transformed);
  }
}

function transformTextTree(parts, filter = () => true) {
  const root = path.join(targetDir, ...parts);
  if (!fs.existsSync(root)) return;

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const filePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(filePath);
        continue;
      }
      if (!filter(entry.name)) continue;

      const content = fs.readFileSync(filePath, 'utf8');
      const transformed = transformFileContent(filePath, content);
      if (transformed !== content) {
        fs.writeFileSync(filePath, transformed);
      }
    }
  };

  walk(root);
}

function transformFileContent(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.md') return transformMarkdownContent(content);
  if (ext === '.js' || ext === '.cjs') return transformBinaryTextContent(content);
  if (ext === '.svg' || ext === '.json' || ext === '.txt' || ext === '.yml' || ext === '.yaml') {
    return applyCommonReplacements(content);
  }
  return content;
}

function transformCommandContent(content, commandName) {
  let transformed = transformMarkdownContent(content);

  transformed = transformed.replace(
    /^name: gsd:(.+?)$/m,
    'name: gsd-$1'
  );

  transformed = transformed.replace(
    /^argument-hint: "(.*)"/m,
    (_match, hint) => `argument-hint: "${hint.replace(/\/gsd:/g, '$gsd-')}"`
  );

  transformed += `\n\n---\n\n## Qwen Code CLI\n\n**Installation:**\n\`\`\`bash\n# Global\nln -s ~/.qwen/get-shit-done/skills/gsd-${commandName} ~/.qwen/skills/gsd-${commandName}\n\n# Local (project)\nln -s .qwen/get-shit-done/skills/gsd-${commandName} .qwen/skills/gsd-${commandName}\n\`\`\`\n\n**Usage:**\n\`\`\`bash\n$gsd-${commandName}\n\`\`\`\n`;

  return transformed;
}

function transformMarkdownContent(content) {
  return applyToolMappings(applyCommonReplacements(content));
}

function transformBinaryTextContent(content) {
  return applyToolMappings(applyCommonReplacements(content));
}

function applyCommonReplacements(content) {
  return content
    .replace(/\.claude/g, '.qwen')
    .replace(/get-shit-done-cc/g, 'gsd-qwen')
    .replace(/\/gsd:/g, '$gsd-');
}

function applyToolMappings(content) {
  let transformed = content;
  for (const [claudeTool, qwenTool] of Object.entries(TOOL_MAPPING)) {
    transformed = transformed.replace(new RegExp(`\\b${claudeTool}\\b`, 'g'), qwenTool);
  }
  return transformed;
}

function updateReadmeFiles() {
  for (const fileName of ['README.md', 'README.zh-CN.md']) {
    const filePath = path.join(targetDir, fileName);
    if (!fs.existsSync(filePath)) continue;

    const original = fs.readFileSync(filePath, 'utf8');
    let transformed = transformMarkdownContent(original);

    if (fileName === 'README.md') {
      transformed = transformed.replace(
        /^# GET SHIT DONE.*$/m,
        '# GET SHIT DONE for Qwen Code CLI'
      );

      transformed = transformed.replace(
        /\*\*Система .*? для .*?\*\*/m,
        '**Система мета-промптинга, контекстного инжиниринга и спеко-ориентированной разработки для Qwen Code CLI.**'
      );

      const qwenInstallSection = `
## Установка для Qwen Code CLI

\`\`\`bash
# Глобально (все проекты)
git clone https://github.com/YOUR_USERNAME/gsd-qwen.git ~/.qwen/get-shit-done

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

      if (transformed.includes('## Начало работы')) {
        transformed = transformed.replace('## Начало работы', `${qwenInstallSection}\n## Начало работы`);
      } else if (transformed.includes('## Установка')) {
        transformed = transformed.replace('## Установка', `${qwenInstallSection}\n## Установка`);
      } else {
        transformed = transformed.replace(
          /(\*\*Qwen Code CLI.*?\*\*)/,
          `$1\n\n${qwenInstallSection}`
        );
      }
    }

    if (transformed !== original) {
      fs.writeFileSync(filePath, transformed);
      console.log(`   ${fileName} -> updated`);
    }
  }
}

function updatePackageJson() {
  const packagePath = path.join(targetDir, 'package.json');

  if (!fs.existsSync(packagePath)) {
    console.warn('No package.json found');
    return;
  }

  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  if (packageData.name) {
    packageData.name = packageData.name.replace('get-shit-done-cc', 'gsd-qwen');
  }

  if (packageData.bin) {
    const newBin = {};
    for (const [key, value] of Object.entries(packageData.bin)) {
      const newKey = key.replace('get-shit-done-cc', 'gsd-qwen');
      newBin[newKey] = value;
    }
    packageData.bin = newBin;
  }

  if (packageData.description) {
    packageData.description = packageData.description.replace('Claude Code', 'Qwen Code CLI');
  }

  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
  console.log('   package.json -> updated');
}
