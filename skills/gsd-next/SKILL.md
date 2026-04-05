---
name: gsd-next
description: Automatically advance to the next logical step in the GSD workflow
allowed-tools:
  - read_file
  - run_shell_command
  - grep_search
  - glob
  - SlashCommand
---
<objective>
Detect the current project state and automatically invoke the next logical GSD workflow step.
No arguments needed — reads STATE.md, ROADMAP.md, and phase directories to determine what comes next.

Designed for rapid multi-project workflows where remembering which phase/step you're on is overhead.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/next.md
</execution_context>

<process>
Execute the next workflow from @~/.qwen/get-shit-done/workflows/next.md end-to-end.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-next ~/.qwen/skills/gsd-next

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-next .qwen/skills/gsd-next
```

**Usage:**
```bash
$gsd-next
```
