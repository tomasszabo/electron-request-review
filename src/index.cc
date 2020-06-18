#include <nan.h>

void requestReview(const Nan::FunctionCallbackInfo<v8::Value> &info);

static void InitModule(v8::Local<v8::Object> exports) {
  v8::Isolate *isolate = exports->GetIsolate();
  v8::Local<v8::Context> context = isolate->GetCurrentContext();

  exports->Set(context, Nan::New("requestReview").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(requestReview)->GetFunction(context).ToLocalChecked());
}

NODE_MODULE(request_review, InitModule)
