'use strict';

const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const [arch, output] = process.argv.slice(2);
const target = { x64: 'x86_64', arm64: 'arm64' }[arch];
if (!target || !output) throw new Error('Swift build requires x64/arm64 and an output path');
const sdk = execFileSync('xcrun', ['--show-sdk-path'], { encoding: 'utf8' }).trim();
fs.mkdirSync(path.dirname(output), { recursive: true });
execFileSync('xcrun', [
  'swiftc', '-parse-as-library', '-emit-library', '-static',
  '-module-name', 'TaskioReview', '-swift-version', '6',
  '-target', `${target}-apple-macosx13.0`, '-sdk', sdk,
  path.join(__dirname, '../src/mac.swift'), '-o', output
], { stdio: 'inherit' });
