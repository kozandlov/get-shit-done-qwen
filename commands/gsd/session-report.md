---
name: gsd-session-report
description: Generate a session report with token usage estimates, work summary, and outcomes
allowed-tools:
  - read_file
  - run_shell_command
  - write_file
---
<objective>
Generate a structured SESSION_REPORT.md document capturing session outcomes, work performed, and estimated resource usage. Provides a shareable artifact for post-session review.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/session-report.md
</execution_context>

<process>
Execute the session-report workflow from @~/.qwen/get-shit-done/workflows/session-report.md end-to-end.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-session-report ~/.qwen/skills/gsd-session-report

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-session-report .qwen/skills/gsd-session-report
```

**Usage:**
```bash
$gsd-session-report
```
