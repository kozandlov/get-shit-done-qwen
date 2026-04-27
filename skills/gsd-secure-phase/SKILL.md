---
name: gsd-secure-phase
description: Retroactively verify threat mitigations for a completed phase
argument-hint: "[phase number]"
allowed-tools:
  - read_file
  - write_file
  - edit
  - run_shell_command
  - glob
  - grep_search
  - task
  - ask_user_question
---
<objective>
Verify threat mitigations for a completed phase. Three states:
- (A) SECURITY.md exists — audit and verify mitigations
- (B) No SECURITY.md, PLAN.md with threat model exists — run from artifacts
- (C) Phase not executed — exit with guidance

Output: updated SECURITY.md.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/secure-phase.md
</execution_context>

<context>
Phase: $ARGUMENTS — optional, defaults to last completed phase.
</context>

<process>
Execute @~/.qwen/get-shit-done/workflows/secure-phase.md.
Preserve all workflow gates.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-secure-phase ~/.qwen/skills/gsd-secure-phase

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-secure-phase .qwen/skills/gsd-secure-phase
```

**Usage:**
```bash
$gsd-secure-phase
```
