---
name: gsd-stats
description: Display project statistics — phases, plans, requirements, git metrics, and timeline
allowed-tools:
  - read_file
  - run_shell_command
---
<objective>
Display comprehensive project statistics including phase progress, plan execution metrics, requirements completion, git history stats, and project timeline.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/stats.md
</execution_context>

<process>
Execute the stats workflow from @~/.qwen/get-shit-done/workflows/stats.md end-to-end.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-stats ~/.qwen/skills/gsd-stats

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-stats .qwen/skills/gsd-stats
```

**Usage:**
```bash
$gsd-stats
```
