---
name: gsd-plan-milestone-gaps
description: Create phases to close all gaps identified by milestone audit
allowed-tools:
  - read_file
  - write_file
  - run_shell_command
  - glob
  - grep_search
  - ask_user_question
---
<objective>
Create all phases necessary to close gaps identified by `/gsd-audit-milestone`.

Reads MILESTONE-AUDIT.md, groups gaps into logical phases, creates phase entries in ROADMAP.md, and offers to plan each phase.

One command creates all fix phases — no manual `/gsd-add-phase` per gap.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/plan-milestone-gaps.md
</execution_context>

<context>
**Audit results:**
glob: .planning/v*-MILESTONE-AUDIT.md (use most recent)

Original intent and current planning state are loaded on demand inside the workflow.
</context>

<process>
Execute the plan-milestone-gaps workflow from @~/.qwen/get-shit-done/workflows/plan-milestone-gaps.md end-to-end.
Preserve all workflow gates (audit loading, prioritization, phase grouping, user confirmation, roadmap updates).
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-plan-milestone-gaps ~/.qwen/skills/gsd-plan-milestone-gaps

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-plan-milestone-gaps .qwen/skills/gsd-plan-milestone-gaps
```

**Usage:**
```bash
$gsd-plan-milestone-gaps
```
