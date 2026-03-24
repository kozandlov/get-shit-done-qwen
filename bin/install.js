#!/usr/bin/env node

'use strict';

const installer = require('./install-qwen.js');

if (require.main === module) {
  installer.runCli(process.argv.slice(2)).catch(err => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}

module.exports = installer;
