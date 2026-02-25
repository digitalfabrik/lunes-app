#import "SpeechToText.h"

#import <Speech/Speech.h>
#import <AVFoundation/AVFoundation.h>

@implementation SpeechToText {
    SFSpeechRecognizer *_recognizer;
    AVAudioEngine *_audioEngine;
    SFSpeechAudioBufferRecognitionRequest *_recognitionRequest;
    SFSpeechRecognitionTask *_recognitionTask;
}

- (instancetype)init {
    if (self = [super init]) {
        _recognizer = [[SFSpeechRecognizer alloc] initWithLocale:[NSLocale localeWithLocaleIdentifier:@"de-DE"]];
        _audioEngine = [[AVAudioEngine alloc] init];
    }
    return self;
}

- (void)record:(NSArray *)hints resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [SFSpeechRecognizer requestAuthorization:^(SFSpeechRecognizerAuthorizationStatus status) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (status != SFSpeechRecognizerAuthorizationStatusAuthorized) {
                reject(@"E_PERMISSION", @"Speech recognition not authorized", nil);
                return;
            }

            // Cancel any ongoing recognition before starting a new one
            [self->_recognitionTask cancel];
            self->_recognitionTask = nil;
            if ([self->_audioEngine isRunning]) {
                [self->_audioEngine stop];
                [self->_audioEngine.inputNode removeTapOnBus:0];
            }

            // Configure audio session for recording
            AVAudioSession *audioSession = [AVAudioSession sharedInstance];
            NSError *sessionError = nil;
            [audioSession setCategory:AVAudioSessionCategoryRecord error:&sessionError];
            [audioSession setMode:AVAudioSessionModeMeasurement error:&sessionError];
            [audioSession setActive:YES
                        withOptions:AVAudioSessionSetActiveOptionNotifyOthersOnDeactivation
                              error:&sessionError];
            if (sessionError) {
                reject(@"E_AUDIO_SESSION", sessionError.localizedDescription, sessionError);
                return;
            }

            // Build recognition request
            self->_recognitionRequest = [[SFSpeechAudioBufferRecognitionRequest alloc] init];
            // Partial results let us stop the audio engine as soon as the OS marks the result
            // as final, rather than waiting for a separate completion callback.
            self->_recognitionRequest.shouldReportPartialResults = YES;

            // Prefer on-device recognition so the exercise works offline.
            // Falls back to server recognition automatically if not available on this device/locale.
            if (self->_recognizer.supportsOnDeviceRecognition) {
                self->_recognitionRequest.requiresOnDeviceRecognition = YES;
            }

            // Vocabulary hints: steer the recognizer toward the expected word.
            // On iOS this is called contextualStrings (equivalent of Android's EXTRA_BIASING_STRINGS).
            if (hints.count > 0) {
                self->_recognitionRequest.contextualStrings = hints;
            }

            // Start recognition task. Resolved/rejected exactly once via the `settled` flag.
            __block BOOL settled = NO;
            self->_recognitionTask = [self->_recognizer
                recognitionTaskWithRequest:self->_recognitionRequest
                resultHandler:^(SFSpeechRecognitionResult *result, NSError *error) {
                    if (settled) {
                        return;
                    }

                    if (error) {
                        settled = YES;
                        [self tearDown];
                        reject(@"E_RECOGNITION", error.localizedDescription, error);
                        return;
                    }

                    if (result != nil && result.isFinal) {
                        settled = YES;
                        [self tearDown];

                        // Return all transcription hypotheses so the JS side can pick the
                        // best match (N-best list, ordered by confidence).
                        NSMutableArray<NSString *> *transcriptions = [NSMutableArray array];
                        for (SFTranscription *transcription in result.transcriptions) {
                            [transcriptions addObject:transcription.formattedString];
                        }
                        resolve(transcriptions);
                    }
                }];

            // Tap the microphone and feed buffers to the recognition request
            AVAudioInputNode *inputNode = self->_audioEngine.inputNode;
            AVAudioFormat *format = [inputNode outputFormatForBus:0];
            [inputNode installTapOnBus:0
                            bufferSize:1024
                                format:format
                                 block:^(AVAudioPCMBuffer *buffer, AVAudioTime *when) {
                [self->_recognitionRequest appendAudioPCMBuffer:buffer];
            }];

            NSError *engineError = nil;
            [self->_audioEngine prepare];
            [self->_audioEngine startAndReturnError:&engineError];
            if (engineError) {
                settled = YES;
                [self tearDown];
                reject(@"E_AUDIO_ENGINE", engineError.localizedDescription, engineError);
            }
        });
    }];
}

- (void)stop:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self->_recognitionRequest endAudio];
        resolve(nil);
    });
}

- (void)tearDown {
    if ([self->_audioEngine isRunning]) {
        [self->_audioEngine stop];
        [self->_audioEngine.inputNode removeTapOnBus:0];
    }
    [self->_recognitionRequest endAudio];
    self->_recognitionRequest = nil;
    self->_recognitionTask = nil;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeSpeechToTextSpecJSI>(params);
}

+ (NSString *)moduleName {
    return @"NativeSpeechToText";
}

@end
