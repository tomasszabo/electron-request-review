#include <node_api.h>

extern "C" int taskio_request_review();

static napi_value RequestReview(napi_env env, napi_callback_info info) {
  const int status = taskio_request_review();
  if (status != 0) {
    const char* message = status == 1 ? "Review requests require the AppKit main thread"
        : status == 2 ? "Review requests require an active application window"
        : "Review requests require macOS 13 or later";
    napi_throw_error(env, nullptr, message);
    return nullptr;
  }
  napi_value result;
  if (napi_get_undefined(env, &result) != napi_ok) {
    napi_throw_error(env, nullptr, "Cannot return review request result");
    return nullptr;
  }
  return result;
}

static napi_value Init(napi_env env, napi_value exports) {
  napi_property_descriptor method = {
    "requestReview", nullptr, RequestReview, nullptr, nullptr, nullptr,
    static_cast<napi_property_attributes>(napi_writable | napi_enumerable | napi_configurable), nullptr
  };
  if (napi_define_properties(env, exports, 1, &method) != napi_ok) {
    napi_throw_error(env, nullptr, "Cannot initialize review addon");
    return nullptr;
  }
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
