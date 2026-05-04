---
name: gsd-context
description: "codebase intelligence | map graphify docs learnings"
argument-hint: ""
allowed-tools:
  - read_file
  - Skill
---

Route to the appropriate codebase-intelligence skill based on the user's intent.
`gsd-scan` and `gsd-intel` were folded into `gsd-map-codebase` flags by #2790.

| User wants | Invoke |
|---|---|
| Map the full codebase structure | gsd-map-codebase |
| Quick lightweight codebase scan | gsd-map-codebase --fast |
| Query mapped intelligence files | gsd-map-codebase --query |
| Generate a knowledge graph | gsd-graphify |
| Update project documentation | gsd-docs-update |
| Extract learnings from a completed phase | gsd-extract-learnings |

Invoke the matched skill directly using the Skill tool.


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-ns-context ~/.qwen/skills/gsd-ns-context

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-ns-context .qwen/skills/gsd-ns-context
```

**Usage:**
```bash
$gsd-ns-context
```
