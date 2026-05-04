---
name: gsd-ultraplan-phase
description: "[BETA] Offload plan phase to Claude Code's ultraplan cloud; review in browser and import back."
argument-hint: "[phase-number]"
allowed-tools:
  - read_file
  - run_shell_command
  - glob
  - grep_search
---

<objective>
Offload GSD's plan phase to Claude Code's ultraplan cloud infrastructure.

Ultraplan drafts the plan in a remote cloud session while your terminal stays free.
Review and comment on the plan in your browser, then import it back via /gsd-import --from.

⚠ BETA: ultraplan is in research preview. Use /gsd-plan-phase for stable local planning.
Requirements: Claude Code v2.1.91+, claude.ai account, GitHub repository.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/ultraplan-phase.md
@~/.qwen/get-shit-done/references/ui-brand.md
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the ultraplan-phase workflow end-to-end.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-ultraplan-phase ~/.qwen/skills/gsd-ultraplan-phase

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-ultraplan-phase .qwen/skills/gsd-ultraplan-phase
```

**Usage:**
```bash
$gsd-ultraplan-phase
```
