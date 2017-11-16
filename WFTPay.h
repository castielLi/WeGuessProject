//
//  WFTPay.h
//  WeGuess
//
//  Created by castiel on 2017/9/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "SPayClient.h"
#import "Toast+UIView.h"


@interface WFTPay : NSObject <RCTBridgeModule>


@property (nonatomic,copy)RCTResponseSenderBlock(^payCallback)();

-(void)toastShow:(NSString *)message;
-(void)verifyTransactionResult;
@end
