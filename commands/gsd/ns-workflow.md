---
name: gsd-workflow
description: "workflow | discuss plan execute verify phase progress"
argument-hint: ""
allowed-tools:
  - read_file
  - Skill
---

Route to the appropriate phase-pipeline skill based on the user's intent.
Sub-skill names below are post-#2790 consolidated targets — `gsd-phase`
absorbs the former add/insert/remove/edit-phase commands and `gsd-progress`
absorbs the former next/do commands.

| User wants | Invoke |
|---|---|
| Gather context before planning | gsd-discuss-phase |
| Clarify what a phase delivers | gsd-spec-phase |
| Create a PLAN.md | gsd-plan-phase |
| Execute plans in a phase | gsd-execute-phase |
| Verify built features through UAT | gsd-verify-work |
| Add / insert / remove / edit a phase | gsd-phase |
| Advance to the next logical step | gsd-progress |
| Offload planning to the ultraplan cloud | gsd-ultraplan-phase |
| Cross-AI plan review convergence loop | gsd-plan-review-convergence |

Invoke the matched skill directly using the Skill tool.


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-ns-workflow ~/.qwen/skills/gsd-ns-workflow

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-ns-workflow .qwen/skills/gsd-ns-workflow
```

**Usage:**
```bash
$gsd-ns-workflow
```
