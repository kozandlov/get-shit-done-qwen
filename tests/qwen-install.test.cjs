/**
 * Qwen installer tests.
 *
 * These cover the Qwen-only install flow exposed by bin/install.js.
 */

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const installer = require('../bin/install.js');

const INSTALL_PATH = path.join(__dirname, '..', 'bin', 'install.js');
const REPO_ROOT = path.join(__dirname, '..');

describe('Qwen installer helpers', () => {
  test('resolves global and local config roots', () => {
    assert.strictEqual(installer.getConfigRoot('global'), path.join(os.homedir(), '.qwen'));
    assert.strictEqual(installer.getConfigRoot('local'), path.join(process.cwd(), '.qwen'));
  });

  test('respects explicit config dir overrides', () => {
    assert.strictEqual(installer.getConfigRoot('global', '~/custom-qwen'), path.join(os.homedir(), 'custom-qwen'));
  });

  test('help text is Qwen-only', () => {
    const help = execFileSync(process.execPath, [INSTALL_PATH, '--help'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });

    assert.ok(help.includes('Install to ~/.qwen'));
    assert.ok(help.includes('Install to ./.qwen'));
    assert.ok(!help.includes('--copilot'));
    assert.ok(!help.includes('--claude'));
    assert.ok(!help.includes('--gemini'));
  });
});

describe('Qwen install flow', () => {
  let tmpDir;
  let configDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsd-qwen-install-'));
    configDir = path.join(tmpDir, '.qwen');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('installs skills and writes a manifest', () => {
    const output = execFileSync(process.execPath, [INSTALL_PATH, '--local'], {
      cwd: tmpDir,
      encoding: 'utf8',
    });

    assert.ok(output.includes('Installed'), 'installer should report success');
    assert.ok(fs.existsSync(path.join(configDir, 'skills', 'gsd-health', 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(configDir, installer.MANIFEST_NAME)));
  });

  test('reinstall removes stale gsd skills but preserves custom content', () => {
    const skillsDir = path.join(configDir, 'skills');
    fs.mkdirSync(path.join(skillsDir, 'gsd-stale'), { recursive: true });
    fs.writeFileSync(path.join(skillsDir, 'gsd-stale', 'SKILL.md'), 'old');
    fs.mkdirSync(path.join(skillsDir, 'custom-skill'), { recursive: true });
    fs.writeFileSync(path.join(skillsDir, 'custom-skill', 'SKILL.md'), 'custom');

    execFileSync(process.execPath, [INSTALL_PATH, '--local'], {
      cwd: tmpDir,
      encoding: 'utf8',
    });

    assert.ok(!fs.existsSync(path.join(skillsDir, 'gsd-stale')), 'stale GSD skill should be removed');
    assert.ok(fs.existsSync(path.join(skillsDir, 'custom-skill')), 'custom skill should be preserved');
    assert.ok(fs.existsSync(path.join(skillsDir, 'gsd-health', 'SKILL.md')), 'fresh GSD skill should exist');
  });

  test('uninstall removes only GSD-managed skills and manifest', () => {
    fs.mkdirSync(path.join(configDir, 'skills', 'custom-skill'), { recursive: true });
    fs.writeFileSync(path.join(configDir, 'skills', 'custom-skill', 'SKILL.md'), 'custom');

    execFileSync(process.execPath, [INSTALL_PATH, '--local'], {
      cwd: tmpDir,
      encoding: 'utf8',
    });

    const uninstallOutput = execFileSync(process.execPath, [INSTALL_PATH, '--local', '--uninstall'], {
      cwd: tmpDir,
      encoding: 'utf8',
    });

    assert.ok(uninstallOutput.includes('Removed'), 'uninstall should report success');
    assert.ok(!fs.existsSync(path.join(configDir, 'skills', 'gsd-health')), 'installed GSD skill should be removed');
    assert.ok(fs.existsSync(path.join(configDir, 'skills', 'custom-skill')), 'custom skill should remain');
    assert.ok(!fs.existsSync(path.join(configDir, installer.MANIFEST_NAME)), 'manifest should be removed');
  });
});
