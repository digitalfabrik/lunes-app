package com.speechtotext

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
class SpeechToTextPackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
        if (name == SpeechToTextModule.NAME) SpeechToTextModule(reactContext) else null

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider = ReactModuleInfoProvider {
        val moduleInfos = mutableMapOf<String, ReactModuleInfo>()
        moduleInfos[SpeechToTextModule.NAME] = ReactModuleInfo(
            SpeechToTextModule.NAME,
            SpeechToTextModule.NAME,
            false,  // canOverrideExistingModule
            false,  // needsEagerInit
            false,  // isCxxModule
            true    // isTurboModule
        )
        moduleInfos
    }
}
