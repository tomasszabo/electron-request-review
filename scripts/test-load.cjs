'use strict';
const assert = require('node:assert/strict');
const { Worker } = require('node:worker_threads');
const addon = require('../');
assert.equal(typeof addon.requestReview, 'function');
const descriptor = Object.getOwnPropertyDescriptor(addon, 'requestReview');
assert.equal(descriptor.enumerable, true);
assert.equal(descriptor.writable, true);
assert.equal(descriptor.configurable, true);
if (process.platform === 'darwin') {
  assert.throws(() => addon.requestReview(), /active application window/);
} else {
  assert.equal(addon.requestReview(), undefined);
}
console.log('Node-API load and no-window/no-op checks passed; no review prompt requested.');
if (process.platform === 'darwin') {
  const worker = new Worker(`
    const assert = require('node:assert/strict');
    const addon = require(${JSON.stringify(require.resolve('../'))});
    assert.throws(() => addon.requestReview(), /AppKit main thread/);
  `, { eval: true });
  worker.on('error', error => { console.error(error); process.exitCode = 1; });
  worker.on('exit', code => {
    if (code !== 0) process.exitCode = 1;
    else console.log('Worker-thread guard passed.');
  });
}
