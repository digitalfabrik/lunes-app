package com.speechtotext

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray

class SpeechToTextModule(val reactContext: ReactApplicationContext) :
    NativeSpeechToTextSpec(reactContext) {

    private var recognizer: SpeechRecognizer? = null
    private var pendingPromise: Promise? = null

    private fun createRecognizer(): SpeechRecognizer {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            SpeechRecognizer.isOnDeviceSpeechRecognizerAvailable(reactContext)
        ) {
            return SpeechRecognizer.createOnDeviceSpeechRecognizer(reactContext)
        }
        if (!SpeechRecognizer.isRecognitionAvailable(reactContext)) {
            Log.e(TAG, "Speech recognition is not available on this device")
        }
        return SpeechRecognizer.createSpeechRecognizer(reactContext)
    }

    private fun createRecognitionListener(): RecognitionListener = object : RecognitionListener {
        override fun onReadyForSpeech(params: Bundle?) {}
        override fun onBeginningOfSpeech() {}
        override fun onRmsChanged(rmsdB: Float) {}
        override fun onBufferReceived(buffer: ByteArray?) {}
        override fun onEndOfSpeech() {}
        override fun onPartialResults(partialResults: Bundle?) {}
        override fun onEvent(eventType: Int, params: Bundle?) {}

        override fun onError(error: Int) {
            val message = when (error) {
                SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "Network timeout"
                SpeechRecognizer.ERROR_NETWORK -> "Network error"
                SpeechRecognizer.ERROR_AUDIO -> "Audio recording error"
                SpeechRecognizer.ERROR_SERVER -> "Error from server"
                SpeechRecognizer.ERROR_CLIENT -> "Client side error"
                SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "No speech input"
                SpeechRecognizer.ERROR_NO_MATCH -> "No match"
                SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "RecognitionService busy"
                SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "Insufficient permissions"
                SpeechRecognizer.ERROR_TOO_MANY_REQUESTS -> "Too many requests"
                SpeechRecognizer.ERROR_SERVER_DISCONNECTED -> "Server disconnected"
                SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED -> "Language not supported"
                SpeechRecognizer.ERROR_LANGUAGE_UNAVAILABLE -> "Language not available"
                SpeechRecognizer.ERROR_CANNOT_CHECK_SUPPORT -> "Cannot check support"
                else -> "Unknown error"
            }
            Log.w(TAG, "Recognition error $error: $message")
            pendingPromise?.reject("SpeechRecognizerError", message)
            pendingPromise = null
            recognizer?.destroy()
            recognizer = null
        }

        override fun onResults(results: Bundle?) {
            val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION) ?: emptyList<String>()
            pendingPromise?.resolve(Arguments.fromList(matches))
            pendingPromise = null
            recognizer?.destroy()
            recognizer = null
        }
    }

    private fun initRecognizer(): SpeechRecognizer {
        recognizer?.destroy()
        recognizer = null
        val newRecognizer = createRecognizer()
        newRecognizer.setRecognitionListener(createRecognitionListener())
        recognizer = newRecognizer
        return newRecognizer
    }

    override fun record(hints: ReadableArray, promise: Promise?) {
        val hintsArray = hints.toArrayList().map { it.toString() }.toTypedArray()

        Handler(reactContext.mainLooper).post {
            val speechRecognizer = initRecognizer()
            promise?.let { setPromise(it) }

            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, "de-DE")
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5)
                // Wait 2 s of silence before considering speech complete, so the VAD does not
                // cut off long compound words mid-syllable. The 800 ms minimum keeps brief
                // single-word utterances like "die Zunge" from being rejected too early.
                putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 2000L)
                putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 2000L)
                putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 800L)
                if (hintsArray.isNotEmpty() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    putExtra(RecognizerIntent.EXTRA_BIASING_STRINGS, hintsArray)
                }
            }
            speechRecognizer.startListening(intent)
        }
    }

    override fun stop(promise: Promise?) {
        Handler(reactContext.mainLooper).post {
            recognizer?.stopListening()
            promise?.resolve(null)
        }
    }

    private fun setPromise(promise: Promise) {
        pendingPromise?.reject("Outdated promise", "This promise was superseded by a newer recording")
        pendingPromise = promise
    }

    companion object {
        const val NAME = NativeSpeechToTextSpec.NAME
        private const val TAG = "SpeechToTextModule"
    }
}
