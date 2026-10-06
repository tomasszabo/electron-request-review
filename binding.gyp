{
  "targets": [
    {
      "target_name": "addon",
      "sources": ["src/index.cc"],
      "defines": ["NAPI_VERSION=6"],
      "conditions": [
        ["OS=='mac'", {
          "actions": [{
            "action_name": "compile_storekit_bridge",
            "inputs": ["src/mac.swift", "scripts/build-swift.cjs"],
            "outputs": ["<(PRODUCT_DIR)/libtaskio_review.a"],
            "action": ["node", "scripts/build-swift.cjs", "<(target_arch)", "<(PRODUCT_DIR)/libtaskio_review.a"]
          }],
          "libraries": [
            "<(PRODUCT_DIR)/libtaskio_review.a",
            "-framework AppKit",
            "-framework StoreKit"
          ],
          "xcode_settings": {
            "MACOSX_DEPLOYMENT_TARGET": "13.0",
            "OTHER_LDFLAGS": ["-Wl,-rpath,/usr/lib/swift", "-L<!(xcrun --show-sdk-path)/usr/lib/swift"]
          }
        }],
        ["OS!='mac'", {
          "sources": ["src/default.cc"]
        }]
      ]
    }
  ]
}
