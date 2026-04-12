---
name: gsd-eval-review
description: Retroactively audit an executed AI phase's evaluation coverage — scores each eval dimension as COVERED/PARTIAL/MISSING and produces an actionable EVAL-REVIEW.md with remediation plan
argument-hint: "[phase number]"
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
Conduct a retroactive evaluation coverage audit of a completed AI phase.
Checks whether the evaluation strategy from AI-SPEC.md was implemented.
Produces EVAL-REVIEW.md with score, verdict, gaps, and remediation plan.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/eval-review.md
@~/.qwen/get-shit-done/references/ai-evals.md
</execution_context>

<context>
Phase: $ARGUMENTS — optional, defaults to last completed phase.
</context>

<process>
Execute @~/.qwen/get-shit-done/workflows/eval-review.md end-to-end.
Preserve all workflow gates.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-eval-review ~/.qwen/skills/gsd-eval-review

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-eval-review .qwen/skills/gsd-eval-review
```

**Usage:**
```bash
$gsd-eval-review
```
