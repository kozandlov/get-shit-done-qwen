---
type: prompt
name: gsd-audit-fix
description: Autonomous audit-to-fix pipeline — find issues, classify, fix, test, commit
argument-hint: "--source <audit-uat> [--severity <medium|high|all>] [--max N] [--dry-run]"
allowed-tools:
  - read_file
  - write_file
  - edit
  - run_shell_command
  - grep_search
  - glob
  - Agent
  - ask_user_question
---
<objective>
Run an audit, classify findings as auto-fixable vs manual-only, then autonomously fix
auto-fixable issues with test verification and atomic commits.

Flags:
- `--max N` — maximum findings to fix (default: 5)
- `--severity high|medium|all` — minimum severity to process (default: medium)
- `--dry-run` — classify findings without fixing (shows classification table)
- `--source <audit>` — which audit to run (default: audit-uat)
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/audit-fix.md
</execution_context>

<process>
Execute the audit-fix workflow from @~/.qwen/get-shit-done/workflows/audit-fix.md end-to-end.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-audit-fix ~/.qwen/skills/gsd-audit-fix

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-audit-fix .qwen/skills/gsd-audit-fix
```

**Usage:**
```bash
$gsd-audit-fix
```
