---
name: gsd-validate-phase
description: Retroactively audit and fill Nyquist validation gaps for a completed phase
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
Audit Nyquist validation coverage for a completed phase. Three states:
- (A) VALIDATION.md exists — audit and fill gaps
- (B) No VALIDATION.md, SUMMARY.md exists — reconstruct from artifacts
- (C) Phase not executed — exit with guidance

Output: updated VALIDATION.md + generated test files.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/validate-phase.md
</execution_context>

<context>
Phase: $ARGUMENTS — optional, defaults to last completed phase.
</context>

<process>
Execute @~/.qwen/get-shit-done/workflows/validate-phase.md.
Preserve all workflow gates.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-validate-phase ~/.qwen/skills/gsd-validate-phase

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-validate-phase .qwen/skills/gsd-validate-phase
```

**Usage:**
```bash
$gsd-validate-phase
```
