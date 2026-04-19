---
name: gsd-add-phase
description: Add phase to end of current milestone in roadmap
argument-hint: <description>
allowed-tools:
  - read_file
  - write_file
  - run_shell_command
---

<objective>
Add a new integer phase to the end of the current milestone in the roadmap.

Routes to the add-phase workflow which handles:
- Phase number calculation (next sequential integer)
- Directory creation with slug generation
- Roadmap structure updates
- STATE.md roadmap evolution tracking
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/add-phase.md
</execution_context>

<context>
Arguments: $ARGUMENTS (phase description)

Roadmap and state are resolved in-workflow via `init phase-op` and targeted tool calls.
</context>

<process>
**Follow the add-phase workflow** from `@~/.qwen/get-shit-done/workflows/add-phase.md`.

The workflow handles all logic including:
1. Argument parsing and validation
2. Roadmap existence checking
3. Current milestone identification
4. Next phase number calculation (ignoring decimals)
5. Slug generation from description
6. Phase directory creation
7. Roadmap entry insertion
8. STATE.md updates
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-add-phase ~/.qwen/skills/gsd-add-phase

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-add-phase .qwen/skills/gsd-add-phase
```

**Usage:**
```bash
$gsd-add-phase
```
