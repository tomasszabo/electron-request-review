'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { app } = require('electron');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'taskio-review-electron-test-'));
app.setPath('userData', profile);
app.once('will-quit', () => fs.rmSync(profile, { recursive: true, force: true }));
app.whenReady().then(() => {
  const addon = require('../');
  assert.equal(typeof addon.requestReview, 'function');
  if (process.platform === 'darwin') {
    assert.throws(() => addon.requestReview(), /active application window/);
  } else {
    assert.equal(addon.requestReview(), undefined);
  }
  console.log(`Electron ${process.versions.electron} ${process.arch}: addon load and safe no-window check passed.`);
  app.quit();
}).catch(error => {
  console.error(error);
  fs.rmSync(profile, { recursive: true, force: true });
  app.exit(1);
});
