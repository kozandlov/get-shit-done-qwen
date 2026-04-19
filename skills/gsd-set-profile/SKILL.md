---
name: gsd-set-profile
description: Switch model profile for GSD agents (quality/balanced/budget/inherit)
argument-hint: <profile (quality|balanced|budget|inherit)>
model: haiku
allowed-tools:
  - run_shell_command
---

Show the following output to the user verbatim, with no extra commentary:

!`gsd-sdk query config-set-model-profile $ARGUMENTS --raw`


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-set-profile ~/.qwen/skills/gsd-set-profile

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-set-profile .qwen/skills/gsd-set-profile
```

**Usage:**
```bash
$gsd-set-profile
```
