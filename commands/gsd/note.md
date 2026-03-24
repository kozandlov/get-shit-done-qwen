---
name: gsd-note
description: Zero-friction idea capture. Append, list, or promote notes to todos.
argument-hint: "<text> | list | promote <N> [--global]"
allowed-tools:
  - read_file
  - write_file
  - glob
  - grep_search
---
<objective>
Zero-friction idea capture — one write_file call, one confirmation line.

Three subcommands:
- **append** (default): Save a timestamped note file. No questions, no formatting.
- **list**: Show all notes from project and global scopes.
- **promote**: Convert a note into a structured todo.

Runs inline — no task, no ask_user_question, no run_shell_command.
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/note.md
@~/.qwen/get-shit-done/references/ui-brand.md
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the note workflow from @~/.qwen/get-shit-done/workflows/note.md end-to-end.
Capture the note, list notes, or promote to todo — depending on arguments.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-note ~/.qwen/skills/gsd-note

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-note .qwen/skills/gsd-note
```

**Usage:**
```bash
$gsd-note
```
