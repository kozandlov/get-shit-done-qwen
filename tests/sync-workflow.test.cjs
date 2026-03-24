/**
 * Sync workflow contract tests.
 *
 * These checks keep the release-sync workflow anchored to the intended model:
 * release-tag snapshot -> transform -> selective sync -> marker file -> PR.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const WORKFLOW_PATH = path.join(__dirname, '..', '.github', 'workflows', 'sync-and-transform.yml');

describe('sync-and-transform workflow', () => {
  const content = fs.readFileSync(WORKFLOW_PATH, 'utf8');

  test('clones the exact upstream release tag', () => {
    assert.ok(
      content.includes('--branch "${{ needs.detect-upstream.outputs.latest_tag }}"'),
      'workflow should clone the exact upstream release tag'
    );
    assert.ok(
      content.includes('releases/latest') || content.includes('releases/tags/'),
      'workflow should query the GitHub releases API'
    );
  });

  test('records the last synced release marker', () => {
    assert.ok(
      content.includes('.github/upstream-sync.json'),
      'workflow should write a local sync marker file'
    );
    assert.ok(
      content.includes('"upstream_tag"'),
      'workflow should persist the synced upstream tag'
    );
  });

  test('syncs the transformed Qwen surface area', () => {
    for (const token of [
      'commands',
      'skills',
      'get-shit-done',
      'hooks',
      'bin',
      'docs/README.md',
      'docs/zh-CN',
      'README.zh-CN.md',
    ]) {
      assert.ok(content.includes(token), `workflow should sync ${token}`);
    }
  });
});
