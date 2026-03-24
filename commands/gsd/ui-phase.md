---
name: gsd-ui-phase
description: Generate UI design contract (UI-SPEC.md) for frontend phases
argument-hint: "[phase]"
allowed-tools:
  - read_file
  - write_file
  - run_shell_command
  - glob
  - grep_search
  - task
  - web_fetch
  - ask_user_question
  - mcp__context7__*
---
<objective>
Create a UI design contract (UI-SPEC.md) for a frontend phase.
Orchestrates gsd-ui-researcher and gsd-ui-checker.
Flow: Validate → Research UI → Verify UI-SPEC → Done
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/ui-phase.md
@~/.qwen/get-shit-done/references/ui-brand.md
</execution_context>

<context>
Phase number: $ARGUMENTS — optional, auto-detects next unplanned phase if omitted.
</context>

<process>
Execute @~/.qwen/get-shit-done/workflows/ui-phase.md end-to-end.
Preserve all workflow gates.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-ui-phase ~/.qwen/skills/gsd-ui-phase

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-ui-phase .qwen/skills/gsd-ui-phase
```

**Usage:**
```bash
$gsd-ui-phase
```
