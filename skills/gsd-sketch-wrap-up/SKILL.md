---
name: gsd-sketch-wrap-up
description: Package sketch design findings into a persistent project skill for future build conversations
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
Curate sketch design findings and package them into a persistent project skill that Claude
auto-loads when building the real UI. Also writes a summary to `.planning/sketches/` for
project history. Output skill goes to `./.qwen/skills/sketch-findings-[project]/` (project-local).
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/sketch-wrap-up.md
@~/.qwen/get-shit-done/references/ui-brand.md
</execution_context>

<runtime_note>
**Copilot (VS Code):** Use `vscode_askquestions` wherever this workflow calls `ask_user_question`.
</runtime_note>

<process>
Execute the sketch-wrap-up workflow from @~/.qwen/get-shit-done/workflows/sketch-wrap-up.md end-to-end.
Preserve all curation gates (per-sketch review, grouping approval, CLAUDE.md routing line).
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-sketch-wrap-up ~/.qwen/skills/gsd-sketch-wrap-up

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-sketch-wrap-up .qwen/skills/gsd-sketch-wrap-up
```

**Usage:**
```bash
$gsd-sketch-wrap-up
```
