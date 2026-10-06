'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const os = require('os');
const path = require('path');
const { app } = require('electron');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'taskio-review-electron-test-'));
app.setPath('userData', profile);
function cleanup() {
  if (fs.rmSync) fs.rmSync(profile, { recursive: true, force: true });
  else if (fs.existsSync(profile)) fs.rmdirSync(profile, { recursive: true });
}
app.once('will-quit', cleanup);
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
  cleanup();
  app.exit(1);
});
