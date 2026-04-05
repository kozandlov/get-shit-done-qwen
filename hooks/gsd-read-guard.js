#!/usr/bin/env node
// gsd-hook-version: {{GSD_VERSION}}
// GSD read_file Guard — PreToolUse hook
// Injects advisory guidance when write_file/edit targets an existing file,
// reminding the model to read_file the file first.
//
// Background: Non-Claude models (e.g. MiniMax M2.5 on OpenCode) don't
// natively follow the read-before-edit pattern. When they attempt to
// write_file/edit an existing file without reading it, the runtime rejects
// with "You must read file before overwriting it." The model retries
// without reading, creating an infinite loop that burns through usage.
//
// This hook prevents that loop by injecting clear guidance BEFORE the
// tool call reaches the runtime. The model sees the advisory and can
// issue a read_file call on the next turn.
//
// Triggers on: write_file and edit tool calls
// Action: Advisory (does not block) — injects read-first guidance
// Only fires when the target file already exists on disk.

const fs = require('fs');
const path = require('path');

let input = '';
const stdinTimeout = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input);
    const toolName = data.tool_name;

    // Only intercept write_file and edit tool calls
    if (toolName !== 'write_file' && toolName !== 'edit') {
      process.exit(0);
    }

    const filePath = data.tool_input?.file_path || '';
    if (!filePath) {
      process.exit(0);
    }

    // Only inject guidance when the file already exists.
    // New files don't need a prior read_file — the runtime allows creating them directly.
    let fileExists = false;
    try {
      fs.accessSync(filePath, fs.constants.F_OK);
      fileExists = true;
    } catch {
      // File does not exist — no guidance needed
    }

    if (!fileExists) {
      process.exit(0);
    }

    const fileName = path.basename(filePath);

    // Advisory guidance — does not block the operation
    const output = {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        additionalContext:
          `READ-BEFORE-EDIT REMINDER: You are about to modify "${fileName}" which already exists. ` +
          'If you have not already used the read_file tool to read this file in the current session, ' +
          'you MUST read_file it first before editing. The runtime will reject edits to files that ' +
          'have not been read. Use the read_file tool on this file path, then retry your edit.',
      },
    };

    process.stdout.write(JSON.stringify(output));
  } catch {
    // Silent fail — never block tool execution
    process.exit(0);
  }
});
