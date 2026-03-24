#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const crypto = require('crypto');

const pkg = require('../package.json');

const SOURCE_ROOT = path.resolve(__dirname, '..');
const COMMANDS_SOURCE_DIR = path.join(SOURCE_ROOT, 'commands', 'gsd');
const MANIFEST_NAME = 'gsd-file-manifest.json';
const PATCHES_DIR_NAME = 'gsd-local-patches';

const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

function expandTilde(input) {
  if (!input) return input;
  if (input === '~') return os.homedir();
  if (input.startsWith('~/')) return path.join(os.homedir(), input.slice(2));
  return input;
}

function parseArgs(argv) {
  const args = [...argv];
  const getValue = (...names) => {
    for (let i = 0; i < args.length; i += 1) {
      if (names.includes(args[i])) {
        return args[i + 1] ? expandTilde(args[i + 1]) : null;
      }
      for (const name of names) {
        const prefix = `${name}=`;
        if (args[i].startsWith(prefix)) {
          return expandTilde(args[i].slice(prefix.length));
        }
      }
    }
    return null;
  };

  return {
    global: args.includes('--global') || args.includes('-g'),
    local: args.includes('--local') || args.includes('-l'),
    uninstall: args.includes('--uninstall') || args.includes('-u'),
    help: args.includes('--help') || args.includes('-h'),
    configDir: getValue('--config-dir', '-c'),
  };
}

function getConfigRoot(mode, explicitDir = null) {
  if (explicitDir) {
    return path.resolve(expandTilde(explicitDir));
  }

  if (mode === 'global') {
    return path.join(os.homedir(), '.qwen');
  }

  if (mode === 'local') {
    return path.join(process.cwd(), '.qwen');
  }

  throw new Error(`Unknown install mode: ${mode}`);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function isGsdSkillDir(dirPath) {
  return fs.existsSync(path.join(dirPath, 'SKILL.md'));
}

function listGsdSkillNames(skillsDir) {
  if (!fs.existsSync(skillsDir)) return [];
  return fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name.startsWith('gsd-'))
    .map(entry => entry.name)
    .filter(name => isGsdSkillDir(path.join(skillsDir, name)))
    .sort();
}

function listGsdCommandNames(commandsDir) {
  if (!fs.existsSync(commandsDir)) return [];
  return fs.readdirSync(commandsDir, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => entry.name.replace(/\.md$/, ''))
    .sort();
}

function fileHash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function walkFiles(dir, baseDir = dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, baseDir, out);
      continue;
    }
    out.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'));
  }
  return out;
}

function generateManifest(rootDir) {
  const manifest = {
    version: pkg.version,
    timestamp: new Date().toISOString(),
    files: {},
  };

  const skillsDir = path.join(rootDir, 'skills');
  for (const skillName of listGsdSkillNames(skillsDir)) {
    const skillRoot = path.join(skillsDir, skillName);
    for (const relPath of walkFiles(skillRoot)) {
      manifest.files[`skills/${skillName}/${relPath}`] = fileHash(path.join(skillRoot, relPath));
    }
  }

  return manifest;
}

function writeManifest(rootDir) {
  const manifest = generateManifest(rootDir);
  fs.writeFileSync(path.join(rootDir, MANIFEST_NAME), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

function saveLocalPatches(rootDir) {
  const manifestPath = path.join(rootDir, MANIFEST_NAME);
  if (!fs.existsSync(manifestPath)) return [];

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    return [];
  }

  const modified = [];
  const patchesDir = path.join(rootDir, PATCHES_DIR_NAME);

  for (const [relPath, originalHash] of Object.entries(manifest.files || {})) {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath)) continue;

    const currentHash = fileHash(fullPath);
    if (currentHash !== originalHash) {
      const backupPath = path.join(patchesDir, relPath);
      ensureDir(path.dirname(backupPath));
      fs.copyFileSync(fullPath, backupPath);
      modified.push(relPath);
    }
  }

  if (modified.length > 0) {
    const meta = {
      backed_up_at: new Date().toISOString(),
      from_version: manifest.version,
      files: modified,
    };
    ensureDir(patchesDir);
    fs.writeFileSync(path.join(patchesDir, 'backup-meta.json'), `${JSON.stringify(meta, null, 2)}\n`);
    console.log(`  ${yellow}i${reset}  Found ${modified.length} locally modified skill file(s) — backed up to ${PATCHES_DIR_NAME}/`);
    for (const file of modified) {
      console.log(`     ${dim}${file}${reset}`);
    }
  }

  return modified;
}

function reportLocalPatches(rootDir) {
  const metaPath = path.join(rootDir, PATCHES_DIR_NAME, 'backup-meta.json');
  if (!fs.existsSync(metaPath)) return [];

  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch {
    return [];
  }

  if (!meta.files || meta.files.length === 0) return [];

  console.log('');
  console.log(`  ${yellow}Local patches detected${reset} (from v${meta.from_version}):`);
  for (const file of meta.files) {
    console.log(`     ${cyan}${file}${reset}`);
  }
  console.log('');
  console.log(`  Your modifications are saved in ${cyan}${PATCHES_DIR_NAME}/${reset}`);
  console.log(`  Reapply them with ${cyan}$gsd-reapply-patches${reset}`);
  return meta.files;
}

