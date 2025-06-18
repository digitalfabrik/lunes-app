#import "AppDelegate.h"

#import <AVFoundation/AVFoundation.h>
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // To play audio even if the device is in silent mode
  NSError *sessionError = nil;
  BOOL success = [[AVAudioSession sharedInstance]
                   setCategory:AVAudioSessionCategoryPlayback
                         error:&sessionError];
  if (!success) {
    NSLog(@"Error setting AVAudioSession category: %@", sessionError);
  }
  success = [[AVAudioSession sharedInstance]
             setActive:YES
                   error:&sessionError];
  if (!success) {
    NSLog(@"Error activating AVAudioSession: %@", sessionError);
  }

  self.moduleName = @"Lunes";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
