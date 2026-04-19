---
name: gsd-progress
description: Check project progress, show context, and route to next action (execute or plan). Use --forensic to append a 6-check integrity audit after the standard report.
argument-hint: "[--forensic]"
allowed-tools:
  - read_file
  - run_shell_command
  - grep_search
  - glob
  - SlashCommand
---
<objective>
Check project progress, summarize recent work and what's ahead, then intelligently route to the next action - either executing an existing plan or creating the next one.

Provides situational awareness before continuing work.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/progress.md
</execution_context>

<process>
Execute the progress workflow from @~/.qwen/get-shit-done/workflows/progress.md end-to-end.
Preserve all routing logic (Routes A through F) and edge case handling.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-progress ~/.qwen/skills/gsd-progress

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-progress .qwen/skills/gsd-progress
```

**Usage:**
```bash
$gsd-progress
```
