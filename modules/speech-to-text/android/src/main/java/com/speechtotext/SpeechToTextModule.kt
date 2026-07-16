package com.speechtotext

import android.content.ActivityNotFoundException
import android.content.Intent
import android.media.AudioFormat
import android.media.MediaCodec
import android.media.MediaExtractor
import android.media.MediaFormat
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.ParcelFileDescriptor
import android.provider.Settings
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.nio.ByteBuffer
import java.nio.ByteOrder

class SpeechToTextModule(private val reactContext: ReactApplicationContext) :
    NativeSpeechToTextSpec(reactContext) {

    private var recognizer: SpeechRecognizer? = null
    private var pendingPromise: Promise? = null

    // Kept separate from the microphone recognizer so transcribing a reference file cannot clobber
    // an in-flight live recording (and vice versa).
    private var fileRecognizer: SpeechRecognizer? = null
    private var fileTranscriptionPromise: Promise? = null
    // Must stay open until recognition finishes: startListening connects to the recognition service
    // lazily, so the descriptor is marshalled after the call returns — closing it earlier makes
    // every transcription fail with ERROR_CLIENT.
    private var fileAudioReadSide: ParcelFileDescriptor? = null

    private fun createRecognizer(): SpeechRecognizer {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && SpeechRecognizer.isOnDeviceRecognitionAvailable(reactContext)) {
            return SpeechRecognizer.createOnDeviceSpeechRecognizer(reactContext)
        }
        return SpeechRecognizer.createSpeechRecognizer(reactContext)
    }

    private fun createRecognitionListener(): RecognitionListener = object : RecognitionListener {
        override fun onReadyForSpeech(params: Bundle?) {}
        override fun onBeginningOfSpeech() {}
        override fun onRmsChanged(rmsDb: Float) {}
        override fun onBufferReceived(buffer: ByteArray?) {}
        override fun onEndOfSpeech() {}
        override fun onPartialResults(partialResults: Bundle?) {}
        override fun onEvent(eventType: Int, params: Bundle?) {}

        override fun onError(error: Int) {
            val isLanguageUnavailable = error == SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED ||
                error == SpeechRecognizer.ERROR_LANGUAGE_UNAVAILABLE
            if (isLanguageUnavailable) {
                Log.w(TAG, "Recognition error $error: German language not available on device")
                pendingPromise?.reject("E_LANGUAGE_UNAVAILABLE", "German language is not available for speech recognition on this device")
            } else {
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
                    SpeechRecognizer.ERROR_CANNOT_CHECK_SUPPORT -> "Cannot check support"
                    else -> "Unknown error"
                }
                Log.w(TAG, "Recognition error $error: $message")
                pendingPromise?.reject("SpeechRecognizerError", message)
            }
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
        if (!SpeechRecognizer.isRecognitionAvailable(reactContext)) {
            promise?.reject("E_RECOGNITION_UNAVAILABLE", "Speech recognition is not available on this device")
            return
        }

        val hintsArray = hints.toArrayList().map { hint -> hint.toString() }.toTypedArray()

        Handler(reactContext.mainLooper).post {
            val speechRecognizer = initRecognizer()
            promise?.let { setPromise(it) }

            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, "de-DE")
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5)
                // Wait 2 s of silence before considering speech complete, so the Voice Activity Detection
                // does not cut off long compound words mid-syllable. The 800 ms minimum keeps brief
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

    override fun transcribeAudioFile(fileUri: String, hints: ReadableArray, promise: Promise?) {
        // File input requires the API 31+ EXTRA_AUDIO_SOURCE, fed by an on-device recognizer.
        // Where that is missing the caller falls back to comparing against the written word.
        val supportsFileTranscription = Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
            SpeechRecognizer.isOnDeviceRecognitionAvailable(reactContext)
        if (!supportsFileTranscription) {
            promise?.reject("E_FILE_TRANSCRIPTION_UNAVAILABLE", "On-device file transcription is not available on this device")
            return
        }

        val path = if (fileUri.startsWith("file://")) Uri.parse(fileUri).path ?: fileUri else fileUri
        val hintsArray = hints.toArrayList().map { hint -> hint.toString() }.toTypedArray()

        Handler(reactContext.mainLooper).post {
            val pipe = ParcelFileDescriptor.createPipe()
            val readSide = pipe[0]
            val writeSide = pipe[1]

            val speechRecognizer = SpeechRecognizer.createOnDeviceSpeechRecognizer(reactContext)
            speechRecognizer.setRecognitionListener(createFileRecognitionListener())
            fileRecognizer = speechRecognizer
            fileAudioReadSide = readSide
            promise?.let { setFileTranscriptionPromise(it) }

            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, "de-DE")
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5)
                putExtra(RecognizerIntent.EXTRA_AUDIO_SOURCE, readSide)
                putExtra(RecognizerIntent.EXTRA_AUDIO_SOURCE_ENCODING, AudioFormat.ENCODING_PCM_16BIT)
                putExtra(RecognizerIntent.EXTRA_AUDIO_SOURCE_SAMPLING_RATE, RECOGNIZER_SAMPLE_RATE)
                putExtra(RecognizerIntent.EXTRA_AUDIO_SOURCE_CHANNEL_COUNT, 1)
                if (hintsArray.isNotEmpty()) {
                    putExtra(RecognizerIntent.EXTRA_BIASING_STRINGS, hintsArray)
                }
            }
            speechRecognizer.startListening(intent)

            // A session that never produces a result would occupy the on-device recognition service
            // indefinitely and starve live recordings, so end it after a generous timeout.
            val watchdogPromise = fileTranscriptionPromise
            Handler(reactContext.mainLooper).postDelayed({
                if (watchdogPromise != null && watchdogPromise === fileTranscriptionPromise) {
                    Log.w(TAG, "File transcription timed out")
                    watchdogPromise.reject("E_FILE_TRANSCRIPTION_FAILED", "File transcription timed out")
                    cleanupFileRecognition()
                }
            }, FILE_TRANSCRIPTION_TIMEOUT_MS)

            Thread {
                try {
                    ParcelFileDescriptor.AutoCloseOutputStream(writeSide).use { output ->
                        val pcm = decodeToRecognizerPcm(path)
                        // TEMPORARY (issue 1447 debugging): REMOVE before merging.
                        try {
                            writeDebugWav(pcm)
                        } catch (exception: IOException) {
                            Log.w(TAG, "Could not write debug WAV", exception)
                        }
                        // The recognizer only finalizes an utterance after trailing silence; a file that
                        // ends the moment the word does would otherwise yield no result at all.
                        output.write(ByteArray(LEADING_SILENCE_BYTES))
                        output.write(pcm)
                        output.write(ByteArray(TRAILING_SILENCE_BYTES))
                        Log.d(TAG, "Wrote ${pcm.size} bytes of $RECOGNIZER_SAMPLE_RATE Hz mono PCM (plus silence padding) from $path")
                    }
                } catch (exception: Exception) {
                    Log.w(TAG, "Failed to decode reference audio", exception)
                    try {
                        writeSide.closeWithError("decode failed")
                    } catch (_: IOException) {
                        // The stream may already be closed; nothing more to do.
                    }
                }
            }.start()
        }
    }

    private fun createFileRecognitionListener(): RecognitionListener = object : RecognitionListener {
        override fun onReadyForSpeech(params: Bundle?) {}
        override fun onBeginningOfSpeech() {}
        override fun onRmsChanged(rmsDb: Float) {}
        override fun onBufferReceived(buffer: ByteArray?) {}
        override fun onEndOfSpeech() {}
        override fun onPartialResults(partialResults: Bundle?) {}
        override fun onEvent(eventType: Int, params: Bundle?) {}

        override fun onError(error: Int) {
            Log.w(TAG, "File transcription error $error")
            fileTranscriptionPromise?.reject("E_FILE_TRANSCRIPTION_FAILED", "Recognition error $error")
            cleanupFileRecognition()
        }

        override fun onResults(results: Bundle?) {
            val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION) ?: emptyList<String>()
            Log.d(TAG, "File transcription results: $matches")
            fileTranscriptionPromise?.resolve(Arguments.fromList(matches))
            cleanupFileRecognition()
        }
    }

    private fun cleanupFileRecognition() {
        fileTranscriptionPromise = null
        fileRecognizer?.destroy()
        fileRecognizer = null
        try {
            fileAudioReadSide?.close()
        } catch (_: IOException) {
            // Already closed; nothing more to do.
        }
        fileAudioReadSide = null
    }

    private fun setFileTranscriptionPromise(promise: Promise) {
        fileTranscriptionPromise?.reject("Outdated promise", "This promise was superseded by a newer file transcription")
        fileTranscriptionPromise = promise
    }

    private fun selectAudioTrack(extractor: MediaExtractor): Int {
        for (index in 0 until extractor.trackCount) {
            val mime = extractor.getTrackFormat(index).getString(MediaFormat.KEY_MIME)
            if (mime?.startsWith("audio/") == true) {
                return index
            }
        }
        return -1
    }

    // Decodes the compressed reference audio and converts it to the 16 kHz mono 16-bit PCM the
    // on-device recognizer expects — other formats may be silently ignored, wedging the session.
    private fun decodeToRecognizerPcm(path: String): ByteArray {
        val extractor = MediaExtractor()
        var codec: MediaCodec? = null
        try {
            extractor.setDataSource(path)
            val trackIndex = selectAudioTrack(extractor)
            if (trackIndex < 0) {
                throw IOException("No audio track found in $path")
            }
            extractor.selectTrack(trackIndex)
            val format = extractor.getTrackFormat(trackIndex)
            val mime = format.getString(MediaFormat.KEY_MIME) ?: throw IOException("Missing mime type")
            var sampleRate = format.getInteger(MediaFormat.KEY_SAMPLE_RATE)
            var channelCount = format.getInteger(MediaFormat.KEY_CHANNEL_COUNT)
            codec = MediaCodec.createDecoderByType(mime)
            codec.configure(format, null, null, 0)
            codec.start()

            val decodedPcm = ByteArrayOutputStream()
            val bufferInfo = MediaCodec.BufferInfo()
            val timeoutUs = 10_000L
            var sawInputEos = false
            var sawOutputEos = false

            while (!sawOutputEos) {
                if (!sawInputEos) {
                    val inputIndex = codec.dequeueInputBuffer(timeoutUs)
                    if (inputIndex >= 0) {
                        val inputBuffer = codec.getInputBuffer(inputIndex)!!
                        val sampleSize = extractor.readSampleData(inputBuffer, 0)
                        if (sampleSize < 0) {
                            codec.queueInputBuffer(inputIndex, 0, 0, 0, MediaCodec.BUFFER_FLAG_END_OF_STREAM)
                            sawInputEos = true
                        } else {
                            codec.queueInputBuffer(inputIndex, 0, sampleSize, extractor.sampleTime, 0)
                            extractor.advance()
                        }
                    }
                }

                val outputIndex = codec.dequeueOutputBuffer(bufferInfo, timeoutUs)
                if (outputIndex >= 0) {
                    val outputBuffer = codec.getOutputBuffer(outputIndex)!!
                    val chunk = ByteArray(bufferInfo.size)
                    outputBuffer.position(bufferInfo.offset)
                    outputBuffer.get(chunk, 0, bufferInfo.size)
                    decodedPcm.write(chunk)
                    codec.releaseOutputBuffer(outputIndex, false)
                    if (bufferInfo.flags and MediaCodec.BUFFER_FLAG_END_OF_STREAM != 0) {
                        sawOutputEos = true
                    }
                } else if (outputIndex == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED) {
                    // The decoder reports the actual PCM format, which may differ from the container metadata
                    sampleRate = codec.outputFormat.getInteger(MediaFormat.KEY_SAMPLE_RATE)
                    channelCount = codec.outputFormat.getInteger(MediaFormat.KEY_CHANNEL_COUNT)
                }
            }
            return convertToRecognizerFormat(decodedPcm.toByteArray(), sampleRate, channelCount)
        } finally {
            try {
                codec?.stop()
            } catch (_: IllegalStateException) {
                // Codec may not have been started; safe to ignore.
            }
            codec?.release()
            extractor.release()
        }
    }

    // Downmixes to mono and linearly resamples to RECOGNIZER_SAMPLE_RATE. Linear interpolation is
    // sufficient quality for speech recognition input.
    private fun convertToRecognizerFormat(pcm: ByteArray, sampleRate: Int, channelCount: Int): ByteArray {
        val samples = ShortArray(pcm.size / 2)
        ByteBuffer.wrap(pcm).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().get(samples)

        val monoSamples = if (channelCount <= 1) {
            samples
        } else {
            ShortArray(samples.size / channelCount) { frameIndex ->
                var frameSum = 0
                for (channel in 0 until channelCount) {
                    frameSum += samples[frameIndex * channelCount + channel]
                }
                (frameSum / channelCount).toShort()
            }
        }

        if (sampleRate == RECOGNIZER_SAMPLE_RATE || monoSamples.isEmpty()) {
            return toLittleEndianBytes(monoSamples)
        }

        val resampledLength = (monoSamples.size.toLong() * RECOGNIZER_SAMPLE_RATE / sampleRate).toInt()
        val resampledSamples = ShortArray(resampledLength) { targetIndex ->
            val sourcePosition = targetIndex.toDouble() * sampleRate / RECOGNIZER_SAMPLE_RATE
            val leftIndex = sourcePosition.toInt().coerceAtMost(monoSamples.size - 1)
            val rightIndex = (leftIndex + 1).coerceAtMost(monoSamples.size - 1)
            val rightFraction = sourcePosition - leftIndex
            (monoSamples[leftIndex] * (1 - rightFraction) + monoSamples[rightIndex] * rightFraction).toInt().toShort()
        }
        return toLittleEndianBytes(resampledSamples)
    }

    private fun toLittleEndianBytes(samples: ShortArray): ByteArray {
        val buffer = ByteBuffer.allocate(samples.size * 2).order(ByteOrder.LITTLE_ENDIAN)
        buffer.asShortBuffer().put(samples)
        return buffer.array()
    }

    // TEMPORARY (issue 1447 debugging): dump the converted PCM as a playable WAV so the audio sent
    // to the recognizer can be pulled via `adb shell run-as` and listened to. REMOVE before merging.
    private fun writeDebugWav(pcm: ByteArray) {
        val wavFile = File(reactContext.cacheDir, "ref-debug.wav")
        FileOutputStream(wavFile).use { stream ->
            val header = ByteBuffer.allocate(44).order(ByteOrder.LITTLE_ENDIAN)
            header.put("RIFF".toByteArray(Charsets.US_ASCII))
            header.putInt(36 + pcm.size)
            header.put("WAVE".toByteArray(Charsets.US_ASCII))
            header.put("fmt ".toByteArray(Charsets.US_ASCII))
            header.putInt(16)
            header.putShort(1.toShort()) // PCM
            header.putShort(1.toShort()) // mono
            header.putInt(RECOGNIZER_SAMPLE_RATE)
            header.putInt(RECOGNIZER_SAMPLE_RATE * 2) // byte rate
            header.putShort(2.toShort()) // block align
            header.putShort(16.toShort()) // bits per sample
            header.put("data".toByteArray(Charsets.US_ASCII))
            header.putInt(pcm.size)
            stream.write(header.array())
            stream.write(pcm)
        }
        Log.d(TAG, "Debug WAV written to ${wavFile.absolutePath}")
    }

    override fun openVoiceInputSettings(promise: Promise?) {
        try {
            val intent = Intent(Settings.ACTION_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactContext.startActivity(intent)
            promise?.resolve(null)
        } catch (exception: ActivityNotFoundException) {
            promise?.reject("E_SETTINGS_UNAVAILABLE", "Could not open settings", exception)
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

        // On-device recognizers expect 16 kHz mono 16-bit PCM for EXTRA_AUDIO_SOURCE input
        private const val RECOGNIZER_SAMPLE_RATE = 16_000
        private const val FILE_TRANSCRIPTION_TIMEOUT_MS = 15_000L

        // 16-bit mono: bytes = seconds * sample rate * 2
        private const val LEADING_SILENCE_BYTES = RECOGNIZER_SAMPLE_RATE / 2 // 250 ms
        private const val TRAILING_SILENCE_BYTES = RECOGNIZER_SAMPLE_RATE * 2 // 1 s
    }
}
