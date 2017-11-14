/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "SPayClient.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  //支付配置
  
  SPayClientAlipayConfigModel * aliPayConfig = [[SPayClientAlipayConfigModel alloc]init];
  aliPayConfig.appScheme = @"spay";
  [[SPayClient sharedInstance] alipayAppConfig:aliPayConfig];
  
  [[SPayClient sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
  
  
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"WeGuess"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

-(void)applicationWillEnterForeground:(UIApplication *)application{
  [[SPayClient sharedInstance] applicationWillEnterForeground:application];
}

-(BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url{
  return [[SPayClient sharedInstance]application:application handleOpenURL:url];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  [[SPayClient sharedInstance] application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
  return YES;
}

@end
