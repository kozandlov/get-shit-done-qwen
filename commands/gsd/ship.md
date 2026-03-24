---
name: gsd-ship
description: Create PR, run review, and prepare for merge after verification passes
argument-hint: "[phase number or milestone, e.g., '4' or 'v1.0']"
allowed-tools:
  - read_file
  - run_shell_command
  - grep_search
  - glob
  - write_file
  - ask_user_question
---
<objective>
Bridge local completion → merged PR. After $gsd-verify-work passes, ship the work: push branch, create PR with auto-generated body, optionally trigger review, and track the merge.

Closes the plan → execute → verify → ship loop.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/ship.md
</execution_context>

Execute the ship workflow from @~/.qwen/get-shit-done/workflows/ship.md end-to-end.


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-ship ~/.qwen/skills/gsd-ship

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-ship .qwen/skills/gsd-ship
```

**Usage:**
```bash
$gsd-ship
```
