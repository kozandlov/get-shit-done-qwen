---
name: gsd-undo
description: "Safe git revert. Roll back phase or plan commits using the phase manifest with dependency checks."
argument-hint: "--last N | --phase NN | --plan NN-MM"
allowed-tools:
  - read_file
  - run_shell_command
  - glob
  - grep_search
  - ask_user_question
---

<objective>
Safe git revert — roll back GSD phase or plan commits using the phase manifest, with dependency checks and a confirmation gate before execution.

Three modes:
- **--last N**: Show recent GSD commits for interactive selection
- **--phase NN**: Revert all commits for a phase (manifest + git log fallback)
- **--plan NN-MM**: Revert all commits for a specific plan
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/undo.md
@~/.qwen/get-shit-done/references/ui-brand.md
@~/.qwen/get-shit-done/references/gate-prompts.md
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the undo workflow from @~/.qwen/get-shit-done/workflows/undo.md end-to-end.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-undo ~/.qwen/skills/gsd-undo

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-undo .qwen/skills/gsd-undo
```

**Usage:**
```bash
$gsd-undo
```
