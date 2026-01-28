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

const val TAG = "SpeechToTextModule"

class SpeechToTextModule(val reactContext: ReactApplicationContext) :
    NativeSpeechToTextSpec(reactContext) {

    var recognizer: SpeechRecognizer? = null
    var pendingPromise: Promise? = null

    fun initRecognizer(): SpeechRecognizer {
        if (recognizer != null) {
            recognizer!!.destroy()
            recognizer = null
        }

        this.recognizer = SpeechRecognizer.createSpeechRecognizer(reactContext).apply {
            if (!SpeechRecognizer.isRecognitionAvailable(reactContext)) {
                Log.e(TAG, "initRecognizer: Speech recognition is not available on this device")
            }

            setRecognitionListener(object : RecognitionListener {
                override fun onReadyForSpeech(params: Bundle?) {
                    // For now leave empty.
                    // Though we might need to indicate in the ui when the user can start speaking
                    Log.i(TAG, "onReadyForSpeech")
                }

                override fun onBeginningOfSpeech() {
                    Log.i(TAG, "onBeginningOfSpeech")
                }

                override fun onRmsChanged(rmsdB: Float) {}

                override fun onBufferReceived(buffer: ByteArray?) {}

                override fun onEndOfSpeech() {
                    Log.i(TAG, "onEndOfSpeech")
                }

                override fun onError(error: Int) {
                    val message = when (error) {
                        SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "Network timeout"
                        SpeechRecognizer.ERROR_NETWORK -> "Network error"
                        SpeechRecognizer.ERROR_AUDIO -> "Audio recording error"
                        SpeechRecognizer.ERROR_SERVER -> "error from server"
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
                    Log.w(TAG, "onError: $error, $message")
                    pendingPromise?.reject("SpeechRecognizerError", message)
                    pendingPromise = null
                    recognizer?.destroy()
                    recognizer = null
                }

                override fun onResults(results: Bundle?) {
                    val results =
                        results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION) ?: emptyList<String>()
                    Log.i(TAG, "onResults: $results")
                    val jsResults = Arguments.fromList(results)
                    pendingPromise?.resolve(jsResults)
                    pendingPromise = null
                    recognizer?.destroy()
                    recognizer = null
                }

                override fun onPartialResults(partialResults: Bundle?) {
                    Log.i(
                        TAG,
                        "onPartialResults: ${partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)}"
                    )
                }

                override fun onEvent(eventType: Int, params: Bundle?) {
                    Log.i(TAG, "onEvent: $eventType")
                }
            })
        }

        return this.recognizer!!
    }

    override fun record(hints: ReadableArray, promise: Promise?) {
        val hints = hints.toArrayList().map { it.toString() }.toTypedArray()

        val mainHandler = Handler(reactContext.mainLooper)
        mainHandler.post {
            val recognizer = initRecognizer()
            promise?.let { setPromise(it) }
            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, "de-DE")
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                if (hints.isNotEmpty() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    Log.i(TAG, "Using hints: $hints")
                    putExtra(RecognizerIntent.EXTRA_BIASING_STRINGS, hints)
                }
            }
            recognizer.startListening(intent)
        }
    }

    fun setPromise(promise: Promise) {
        pendingPromise?.reject("Outdated promise", "This promise was superseded")
        pendingPromise = promise
    }

    companion object {
        const val NAME = NativeSpeechToTextSpec.NAME
    }
}
