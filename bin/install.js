#!/usr/bin/env node

/**
 * GSD-Qwen Installer
 * Устанавливает скиллы GSD для Qwen Code CLI
 * 
 * Использование:
 *   node install.js --global    # Глобально (~/.qwen/)
 *   node install.js --local     # Локально (./.qwen/)
 *   node install.js --uninstall # Удалить
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const isGlobal = args.includes('--global');
const isLocal = args.includes('--local') || !isGlobal;
const isUninstall = args.includes('--uninstall');
const isHelp = args.includes('--help') || args.includes('-h');

if (isHelp) {
  console.log(`GSD-Qwen Installer

Использование:
  node install.js [опции]

Опции:
  --global    Установить глобально (~/.qwen/skills/)
  --local     Установить локально в текущий проект (./.qwen/skills/)
  --uninstall Удалить установленные скиллы
  --help, -h  Показать эту справку

По умолчанию используется --local если не указано иное.

Примеры:
  node install.js --global     # Глобальная установка
  node install.js --local      # Локальная установка
  node install.js --uninstall  # Удаление
`);
  process.exit(0);
}

// Определяем целевую директорию
const targetDir = isGlobal
  ? path.join(process.env.HOME || process.env.USERPROFILE, '.qwen')
  : path.join(process.cwd(), '.qwen');

const skillsDir = path.join(targetDir, 'skills');

// Директория с исходными скиллами (относительно скрипта)
const scriptDir = path.dirname(__filename);
const projectRoot = path.resolve(scriptDir, '..');
const sourceSkillsDir = path.join(projectRoot, 'skills');

console.log('🔧 GSD-Qwen Installer\n');

if (isUninstall) {
  uninstall();
} else {
  install();
}

function install() {
  console.log(`📦 Установка ${isGlobal ? 'глобально' : 'локально'}...`);
  console.log(`   Целевая директория: ${targetDir}\n`);

  // Создаём директорию
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`   ✓ Создана директория: ${targetDir}`);
  }

  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
    console.log(`   ✓ Создана директория: ${skillsDir}`);
  }

  // Копируем скиллы
  console.log('\n📋 Копирование скиллов...');
  
  if (!fs.existsSync(sourceSkillsDir)) {
    console.error('   ❌ Директория skills не найдена!');
    console.error(`   Ожидаемый путь: ${sourceSkillsDir}`);
    console.error('   Убедитесь, что скрипт запускается из директории gsd-qwen');
    process.exit(1);
  }

  const skills = fs.readdirSync(sourceSkillsDir);
  let copiedCount = 0;
  
  for (const skill of skills) {
    const sourcePath = path.join(sourceSkillsDir, skill);
    const destPath = path.join(skillsDir, skill);
    
    if (!fs.statSync(sourcePath).isDirectory()) continue;
    
    // Проверяем, есть ли SKILL.md внутри
    const skillFile = path.join(sourcePath, 'SKILL.md');
    if (!fs.existsSync(skillFile)) {
      console.log(`   ⚠️  Пропущено: ${skill} (нет SKILL.md)`);
      continue;
    }
    
    // Удаляем существующий скилл
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true });
    }
    
    // Копируем скилл
    fs.cpSync(sourcePath, destPath, { recursive: true });
    copiedCount++;
    console.log(`   ✓ ${skill}`);
  }

  console.log(`\n   Скопировано скиллов: ${copiedCount}`);

  // При глобальной установке показываем инструкцию для symlink
  if (isGlobal) {
    console.log('\n📎 Глобальная установка завершена!');
    console.log('\nДля использования в конкретных проектах создайте symlink:');
    console.log(`   ln -s ${skillsDir}/* ${path.join(process.cwd(), '.qwen', 'skills')}/`);
    console.log('\nИли используйте локальную установку для каждого проекта.');
  } else {
    console.log('\n✅ Локальная установка завершена!');
  }

  console.log('\n📖 Использование:');
  console.log('   $gsd-new-project       # Инициализация проекта');
  console.log('   $gsd-plan-phase 1      # Планирование фазы 1');
  console.log('   $gsd-execute-phase 1   # Выполнение фазы 1');
  console.log('   $gsd-verify-work 1     # Верификация работы');
  console.log('   $gsd-help              # Все команды\n');
}

function uninstall() {
  console.log(`🗑️  Удаление ${isGlobal ? 'глобально' : 'локально'}...\n`);

  if (!fs.existsSync(skillsDir)) {
    console.log('   Директория skills не найдена. Нечего удалять.');
    return;
  }

  // Получаем список всех скиллов gsd-*
  const allSkills = fs.readdirSync(skillsDir);
  const gsdSkills = allSkills.filter(name => name.startsWith('gsd-'));
  
  let removedCount = 0;

  for (const skill of gsdSkills) {
    const skillPath = path.join(skillsDir, skill);
    
    if (fs.existsSync(skillPath)) {
      fs.rmSync(skillPath, { recursive: true, force: true });
      removedCount++;
    }
  }

  console.log(`   ✓ Удалено скиллов: ${removedCount}`);

  // Очищаем пустую директорию skills
  try {
    if (fs.existsSync(skillsDir) && fs.readdirSync(skillsDir).length === 0) {
      fs.rmdirSync(skillsDir);
      console.log(`   ✓ Удалена пустая директория: ${skillsDir}`);
    }
  } catch (e) {
    // Игнорируем ошибки
  }

  // Очищаем пустую директорию .qwen
  try {
    const qwenDir = path.dirname(skillsDir);
    if (fs.existsSync(qwenDir) && fs.readdirSync(qwenDir).length === 0) {
      fs.rmdirSync(qwenDir);
      console.log(`   ✓ Удалена пустая директория: ${qwenDir}`);
    }
  } catch (e) {
    // Игнорируем ошибки
  }

  console.log('\n✅ Удаление завершено!\n');
}