function removeGsdSkills(targetSkillsDir) {
  if (!fs.existsSync(targetSkillsDir)) return 0;

  let removed = 0;
  for (const entry of fs.readdirSync(targetSkillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith('gsd-')) continue;
    fs.rmSync(path.join(targetSkillsDir, entry.name), { recursive: true, force: true });
    removed += 1;
  }
  return removed;
}

function cleanupEmptyDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath);
  if (entries.length === 0) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

function copySkillTrees(sourceCommandsDir, targetSkillsDir) {
  if (!fs.existsSync(sourceCommandsDir)) {
    throw new Error(`Source commands directory not found: ${sourceCommandsDir}`);
  }

  ensureDir(targetSkillsDir);
  removeGsdSkills(targetSkillsDir);
  let installed = 0;

  for (const commandName of listGsdCommandNames(sourceCommandsDir)) {
    const sourceCommandFile = path.join(sourceCommandsDir, `${commandName}.md`);
    const targetSkillDir = path.join(targetSkillsDir, `gsd-${commandName}`);
    fs.rmSync(targetSkillDir, { recursive: true, force: true });
    ensureDir(targetSkillDir);
    fs.copyFileSync(sourceCommandFile, path.join(targetSkillDir, 'SKILL.md'));
    installed += 1;
  }

  return installed;
}

function install(mode, options = {}) {
  const configRoot = getConfigRoot(mode, options.configDir || null);
  const sourceCommandsDir = options.sourceCommandsDir || COMMANDS_SOURCE_DIR;
  const targetSkillsDir = path.join(configRoot, 'skills');

  ensureDir(configRoot);
  saveLocalPatches(configRoot);
  const installed = copySkillTrees(sourceCommandsDir, targetSkillsDir);
  const manifest = writeManifest(configRoot);
  reportLocalPatches(configRoot);

  return {
    configRoot,
    targetSkillsDir,
    installed,
    manifest,
  };
}

function uninstall(mode, options = {}) {
  const configRoot = getConfigRoot(mode, options.configDir || null);
  const targetSkillsDir = path.join(configRoot, 'skills');

  const removed = removeGsdSkills(targetSkillsDir);
  cleanupEmptyDir(targetSkillsDir);

  fs.rmSync(path.join(configRoot, MANIFEST_NAME), { force: true });
  fs.rmSync(path.join(configRoot, PATCHES_DIR_NAME), { recursive: true, force: true });
  cleanupEmptyDir(configRoot);

  return {
    configRoot,
    targetSkillsDir,
    removed,
  };
}

function showHelp() {
  console.log(`Usage: gsd-qwen [options]

Options:
  -g, --global              Install to ~/.qwen
  -l, --local               Install to ./.qwen
      --config-dir <path>   Override the Qwen config directory
  -u, --uninstall           Remove GSD-managed Qwen skills
  -h, --help                Show this help message

Examples:
  gsd-qwen --global
  gsd-qwen --local
  gsd-qwen --global --config-dir ~/.qwen-custom
  gsd-qwen --local --uninstall
  npx gsd-qwen@latest --global
`);
}

function promptMode() {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`  Install to ${cyan}global${reset} or ${cyan}local${reset}? [g/l]: `, answer => {
      rl.close();
      const value = answer.trim().toLowerCase();
      if (value === 'g' || value === 'global') {
        resolve('global');
        return;
      }
      if (value === 'l' || value === 'local') {
        resolve('local');
        return;
      }
      reject(new Error('Please answer with g/global or l/local.'));
    });
  });
}

async function runCli(argv = process.argv.slice(2)) {
  const opts = parseArgs(argv);

  if (opts.help) {
    showHelp();
    return;
  }

  if (opts.global && opts.local) {
    throw new Error('Cannot specify both --global and --local.');
  }

  const mode = opts.global ? 'global' : opts.local ? 'local' : null;
  const selectedMode = mode || (process.stdin.isTTY ? await promptMode() : 'global');

  if (opts.uninstall) {
    const result = uninstall(selectedMode, { configDir: opts.configDir });
    console.log(`  ${green}✓${reset} Removed ${result.removed} GSD skill directory(s) from ${result.configRoot}`);
    return;
  }

  const result = install(selectedMode, { configDir: opts.configDir });
  console.log(`  ${green}✓${reset} Installed ${result.installed} Qwen skill directory(s) to ${result.targetSkillsDir}`);
  console.log(`  ${green}✓${reset} Wrote file manifest (${MANIFEST_NAME})`);
}

module.exports = {
  SOURCE_ROOT,
  COMMANDS_SOURCE_DIR,
  MANIFEST_NAME,
  PATCHES_DIR_NAME,
  expandTilde,
  parseArgs,
  getConfigRoot,
  listGsdSkillNames,
  listGsdCommandNames,
  copySkillTrees,
  generateManifest,
  writeManifest,
  saveLocalPatches,
  reportLocalPatches,
  install,
  uninstall,
  showHelp,
  promptMode,
  runCli,
};

if (require.main === module) {
  runCli().catch(err => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
