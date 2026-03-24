---
name: gsd-help
description: Show available GSD commands and usage guide
---
<objective>
Display the complete GSD command reference.

Output ONLY the reference content below. Do NOT add:
- Project-specific analysis
- Git status or file context
- Next-step suggestions
- Any commentary beyond the reference
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/help.md
</execution_context>

<process>
Output the complete GSD command reference from @~/.qwen/get-shit-done/workflows/help.md.
Display the reference content directly — no additions or modifications.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-help ~/.qwen/skills/gsd-help

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-help .qwen/skills/gsd-help
```

**Usage:**
```bash
$gsd-help
```
