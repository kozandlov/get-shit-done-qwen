---
name: gsd-spike-wrap-up
description: Package spike findings into a persistent project skill for future build conversations
allowed-tools:
  - read_file
  - write_file
  - edit
  - run_shell_command
  - grep_search
  - glob
  - ask_user_question
---
<objective>
Curate spike experiment findings and package them into a persistent project skill that Claude
auto-loads in future build conversations. Also writes a summary to `.planning/spikes/` for
project history. Output skill goes to `./.qwen/skills/spike-findings-[project]/` (project-local).
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/spike-wrap-up.md
@~/.qwen/get-shit-done/references/ui-brand.md
</execution_context>

<runtime_note>
**Copilot (VS Code):** Use `vscode_askquestions` wherever this workflow calls `ask_user_question`.
</runtime_note>

<process>
Execute the spike-wrap-up workflow from @~/.qwen/get-shit-done/workflows/spike-wrap-up.md end-to-end.
Preserve all curation gates (per-spike review, grouping approval, CLAUDE.md routing line).
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-spike-wrap-up ~/.qwen/skills/gsd-spike-wrap-up

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-spike-wrap-up .qwen/skills/gsd-spike-wrap-up
```

**Usage:**
```bash
$gsd-spike-wrap-up
```
