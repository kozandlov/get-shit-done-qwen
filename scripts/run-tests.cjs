#!/usr/bin/env node
// Cross-platform test runner — resolves test file globs via Node
// instead of relying on shell expansion (which fails on Windows PowerShell/cmd).
// Propagates NODE_V8_COVERAGE so c8 collects coverage from the child process.
'use strict';

const { execFileSync } = require('child_process');
const { existsSync } = require('fs');
const { join } = require('path');

const candidateFiles = [
  'tests/qwen-install.test.cjs',
  'tests/transform-to-qwen.test.cjs',
  'tests/sync-workflow.test.cjs',
];

const files = candidateFiles.filter(file => existsSync(join(__dirname, '..', file)));

if (files.length === 0) {
  console.error('No Qwen test files found in tests/');
  process.exit(1);
}

try {
  execFileSync(process.execPath, ['--test', ...files], {
    stdio: 'inherit',
    env: { ...process.env },
  });
} catch (err) {
  process.exit(err.status || 1);
}
