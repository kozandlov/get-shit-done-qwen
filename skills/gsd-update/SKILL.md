---
name: gsd-update
description: Update GSD to latest version with changelog display
allowed-tools:
  - run_shell_command
  - ask_user_question
---

<objective>
Check for GSD updates, install if available, and display what changed.

Routes to the update workflow which handles:
- Version detection (local vs global installation)
- npm version checking
- Changelog fetching and display
- User confirmation with clean install warning
- Update execution and cache clearing
- Restart reminder
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/update.md
</execution_context>

<process>
**Follow the update workflow** from `@~/.qwen/get-shit-done/workflows/update.md`.

The workflow handles all logic including:
1. Installed version detection (local/global)
2. Latest version checking via npm
3. Version comparison
4. Changelog fetching and extraction
5. Clean install warning display
6. User confirmation
7. Update execution
8. Cache clearing
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-update ~/.qwen/skills/gsd-update

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-update .qwen/skills/gsd-update
```

**Usage:**
```bash
$gsd-update
```
