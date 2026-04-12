---
name: gsd-import
description: Ingest external plans with conflict detection against project decisions before writing anything.
argument-hint: "--from <filepath>"
allowed-tools:
  - read_file
  - write_file
  - edit
  - run_shell_command
  - glob
  - grep_search
  - ask_user_question
  - task
---

<objective>
Import external plan files into the GSD planning system with conflict detection against PROJECT.md decisions.

- **--from**: Import an external plan file, detect conflicts, write as GSD PLAN.md, validate via gsd-plan-checker.

Future: `--prd` mode for PRD extraction is planned for a follow-up PR.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/import.md
@~/.qwen/get-shit-done/references/ui-brand.md
@~/.qwen/get-shit-done/references/gate-prompts.md
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the import workflow end-to-end.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-import ~/.qwen/skills/gsd-import

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-import .qwen/skills/gsd-import
```

**Usage:**
```bash
$gsd-import
```
