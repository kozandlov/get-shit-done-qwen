---
name: gsd-plant-seed
description: Capture a forward-looking idea with trigger conditions — surfaces automatically at the right milestone
argument-hint: "[idea summary]"
allowed-tools:
  - read_file
  - write_file
  - edit
  - run_shell_command
  - ask_user_question
---

<objective>
Capture an idea that's too big for now but should surface automatically when the right
milestone arrives. Seeds solve context rot: instead of a one-liner in Deferred that nobody
reads, a seed preserves the full WHY, WHEN to surface, and breadcrumbs to details.

Creates: .planning/seeds/SEED-NNN-slug.md
Consumed by: /gsd-new-milestone (scans seeds and presents matches)
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/plant-seed.md
</execution_context>

<process>
Execute the plant-seed workflow from @~/.qwen/get-shit-done/workflows/plant-seed.md end-to-end.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-plant-seed ~/.qwen/skills/gsd-plant-seed

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-plant-seed .qwen/skills/gsd-plant-seed
```

**Usage:**
```bash
$gsd-plant-seed
```
