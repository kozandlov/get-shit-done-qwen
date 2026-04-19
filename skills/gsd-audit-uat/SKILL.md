---
name: gsd-audit-uat
description: Cross-phase audit of all outstanding UAT and verification items
allowed-tools:
  - read_file
  - glob
  - grep_search
  - run_shell_command
---
<objective>
Scan all phases for pending, skipped, blocked, and human_needed UAT items. Cross-reference against codebase to detect stale documentation. Produce prioritized human test plan.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/audit-uat.md
</execution_context>

<context>
Core planning files are loaded in-workflow via CLI.

**Scope:**
glob: .planning/phases/*/*-UAT.md
glob: .planning/phases/*/*-VERIFICATION.md
</context>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-audit-uat ~/.qwen/skills/gsd-audit-uat

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-audit-uat .qwen/skills/gsd-audit-uat
```

**Usage:**
```bash
$gsd-audit-uat
```
