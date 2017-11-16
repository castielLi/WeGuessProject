//
//  IAPManager.h
//  WeGuess
//
//  Created by 冯亭 on 2017/11/13.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <StoreKit/StoreKit.h>
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "SPayClient.h"
#import "Toast+UIView.h"
#import "AFNetworking.h"

@interface IAPManager:NSObject <RCTBridgeModule>

@property (nonatomic,copy) NSString *currentProId;

- (void)IPAPay:(NSString *)proId;

-(void)toastShow:(NSString *)message;
//去苹果服务器请求商品
- (void)requestProductData:(NSString *)type;
//收到产品返回信息
- (void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response;
//请求失败
- (void)request:(SKRequest *)request didFailWithError:(NSError *)error;
//请求完成
- (void)requestDidFinish:(SKRequest *)request;
//验证购买，避免越狱软件模拟苹果请求达到非法购买问题
-(void)verifyPurchaseWithPaymentTransaction;
//监听购买结果
- (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transaction;
//交易结束
- (void)completeTransaction:(SKPaymentTransaction *)transaction;

@end
