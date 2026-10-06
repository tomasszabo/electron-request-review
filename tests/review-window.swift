import AppKit

@main
struct ReviewWindowTests {
    @MainActor
    static func main() {
        _ = NSApplication.shared
        var calls = 0
        precondition(submitReview(window: nil) { _ in calls += 1 } == 2)
        precondition(calls == 0)
        let window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 100, height: 100),
                              styleMask: [.titled], backing: .buffered, defer: false)
        let originalView = window.contentView
        precondition(submitReview(window: window) { controller in
            precondition(controller.view === originalView)
            precondition(controller.view.window === window)
            calls += 1
        } == 0)
        precondition(window.contentView === originalView)
        let controller = NSViewController()
        controller.view = NSView(frame: NSRect(x: 0, y: 0, width: 100, height: 100))
        window.contentViewController = controller
        precondition(submitReview(window: window) { received in
            precondition(received === controller)
            calls += 1
        } == 0)
        precondition(calls == 2)
        print("Swift window/controller selection tests passed; StoreKit submission mocked.")
    }
}
