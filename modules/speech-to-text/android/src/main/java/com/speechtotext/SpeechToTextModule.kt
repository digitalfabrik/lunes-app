package com.speechtotext

import com.facebook.react.bridge.ReactApplicationContext

class SpeechToTextModule(reactContext: ReactApplicationContext) :
  NativeSpeechToTextSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b + 1
  }

  companion object {
    const val NAME = NativeSpeechToTextSpec.NAME
  }
}
