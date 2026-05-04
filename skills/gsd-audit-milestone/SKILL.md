---
name: gsd-audit-milestone
description: Audit milestone completion against original intent before archiving
argument-hint: "[version]"
allowed-tools:
  - read_file
  - glob
  - grep_search
  - run_shell_command
  - task
  - write_file
---
<objective>
Verify milestone achieved its definition of done. Check requirements coverage, cross-phase integration, and end-to-end flows.

**This command IS the orchestrator.** Reads existing VERIFICATION.md files (phases already verified during execute-phase), aggregates tech debt and deferred gaps, then spawns integration checker for cross-phase wiring.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/audit-milestone.md
</execution_context>

<context>
Version: $ARGUMENTS (optional — defaults to current milestone)

Core planning files are resolved in-workflow (`init milestone-op`) and loaded only as needed.

**Completed Work:**
glob: .planning/phases/*/*-SUMMARY.md
glob: .planning/phases/*/*-VERIFICATION.md
</context>

<process>
Execute the audit-milestone workflow from @~/.qwen/get-shit-done/workflows/audit-milestone.md end-to-end.
Preserve all workflow gates (scope determination, verification reading, integration check, requirements coverage, routing).
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-audit-milestone ~/.qwen/skills/gsd-audit-milestone

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-audit-milestone .qwen/skills/gsd-audit-milestone
```

**Usage:**
```bash
$gsd-audit-milestone
```
