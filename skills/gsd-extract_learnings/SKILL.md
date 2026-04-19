---
name: gsd-extract-learnings
description: Extract decisions, lessons, patterns, and surprises from completed phase artifacts
argument-hint: <phase-number>
allowed-tools:
  - read_file
  - write_file
  - run_shell_command
  - grep_search
  - glob
  - Agent
type: prompt
---
<objective>
Extract structured learnings from completed phase artifacts (PLAN.md, SUMMARY.md, VERIFICATION.md, UAT.md, STATE.md) into a LEARNINGS.md file that captures decisions, lessons learned, patterns discovered, and surprises encountered.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/extract_learnings.md
</execution_context>

Execute the extract-learnings workflow from @~/.qwen/get-shit-done/workflows/extract_learnings.md end-to-end.


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-extract_learnings ~/.qwen/skills/gsd-extract_learnings

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-extract_learnings .qwen/skills/gsd-extract_learnings
```

**Usage:**
```bash
$gsd-extract_learnings
```
