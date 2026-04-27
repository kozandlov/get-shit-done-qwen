---
name: gsd-ai-integration-phase
description: Generate AI design contract (AI-SPEC.md) for phases that involve building AI systems — framework selection, implementation guidance from official docs, and evaluation strategy
argument-hint: "[phase number]"
allowed-tools:
  - read_file
  - write_file
  - run_shell_command
  - glob
  - grep_search
  - task
  - web_fetch
  - web_search
  - ask_user_question
  - mcp__context7__*
---
<objective>
Create an AI design contract (AI-SPEC.md) for a phase involving AI system development.
Orchestrates gsd-framework-selector → gsd-ai-researcher → gsd-domain-researcher → gsd-eval-planner.
Flow: Select Framework → Research Docs → Research Domain → Design Eval Strategy → Done
</objective>

<execution_context>
@~/.qwen/get-shit-done/workflows/ai-integration-phase.md
@~/.qwen/get-shit-done/references/ai-frameworks.md
@~/.qwen/get-shit-done/references/ai-evals.md
</execution_context>

<context>
Phase number: $ARGUMENTS — optional, auto-detects next unplanned phase if omitted.
</context>

<process>
Execute @~/.qwen/get-shit-done/workflows/ai-integration-phase.md end-to-end.
Preserve all workflow gates.
</process>


---

## Qwen Code CLI

**Installation:**
```bash
# Global
ln -s ~/.qwen/get-shit-done/skills/gsd-ai-integration-phase ~/.qwen/skills/gsd-ai-integration-phase

# Local (project)
ln -s .qwen/get-shit-done/skills/gsd-ai-integration-phase .qwen/skills/gsd-ai-integration-phase
```

**Usage:**
```bash
$gsd-ai-integration-phase
```
