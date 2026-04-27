---
name: gsd-remove-workspace
description: Remove a GSD workspace and clean up worktrees
argument-hint: "<workspace-name>"
allowed-tools:
  - run_shell_command
  - read_file
  - ask_user_question
---
<context>
**Arguments:**
- `<workspace-name>` (required) — Name of the workspace to remove
</context>

<objective>
Remove a workspace directory after confirmation. For worktree strategy, runs `git worktree remove` for each member repo first. Refuses if any repo has uncommitted changes.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/remove-workspace.md
@~/.qwen/get-shit-done/references/ui-brand.md
</execution_context>

<process>
Execute the remove-workspace workflow from @~/.qwen/get-shit-done/workflows/remove-workspace.md end-to-end.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-remove-workspace ~/.qwen/skills/gsd-remove-workspace

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-remove-workspace .qwen/skills/gsd-remove-workspace
```

**Usage:**
```bash
$gsd-remove-workspace
```
