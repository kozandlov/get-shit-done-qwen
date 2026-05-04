---
name: gsd-review
description: "quality gates | code review debug audit security eval ui"
argument-hint: ""
allowed-tools:
  - read_file
  - Skill
---

Route to the appropriate quality / review skill based on the user's intent.
`gsd-code-review-fix` was absorbed by `gsd-code-review --fix` in #2790.

| User wants | Invoke |
|---|---|
| Review code for quality and correctness | gsd-code-review |
| Auto-fix code review findings | gsd-code-review --fix |
| Audit UAT / acceptance testing | gsd-audit-uat |
| Security review of a phase | gsd-secure-phase |
| Evaluate AI response quality | gsd-eval-review |
| Review UI for design and accessibility | gsd-ui-review |
| Validate phase outputs | gsd-validate-phase |
| Debug a failing feature or error | gsd-debug |
| Forensic investigation of a broken system | gsd-forensics |

Invoke the matched skill directly using the Skill tool.


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-ns-review ~/.qwen/skills/gsd-ns-review

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-ns-review .qwen/skills/gsd-ns-review
```

**Usage:**
```bash
$gsd-ns-review
```
