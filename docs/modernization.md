# Electron 44 and modern macOS review bridge

This branch preserves `requestReview(): void` while replacing NAN/direct V8
access with Node-API version 6 and the deprecated Objective-C StoreKit API with
Swift `AppStore.requestReview(in:)`.

## Requirements

- macOS 13 or later at runtime; native Electron main-process use only.
- Xcode with Swift 6 and macOS SDK support to build the Swift bridge.
- Node 24.21.0 for this repository's development/build tools (`.nvmrc`).
- Consumers on Node 12.18+ can use npm's native build tooling. The bridge uses
  Node-API 6 so Taskio's temporary Electron 11 checkpoint remains loadable while
  the runtime upgrade is prepared; Electron 11 is not a supported release target.
- Windows/Linux retain the historical no-op; their native builds must be tested
  on those platforms. No Windows review implementation is introduced.

The bridge checks the AppKit main thread and an active key/main window before
submitting. It reuses the window's view controller or creates a temporary
controller referencing Electron's existing content view without replacing that
view. Invalid thread/window usage throws a JavaScript error, not a false success.
An undefined return means only that a request was submitted; Apple may suppress
the prompt, and the addon cannot determine whether the user reviewed the app.

## Build and validation

```sh
source "$HOME/.nvm/nvm.sh" && nvm use
npm ci
npm run rebuild -- --version 44.4.5 --arch arm64
npm test
npm run test:swift
npm run test:electron
npm run rebuild -- --version 44.4.5 --arch x64
```

The npm proxy is configured in `.npmrc`. Electron's npm validation dependency
is pinned to 44.4.5 because the proxy does not yet offer the current stable
44.5.1 npm package. The newest stable 44.5.1 runtime can be tested separately
using official checksum-verified Electron release binaries and
`npm run rebuild -- --version 44.5.1 --arch <architecture>`.
Never replace the proxy with the public npm registry.

`npm test` checks Node-API loading, no-window rejection and worker-thread
rejection on macOS; `test:electron` checks actual Electron main-process loading
in a disposable profile without creating a window or displaying a prompt.
`test:swift` exercises absent-window, existing-controller and Electron-style
controller-less window behavior with StoreKit submission replaced by a test
closure. None of these tests asks for a real review.

The Swift bridge is statically linked into each architecture's `.node` file;
AppKit, StoreKit and Swift libraries are provided by macOS. No independently
copied Swift dylib is required. The resulting binary declares macOS 13.0 as its
minimum deployment target. Native binaries are not checked into Git.

## Remaining acceptance gates

- Signed MAS application testing, including a real focused Electron window and
  StoreKit's prompt/suppression behavior.
- Runtime verification on the minimum macOS 13 version (the current development
  host is newer); inspect Swift runtime compatibility there.
- Windows/Linux native build and no-op runtime tests.
- Consumer packaging must unpack/sign native binaries and build each architecture.
  Node-API reduces V8 ABI coupling but does not make x64 and arm64 interchangeable.
- Publish or pin a reviewed addon revision in Taskio only after approval. Taskio's
  existing dependency pin is not changed by this branch.
- Taskio's misleading `reviewGiven` persisted state and delayed error handling
  remain separate consumer-side U07 work.

## Verified locally

- Electron 44.5.1 (current stable) x64/Rosetta and arm64: forced rebuild and actual
  main-process addon loading passed, including safe no-window rejection.
- Electron 44.4.5 (proxy-available npm dependency) x64 and arm64: same checks passed.
- Node 24 loading and worker-thread rejection passed.
- Clean `npm ci` (including native compilation) and subsequent Node/Swift/Electron
  tests passed; dependency audit reported zero advisories.
- Swift controller-selection tests passed with StoreKit submission mocked.
- Native linkage uses system frameworks/Swift libraries; macOS deployment target
  is 13.0.
- Source-only publish manifest contains the Swift build inputs, excludes binaries,
  node_modules and `.DS_Store`.

The version is now 2.0.0 because minimum macOS/build-host requirements change and
invalid macOS invocation now throws. The existing JavaScript and TypeScript entry
points are unchanged. The lockfile was regenerated for the updated dependency graph;
pre-existing owner edits to LICENSE and README are not part of this change.
