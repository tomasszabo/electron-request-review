#include <nan.h>
#import <Cocoa/Cocoa.h>
#import <StoreKit/StoreKit.h>

void requestReview(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if (@available(macOS 10.14, *)) {
    if([SKStoreReviewController class]){
       [SKStoreReviewController requestReview];
    }
  }
}
