---
name: gsd-settings-advanced
description: Power-user configuration — plan bounce, timeouts, branch templates, cross-AI execution, runtime knobs
allowed-tools:
  - read_file
  - write_file
  - run_shell_command
  - ask_user_question
---

<objective>
Interactive configuration of GSD power-user knobs that don't belong in the common-case `/gsd-settings` prompt.

Routes to the settings-advanced workflow which handles:
- Config existence ensuring (workstream-aware path resolution)
- Current settings reading and parsing
- Sectioned prompts: Planning Tuning, Execution Tuning, Discussion Tuning, Cross-AI Execution, Git Customization, Runtime / Output
- Config merging that preserves every unrelated key
- Confirmation table display

Use `/gsd-settings` for the common-case toggles (model profile, research/plan_check/verifier, branching strategy, context warnings). Use `/gsd-settings-advanced` once those are set and you want to tune the internals.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/settings-advanced.md
</execution_context>

<process>
**Follow the settings-advanced workflow** from `@~/.qwen/get-shit-done/workflows/settings-advanced.md`.

The workflow handles all logic including:
1. Config file creation with defaults if missing (via `gsd-sdk query config-ensure-section`)
2. Current config reading
3. Six sectioned ask_user_question batches with current values pre-selected
4. Numeric-input validation (non-numeric rejected, empty input keeps current)
5. Answer parsing and config merging (preserves unrelated keys)
6. File writing (atomic)
7. Confirmation table display
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-settings-advanced ~/.qwen/skills/gsd-settings-advanced

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-settings-advanced .qwen/skills/gsd-settings-advanced
```

**Usage:**
```bash
$gsd-settings-advanced
```
