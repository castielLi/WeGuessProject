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
#import "AFNetworking.h"


@interface WFTPay : NSObject <RCTBridgeModule>


@property (nonatomic,copy)RCTResponseSenderBlock(^payCallback)();
@property (nonatomic,copy) NSString *currentProId;

-(void)toastShow:(NSString *)message;
-(void)verifyTransactionResult;

@end
