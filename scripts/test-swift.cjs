'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
if (process.platform !== 'darwin') throw new Error('Swift integration tests require macOS');
const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'taskio-review-swift-test-'));
try {
  const output = path.join(staging, 'test-review');
  execFileSync('xcrun', ['swiftc', '-swift-version', '6', '-parse-as-library',
    path.join(__dirname, '../src/mac.swift'),
    path.join(__dirname, '../tests/review-window.swift'), '-o', output], { stdio: 'inherit' });
  execFileSync(output, [], { stdio: 'inherit' });
} finally {
  fs.rmSync(staging, { recursive: true, force: true });
}
