---
name: gsd-scan
description: Rapid codebase assessment — lightweight alternative to /gsd-map-codebase
allowed-tools:
  - read_file
  - write_file
  - run_shell_command
  - grep_search
  - glob
  - Agent
  - ask_user_question
---
<objective>
Run a focused codebase scan for a single area, producing targeted documents in `.planning/codebase/`.
Accepts an optional `--focus` flag: `tech`, `arch`, `quality`, `concerns`, or `tech+arch` (default).

Lightweight alternative to `/gsd-map-codebase` — spawns one mapper agent instead of four parallel ones.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/scan.md
</execution_context>

<process>
Execute the scan workflow from @~/.qwen/get-shit-done/workflows/scan.md end-to-end.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-scan ~/.qwen/skills/gsd-scan

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-scan .qwen/skills/gsd-scan
```

**Usage:**
```bash
$gsd-scan
```
