---
name: gsd-ideate
description: "exploration capture | explore sketch spike spec capture"
argument-hint: ""
allowed-tools:
  - read_file
  - Skill
---

Route to the appropriate exploration / capture skill based on the user's intent.
`gsd-note`, `gsd-add-todo`, `gsd-add-backlog`, and `gsd-plant-seed` were folded
into `gsd-capture` (with `--note`, default, `--backlog`, `--seed` modes) by
#2790. The capture target lists pending todos via `--list`.

| User wants | Invoke |
|---|---|
| Explore an idea or opportunity | gsd-explore |
| Sketch out a rough design or plan | gsd-sketch |
| Time-boxed technical spike | gsd-spike |
| write_file a spec for a phase | gsd-spec-phase |
| Capture a thought (todo / note / backlog / seed) | gsd-capture |

Invoke the matched skill directly using the Skill tool.


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-ns-ideate ~/.qwen/skills/gsd-ns-ideate

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-ns-ideate .qwen/skills/gsd-ns-ideate
```

**Usage:**
```bash
$gsd-ns-ideate
```
