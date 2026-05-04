---
name: gsd-spike
description: Spike an idea through experiential exploration, or propose what to spike next (frontier mode)
argument-hint: "[idea to validate] [--quick] [--text] [--wrap-up] or [frontier]"
allowed-tools:
  - read_file
  - write_file
  - edit
  - run_shell_command
  - grep_search
  - glob
  - ask_user_question
  - web_search
  - web_fetch
  - mcp__context7__resolve-library-id
  - mcp__context7__query-docs
---
<objective>
Spike an idea through experiential exploration — build focused experiments to feel the pieces
of a future app, validate feasibility, and produce verified knowledge for the real build.
Spikes live in `.planning/spikes/` and integrate with GSD commit patterns, state tracking,
and handoff workflows.

Two modes:
- **Idea mode** (default) — describe an idea to spike
- **Frontier mode** (no argument or "frontier") — analyzes existing spike landscape and proposes integration and frontier spikes

Does not require `/gsd-new-project` — auto-creates `.planning/spikes/` if needed.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/spike.md
@~/.qwen/get-shit-done/workflows/spike-wrap-up.md
@~/.qwen/get-shit-done/references/ui-brand.md
</execution_context>

<runtime_note>
**Copilot (VS Code):** Use `vscode_askquestions` wherever this workflow calls `ask_user_question`.
</runtime_note>

<context>
Idea: $ARGUMENTS

**Available flags:**
- `--quick` — Skip decomposition/alignment, jump straight to building. Use when you already know what to spike.
- `--text` — Use plain-text numbered lists instead of ask_user_question (for non-Claude runtimes).
- `--wrap-up` — Package spike findings into a persistent project skill for future build conversations. Runs the spike-wrap-up workflow.
</context>

<process>
Parse the first token of $ARGUMENTS:
- If it is `--wrap-up`: strip the flag, execute the spike-wrap-up workflow from @~/.qwen/get-shit-done/workflows/spike-wrap-up.md.
- Otherwise: pass all of $ARGUMENTS as the idea to the spike workflow from @~/.qwen/get-shit-done/workflows/spike.md end-to-end.

Preserve all workflow gates (prior spike check, decomposition, research, risk ordering, observability assessment, verification, MANIFEST updates, commit patterns).
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-spike ~/.qwen/skills/gsd-spike

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-spike .qwen/skills/gsd-spike
```

**Usage:**
```bash
$gsd-spike
```
