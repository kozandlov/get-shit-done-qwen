---
name: gsd-verify-work
description: Validate built features through conversational UAT
argument-hint: "[phase number, e.g., '4']"
allowed-tools:
  - read_file
  - run_shell_command
  - glob
  - grep_search
  - edit
  - write_file
  - task
---
<objective>
Validate built features through conversational testing with persistent state.

Purpose: Confirm what Claude built actually works from user's perspective. One test at a time, plain text responses, no interrogation. When issues are found, automatically diagnose, plan fixes, and prepare for execution.

Output: {phase_num}-UAT.md tracking all test results. If issues found: diagnosed gaps, verified fix plans ready for /gsd-execute-phase
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/verify-work.md
@~/.qwen/get-shit-done/templates/UAT.md
</execution_context>

<context>
Phase: $ARGUMENTS (optional)
- If provided: Test specific phase (e.g., "4")
- If not provided: Check for active sessions or prompt for phase

Context files are resolved inside the workflow (`init verify-work`) and delegated via `<files_to_read>` blocks.
</context>

<process>
Execute the verify-work workflow from @~/.qwen/get-shit-done/workflows/verify-work.md end-to-end.
Preserve all workflow gates (session management, test presentation, diagnosis, fix planning, routing).
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-verify-work ~/.qwen/skills/gsd-verify-work

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-verify-work .qwen/skills/gsd-verify-work
```

**Usage:**
```bash
$gsd-verify-work
```
