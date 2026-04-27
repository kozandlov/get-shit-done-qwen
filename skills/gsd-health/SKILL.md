---
name: gsd-health
description: Diagnose planning directory health and optionally repair issues
argument-hint: [--repair]
allowed-tools:
  - read_file
  - run_shell_command
  - write_file
  - ask_user_question
---
<objective>
Validate `.planning/` directory integrity and report actionable issues. Checks for missing files, invalid configurations, inconsistent state, and orphaned plans.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/health.md
</execution_context>

<process>
Execute the health workflow from @~/.qwen/get-shit-done/workflows/health.md end-to-end.
Parse --repair flag from arguments and pass to workflow.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-health ~/.qwen/skills/gsd-health

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-health .qwen/skills/gsd-health
```

**Usage:**
```bash
$gsd-health
```
