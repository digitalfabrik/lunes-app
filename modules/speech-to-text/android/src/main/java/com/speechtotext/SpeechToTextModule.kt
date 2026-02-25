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

    private fun initRecognizer(): SpeechRecognizer {
        recognizer?.destroy()
        recognizer = null

        return SpeechRecognizer.createSpeechRecognizer(reactContext).also { sr ->
            if (!SpeechRecognizer.isRecognitionAvailable(reactContext)) {
                Log.e(TAG, "initRecognizer: Speech recognition is not available on this device")
            }

            sr.setRecognitionListener(object : RecognitionListener {
                override fun onReadyForSpeech(params: Bundle?) {
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
                    Log.w(TAG, "onError: $error, $message")
                    pendingPromise?.reject("SpeechRecognizerError", message)
                    pendingPromise = null
                    recognizer?.destroy()
                    recognizer = null
                }

                override fun onResults(results: Bundle?) {
                    val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION) ?: emptyList<String>()
                    Log.i(TAG, "onResults: $matches")
                    pendingPromise?.resolve(Arguments.fromList(matches))
                    pendingPromise = null
                    recognizer?.destroy()
                    recognizer = null
                }

                override fun onPartialResults(partialResults: Bundle?) {
                    Log.i(TAG, "onPartialResults: ${partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)}")
                }

                override fun onEvent(eventType: Int, params: Bundle?) {
                    Log.i(TAG, "onEvent: $eventType")
                }
            })

            recognizer = sr
        }
    }

    override fun record(hints: ReadableArray, promise: Promise?) {
        val hintList = hints.toArrayList().map { it.toString() }.toTypedArray()

        Handler(reactContext.mainLooper).post {
            val sr = initRecognizer()
            promise?.let { setPromise(it) }

            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, "de-DE")
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5)
                if (hintList.isNotEmpty() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    Log.i(TAG, "Using biasing hints: ${hintList.toList()}")
                    putExtra(RecognizerIntent.EXTRA_BIASING_STRINGS, hintList)
                }
            }
            sr.startListening(intent)
        }
    }

    override fun stop(promise: Promise?) {
        Handler(reactContext.mainLooper).post {
            // stopListening() signals end of speech and triggers onResults with whatever was heard.
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
    }
}
