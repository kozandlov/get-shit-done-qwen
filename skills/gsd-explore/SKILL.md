---
name: gsd-explore
description: Socratic ideation and idea routing — think through ideas before committing to plans
allowed-tools:
  - read_file
  - write_file
  - run_shell_command
  - grep_search
  - glob
  - task
  - ask_user_question
---
<objective>
Open-ended Socratic ideation session. Guides the developer through exploring an idea via
probing questions, optionally spawns research, then routes outputs to the appropriate GSD
artifacts (notes, todos, seeds, research questions, requirements, or new phases).

Accepts an optional topic argument: `/gsd-explore authentication strategy`
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/explore.md
</execution_context>

<process>
Execute the explore workflow from @~/.qwen/get-shit-done/workflows/explore.md end-to-end.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-explore ~/.qwen/skills/gsd-explore

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-explore .qwen/skills/gsd-explore
```

**Usage:**
```bash
$gsd-explore
```
