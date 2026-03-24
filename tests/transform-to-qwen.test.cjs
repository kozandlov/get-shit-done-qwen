/**
 * GSD Transform Tests
 *
 * Verifies that scripts/transform-to-qwen.js rewrites an upstream snapshot
 * into the Qwen-shaped repository layout and content.
 */

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SCRIPT = path.join(__dirname, '..', 'scripts', 'transform-to-qwen.js');

function runTransform(sourceDir, targetDir, upstreamVersion = 'v1.2.3') {
  fs.cpSync(sourceDir, targetDir, { recursive: true });
  execFileSync(process.execPath, [
    SCRIPT,
    '--source', sourceDir,
    '--target', targetDir,
    '--upstream-version', upstreamVersion,
  ], { encoding: 'utf8' });
}

describe('transform-to-qwen.js', () => {
  let tmpDir;
  let sourceDir;
  let targetDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsd-transform-'));
    sourceDir = path.join(tmpDir, 'source');
    targetDir = path.join(tmpDir, 'target');
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(targetDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('rewrites commands, docs, hooks, assets and package metadata', () => {
    fs.mkdirSync(path.join(sourceDir, 'commands', 'gsd'), { recursive: true });
    fs.mkdirSync(path.join(sourceDir, 'get-shit-done', 'workflows'), { recursive: true });
    fs.mkdirSync(path.join(sourceDir, 'get-shit-done', 'bin', 'lib'), { recursive: true });
    fs.mkdirSync(path.join(sourceDir, 'docs', 'zh-CN'), { recursive: true });
    fs.mkdirSync(path.join(sourceDir, 'hooks'), { recursive: true });
    fs.mkdirSync(path.join(sourceDir, 'assets'), { recursive: true });

    fs.writeFileSync(
      path.join(sourceDir, 'commands', 'gsd', 'demo.md'),
      `---\nname: gsd-demo\ndescription: Demo command\nallowed-tools:\n  - Read\n  - Bash\n---\n\nUse /gsd:demo and ~/.claude/ here.\n`
    );

    fs.writeFileSync(
      path.join(sourceDir, 'get-shit-done', 'workflows', 'demo.md'),
      `# Demo\n\nUse /gsd:help and ~/.claude/get-shit-done.\n`
    );

    fs.writeFileSync(
      path.join(sourceDir, 'get-shit-done', 'bin', 'lib', 'core.cjs'),
      `const home = '.claude';\nconst cmd = '/gsd:help';\nmodule.exports = { home, cmd };\n`
    );

    fs.writeFileSync(
      path.join(sourceDir, 'docs', 'README.md'),
      `# Docs\n\nUse /gsd:new-project from ~/.claude/.\n`
    );

    fs.writeFileSync(
      path.join(sourceDir, 'docs', 'zh-CN', 'guide.md'),
      `# 指南\n\n运行 /gsd:plan-phase 1，并检查 ~/.claude/。\n`
    );

    fs.writeFileSync(
      path.join(sourceDir, 'hooks', 'gsd-statusline.js'),
      `const dir = path.join(homeDir, '.claude');\nconst hint = '/gsd:update';\n`
    );

    fs.writeFileSync(
      path.join(sourceDir, 'assets', 'terminal.svg'),
      `<svg><text>npx get-shit-done-cc</text></svg>\n`
    );

    fs.writeFileSync(
      path.join(sourceDir, 'README.md'),
      `# GET SHIT DONE\n\n**Система мета-промптинга для Claude Code.**\n\n## Начало работы\n`
    );

    fs.writeFileSync(
      path.join(sourceDir, 'package.json'),
      JSON.stringify({
        name: 'get-shit-done-cc',
        description: 'Get Shit Done for Claude Code CLI',
        bin: {
          'get-shit-done-cc': './bin/install.js',
        },
      }, null, 2)
    );

    fs.writeFileSync(
      path.join(sourceDir, 'package-lock.json'),
      JSON.stringify({
        name: 'get-shit-done-cc',
        lockfileVersion: 3,
      }, null, 2)
    );

    runTransform(sourceDir, targetDir, 'v9.9.9');

    const skillPath = path.join(targetDir, 'skills', 'gsd-demo', 'SKILL.md');
    assert.ok(fs.existsSync(skillPath), 'skill should be generated');

    const commandContent = fs.readFileSync(path.join(targetDir, 'commands', 'gsd', 'demo.md'), 'utf8');
    assert.ok(commandContent.includes('$gsd-demo'), 'commands should be converted to Qwen command syntax');
    assert.ok(commandContent.includes('~/.qwen/'), 'commands should use Qwen paths');

    const skillContent = fs.readFileSync(skillPath, 'utf8');
    assert.ok(skillContent.includes('name: gsd-demo'), 'skill should keep command name');
    assert.ok(skillContent.includes('$gsd-demo'), 'skill should use Qwen command syntax');

    const workflowContent = fs.readFileSync(path.join(targetDir, 'get-shit-done', 'workflows', 'demo.md'), 'utf8');
    assert.ok(workflowContent.includes('$gsd-help'), 'workflow markdown should convert command syntax');
    assert.ok(workflowContent.includes('~/.qwen/get-shit-done'), 'workflow markdown should convert paths');

    const binContent = fs.readFileSync(path.join(targetDir, 'get-shit-done', 'bin', 'lib', 'core.cjs'), 'utf8');
    assert.ok(binContent.includes('.qwen'), 'binary text should convert .claude to .qwen');
    assert.ok(binContent.includes('$gsd-help'), 'binary text should convert command syntax');

    const docsContent = fs.readFileSync(path.join(targetDir, 'docs', 'README.md'), 'utf8');
    assert.ok(docsContent.includes('$gsd-new-project'), 'docs markdown should convert command syntax');
    assert.ok(docsContent.includes('~/.qwen/'), 'docs markdown should convert paths');

    const zhDocsContent = fs.readFileSync(path.join(targetDir, 'docs', 'zh-CN', 'guide.md'), 'utf8');
    assert.ok(zhDocsContent.includes('$gsd-plan-phase'), 'localized docs should convert command syntax');
    assert.ok(zhDocsContent.includes('~/.qwen/'), 'localized docs should convert paths');

    const hookContent = fs.readFileSync(path.join(targetDir, 'hooks', 'gsd-statusline.js'), 'utf8');
    assert.ok(hookContent.includes('.qwen'), 'hooks should convert config directory paths');
    assert.ok(hookContent.includes('$gsd-update'), 'hooks should convert command syntax');

    const assetContent = fs.readFileSync(path.join(targetDir, 'assets', 'terminal.svg'), 'utf8');
    assert.ok(assetContent.includes('gsd-qwen'), 'assets should convert package names');

    const readmeContent = fs.readFileSync(path.join(targetDir, 'README.md'), 'utf8');
    assert.ok(readmeContent.includes('Qwen Code CLI'), 'README should be retitled for Qwen');
    assert.ok(readmeContent.includes('$gsd-new-project'), 'README should use Qwen command syntax');

    const packageJson = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf8'));
    assert.strictEqual(packageJson.name, 'gsd-qwen', 'package name should be updated');
    assert.strictEqual(packageJson.bin['gsd-qwen'], './bin/install.js', 'bin entry should be renamed');
    assert.ok(packageJson.description.includes('Qwen Code CLI'), 'description should mention Qwen');

    const lockJson = JSON.parse(fs.readFileSync(path.join(targetDir, 'package-lock.json'), 'utf8'));
    assert.strictEqual(lockJson.name, 'gsd-qwen', 'package-lock should be updated');
  });
});
