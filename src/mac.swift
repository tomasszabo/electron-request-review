import AppKit
import StoreKit

@MainActor
func submitReview(window: NSWindow?, submit: (NSViewController) -> Void) -> Int32 {
    guard let window, let contentView = window.contentView else { return 2 }
    let controller: NSViewController
    if let existing = window.contentViewController {
        controller = existing
    } else {
        // Electron windows may expose a content view without a controller.
        controller = NSViewController()
        controller.view = contentView
    }
    submit(controller)
    return 0
}

@_cdecl("taskio_request_review")
public func taskioRequestReview() -> Int32 {
    guard Thread.isMainThread else { return 1 }
    if #available(macOS 13.0, *) {
        return MainActor.assumeIsolated {
            submitReview(window: NSApplication.shared.keyWindow ?? NSApplication.shared.mainWindow) {
                AppStore.requestReview(in: $0)
            }
        }
    }
    return 3
}
