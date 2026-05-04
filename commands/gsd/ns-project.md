---
name: gsd-project
description: "project lifecycle | milestones audits summary"
argument-hint: ""
allowed-tools:
  - read_file
  - Skill
---

Route to the appropriate project / milestone skill based on the user's intent.
`gsd-plan-milestone-gaps` was deleted by #2790 — gap planning now happens
inline as part of `gsd-audit-milestone`'s output.

| User wants | Invoke |
|---|---|
| Start a new project | gsd-new-project |
| Create a new milestone | gsd-new-milestone |
| Complete the current milestone | gsd-complete-milestone |
| Audit a milestone for issues | gsd-audit-milestone |
| Summarize milestone status | gsd-milestone-summary |

Invoke the matched skill directly using the Skill tool.


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-ns-project ~/.qwen/skills/gsd-ns-project

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-ns-project .qwen/skills/gsd-ns-project
```

**Usage:**
```bash
$gsd-ns-project
```
