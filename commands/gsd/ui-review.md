---
name: gsd-ui-review
description: Retroactive 6-pillar visual audit of implemented frontend code
argument-hint: "[phase]"
allowed-tools:
  - read_file
  - write_file
  - run_shell_command
  - glob
  - grep_search
  - task
  - ask_user_question
---
<objective>
Conduct a retroactive 6-pillar visual audit. Produces UI-REVIEW.md with
graded assessment (1-4 per pillar). Works on any project.
Output: {phase_num}-UI-REVIEW.md
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/ui-review.md
@~/.qwen/get-shit-done/references/ui-brand.md
</execution_context>

<context>
Phase: $ARGUMENTS — optional, defaults to last completed phase.
</context>

<process>
Execute @~/.qwen/get-shit-done/workflows/ui-review.md end-to-end.
Preserve all workflow gates.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-ui-review ~/.qwen/skills/gsd-ui-review

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-ui-review .qwen/skills/gsd-ui-review
```

**Usage:**
```bash
$gsd-ui-review
```
