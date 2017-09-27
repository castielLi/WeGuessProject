//
//  WFTPay.m
//  WeGuess
//
//  Created by castiel on 2017/9/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "WFTPay.h"
#import "SPayClient.h"
#import <UIKit/UIKit.h>

@implementation WFTPay

RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(pay:(NSString *)token callback:(RCTResponseSenderBlock (^)())callback){
  
  UIViewController * currentVC = [UIApplication sharedApplication].keyWindow.rootViewController;
  
    [[SPayClient sharedInstance] pay:currentVC amount:[NSNumber numberWithFloat:0.0] spayTokenIDString:token payServicesString:@"pay.alipay.native.towap" finish:^(SPayClientPayStateModel *payStateModel, SPayClientPaySuccessDetailModel *paySuccessDetailModel) {
    callback();
  }];
}

@end
