<purpose>
Check for GSD updates via npm, display changelog for versions between installed and latest, obtain user confirmation, and execute clean installation with cache clearing.
</purpose>

<required_reading>
read_file all files referenced by the invoking prompt's execution_context before starting.
</required_reading>

<process>

<step name="get_installed_version">
Detect whether GSD is installed locally or globally by checking both locations and validating install integrity.

First, derive `PREFERRED_RUNTIME` from the invoking prompt's `execution_context` path:
- Path contains `/.codex/` -> `codex`
- Path contains `/.gemini/` -> `gemini`
- Path contains `/.config/opencode/` or `/.opencode/` -> `opencode`
- Otherwise -> `claude`

Use `PREFERRED_RUNTIME` as the first runtime checked so `$gsd-update` targets the runtime that invoked it.

```bash
# Qwen-only install detection: local takes priority if valid and distinct from global.
LOCAL_VERSION_FILE="./.qwen/get-shit-done/VERSION"
GLOBAL_VERSION_FILE="$HOME/.qwen/get-shit-done/VERSION"
LOCAL_MARKER_FILE="./.qwen/get-shit-done/workflows/update.md"
GLOBAL_MARKER_FILE="$HOME/.qwen/get-shit-done/workflows/update.md"

IS_LOCAL=false
if [ -f "$LOCAL_VERSION_FILE" ] && [ -f "$LOCAL_MARKER_FILE" ] && grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+' "$LOCAL_VERSION_FILE"; then
  if [ ! -f "$GLOBAL_VERSION_FILE" ] || [ "$(cd "./.qwen" 2>/dev/null && pwd)" != "$(cd "$HOME/.qwen" 2>/dev/null && pwd)" ]; then
    IS_LOCAL=true
  fi
fi

if [ "$IS_LOCAL" = true ]; then
  INSTALLED_VERSION="$(cat "$LOCAL_VERSION_FILE")"
  INSTALL_SCOPE="LOCAL"
elif [ -f "$GLOBAL_VERSION_FILE" ] && [ -f "$GLOBAL_MARKER_FILE" ] && grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+' "$GLOBAL_VERSION_FILE"; then
  INSTALLED_VERSION="$(cat "$GLOBAL_VERSION_FILE")"
  INSTALL_SCOPE="GLOBAL"
elif [ -f "$LOCAL_MARKER_FILE" ]; then
  INSTALLED_VERSION="0.0.0"
  INSTALL_SCOPE="LOCAL"
elif [ -f "$GLOBAL_MARKER_FILE" ]; then
  INSTALLED_VERSION="0.0.0"
  INSTALL_SCOPE="GLOBAL"
else
  INSTALLED_VERSION="0.0.0"
  INSTALL_SCOPE="UNKNOWN"
fi

echo "$INSTALLED_VERSION"
echo "$INSTALL_SCOPE"
echo "qwen"
```

Parse output:
- Line 1 = installed version (`0.0.0` means unknown version)
- Line 2 = install scope (`LOCAL`, `GLOBAL`, or `UNKNOWN`)
- Line 3 = target runtime (`qwen`)
- If scope is `UNKNOWN`, proceed to install step using `--global` fallback.

**If VERSION file missing:**
```
## GSD Update

**Installed version:** Unknown

Your installation doesn't include version tracking.

Running fresh install...
```

Proceed to install step (treat as version 0.0.0 for comparison).
</step>

<step name="check_latest_version">
Check npm for latest version:

```bash
npm view gsd-qwen version 2>/dev/null
```

**If npm check fails:**
```
Couldn't check for updates (offline or npm unavailable).

To update manually: `npx gsd-qwen --global`
```

Exit.
</step>

<step name="compare_versions">
Compare installed vs latest:

**If installed == latest:**
```
## GSD Update

**Installed:** X.Y.Z
**Latest:** X.Y.Z

You're already on the latest version.
```

Exit.

**If installed > latest:**
```
## GSD Update

**Installed:** X.Y.Z
**Latest:** A.B.C

You're ahead of the latest release (development version?).
```

Exit.
</step>

<step name="show_changes_and_confirm">
**If update available**, fetch and show what's new BEFORE updating:

1. Fetch changelog from GitHub raw URL
2. Extract entries between installed and latest versions
3. Display preview and ask for confirmation:

```
## GSD Update Available

**Installed:** 1.5.10
**Latest:** 1.5.15

### What's New
────────────────────────────────────────────────────────────

## [1.5.15] - 2026-01-20

### Added
- Feature X

## [1.5.14] - 2026-01-18

### Fixed
- Bug fix Y

────────────────────────────────────────────────────────────

⚠️  **Note:** The installer performs a clean install of GSD folders:
- `commands/gsd/` will be wiped and replaced
- `get-shit-done/` will be wiped and replaced
- `agents/gsd-*` files will be replaced

(Paths are relative to the detected Qwen install location:
global: `~/.qwen/`
local: `./.qwen/`)

Your custom files in other locations are preserved:
- Custom commands not in `commands/gsd/` ✓
- Custom skills not prefixed with `gsd-` ✓
- Custom hooks ✓
- Your personal Qwen config files ✓

If you've modified any GSD files directly, they'll be automatically backed up to `gsd-local-patches/` and can be reapplied with `$gsd-reapply-patches` after the update.
```

Use ask_user_question:
- Question: "Proceed with update?"
- Options:
  - "Yes, update now"
  - "No, cancel"

**If user cancels:** Exit.
</step>

<step name="run_update">
Run the update using the install scope detected in step 1:

**If LOCAL install:**
```bash
npx -y gsd-qwen@latest --local
```

**If GLOBAL install:**
```bash
npx -y gsd-qwen@latest --global
```

**If UNKNOWN install:**
```bash
npx -y gsd-qwen@latest --global
```

Capture output. If install fails, show error and exit.

Clear the update cache so statusline indicator disappears:

```bash
# Clear update cache across Qwen directories
rm -f "./.qwen/cache/gsd-update-check.json"
rm -f "$HOME/.qwen/cache/gsd-update-check.json"
```

The SessionStart hook (`gsd-check-update.js`) writes to the Qwen cache directory, so both local and global paths must be cleared to prevent stale update indicators.
</step>

<step name="display_result">
Format completion message (changelog was already shown in confirmation step):

```
╔═══════════════════════════════════════════════════════════╗
║  GSD Updated: v1.5.10 → v1.5.15                           ║
╚═══════════════════════════════════════════════════════════╝

⚠️  Restart your runtime to pick up the new commands.

[View full changelog](https://github.com/glittercowboy/get-shit-done/blob/main/CHANGELOG.md)
```
</step>


<step name="check_local_patches">
After update completes, check if the installer detected and backed up any locally modified files:

Check for gsd-local-patches/backup-meta.json in the config directory.

**If patches found:**

```
Local patches were backed up before the update.
Run $gsd-reapply-patches to merge your modifications into the new version.
```

**If no patches:** Continue normally.
</step>
</process>

<success_criteria>
- [ ] Installed version read correctly
- [ ] Latest version checked via npm
- [ ] Update skipped if already current
- [ ] Changelog fetched and displayed BEFORE update
- [ ] Clean install warning shown
- [ ] User confirmation obtained
- [ ] Update executed successfully
- [ ] Restart reminder shown
</success_criteria>
