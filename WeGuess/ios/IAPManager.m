		//
//  IAPManager.m
//  WeGuess
//
//  Created by castiel on 2017/9/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "IAPManager.h"
#import "SPayClient.h"
#import <UIKit/UIKit.h>
#import <PassKit/PassKit.h>
#import <AddressBook/AddressBook.h>
#import "Toast+UIView.h"
#import "RestService.h"
#import "IAPManager.h"

@interface IAPManager()
@end

@implementation IAPManager

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(applepay:(NSString *)money callback:(RCTResponseSenderBlock (^)())callback){
  NSString *proId = @"";
  if([money isEqualToString:@"1"]){
    proId =@"com.qicloud.weguess1";
  }else if([money isEqualToString:@"3"]){
    proId =@"com.qicloud.weguess3";
  }else if([money isEqualToString:@"6"]){
    proId =@"com.qicloud.weguess5";
  }else if([money isEqualToString:@"8"]){
    proId =@"com.qicloud.weguess6";
  }else if([money isEqualToString:@"12"]){
    proId =@"com.qicloud.weguess8";
  }else if([money isEqualToString:@"18"]){
    proId =@"com.qicloud.weguess9";
  }else if([money isEqualToString:@"25"]){
    proId =@"com.qicloud.weguess10";
  }else if([money isEqualToString:@"50"]){
    proId =@"com.qicloud.weguess12";
  }else if([money isEqualToString:@"108"]){
    proId =@"com.qicloud.weguess14";
  }if([money isEqualToString:@"3Prop"]){
    proId =@"com.qicloud.weguess2";
  }else if([money isEqualToString:@"6Prop"]){
    proId =@"com.qicloud.weguess4";
  }else if([money isEqualToString:@"12Prop"]){
    proId =@"com.qicloud.weguess7";
  }else if([money isEqualToString:@"50Prop"]){
    proId =@"com.qicloud.weguess11";
  }else if([money isEqualToString:@"98Prop"]){
    proId =@"com.qicloud.weguess13";
  }else if([money isEqualToString:@"198Prop"]){
    proId =@"com.qicloud.weguess15";
  }else if([money isEqualToString:@"488Prop"]){
    proId =@"com.qicloud.weguess16";
  }
  [self IPAPay:proId];
}

- (void)IPAPay:(NSString *)proId
{
  if (![PKPaymentAuthorizationViewController class]) {
    NSLog(@"操作系统不支持ApplePay，请升级至9.0以上版本，且iPhone6以上设备才支持");
    [self toastShow: @"操作系统不支持ApplePay，请升级至9.0以上版本，且iPhone6以上设备才支持"];
    return;
  }
  //检查当前设备是否可以支付
  if (![PKPaymentAuthorizationViewController canMakePayments]) {
    NSLog(@"设备不支持ApplePay，请升级至9.0以上版本，且iPhone6以上设备才支持");
    [self toastShow: @"设备不支持ApplePay，请升级至9.0以上版本，且iPhone6以上设备才支持"];
    return;
  }
  //检查用户是否可进行某种卡的支付，是否支持Amex、MasterCard、Visa与银联四种卡，根据自己项目的需要进行检测
  //    NSArray *supportedNetworks = @[PKPaymentNetworkAmex, PKPaymentNetworkMasterCard,PKPaymentNetworkVisa,PKPaymentNetworkChinaUnionPay];
  //    if (![PKPaymentAuthorizationViewController canMakePaymentsUsingNetworks:supportedNetworks]) {
  //      NSLog(@"没有绑定支付卡");
  //      [self toastShow: @"没有绑定支付卡"];
  //      return;
  //    }
  _currentProId = proId;
  [self requestProductData:proId];
}

-(void)toastShow:(NSString *)message {
  NSString *position =@"center";
  NSNumber *addPixelsY  =nil;
  
  NSInteger durationInt = 2;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [[[[UIApplication sharedApplication]windows]firstObject] makeToast:message duration:durationInt position:position addPixelsY:addPixelsY == nil ? 0 : [addPixelsY intValue]];
  });
  
}

//去苹果服务器请求商品
- (void)requestProductData:(NSString *)type{
  NSLog(@"-------------请求对应的产品信息----------------");
  NSArray *product = [[NSArray alloc] initWithObjects:type,nil];
  NSSet *nsset = [NSSet setWithArray:product];
  SKProductsRequest *request = [[SKProductsRequest alloc] initWithProductIdentifiers:nsset];
  request.delegate = self;
  [request start];
}

//收到产品返回信息
- (void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response{
  NSLog(@"--------------收到产品反馈消息---------------------");
  NSArray *product = response.products;
  if([product count] == 0){
    NSLog(@"--------------没有商品------------------");
    [self toastShow: @"没有商品"];
    return;
  }
  NSLog(@"productID:%@", response.invalidProductIdentifiers);
  NSLog(@"产品付费数量:%lu",(unsigned long)[product count]);
  SKProduct *p = nil;
  for(SKProduct *pro in product) {
    NSLog(@"%@", [pro description]);
    NSLog(@"%@", [pro localizedTitle]);
    NSLog(@"%@", [pro localizedDescription]);
    NSLog(@"%@", [pro price]);
    NSLog(@"%@", [pro productIdentifier]);
    if([pro.productIdentifier isEqualToString:_currentProId]){
      p = pro;
    }
  }
  SKPayment *payment = [SKPayment paymentWithProduct:p];
  NSLog(@"发送购买请求");
  [[SKPaymentQueue defaultQueue] addPayment:payment];
}

//请求失败
- (void)request:(SKRequest *)request didFailWithError:(NSError *)error{
  [self toastShow: @"支付失败"];
  NSLog(@"------------------错误-----------------:%@", error);
}

- (void)requestDidFinish:(SKRequest *)request{
  NSLog(@"------------反馈信息结束-----------------");
}

//沙盒测试环境验证
#define SANDBOX @"https://sandbox.itunes.apple.com/verifyReceipt"
//正式环境验证
#define AppStore @"https://buy.itunes.apple.com/verifyReceipt"
/**
 *  验证购买，避免越狱软件模拟苹果请求达到非法购买问题
 *
 */

-(void)verifyPurchaseWithPaymentTransaction:(NSString *)PayEnv{
  //从沙盒中获取交易凭证并且拼接成请求体数据
  NSURL *receiptUrl=[[NSBundle mainBundle] appStoreReceiptURL];
  NSData *receiptData=[NSData dataWithContentsOfURL:receiptUrl];
  NSString *receiptString=[receiptData base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed];//转化为base64字符串
  NSString *bodyString = [NSString stringWithFormat:@"{\"receipt-data\" : \"%@\"}", receiptString];//拼接请求数据
  NSData *bodyData = [bodyString dataUsingEncoding:NSUTF8StringEncoding];
  
  //创建请求到苹果官方进行购买验证
  NSURL *url=[NSURL URLWithString:SANDBOX];
  if([PayEnv isEqualToString:@"AppStore"]){
    url = [NSURL URLWithString:AppStore];
  }
  NSMutableURLRequest *requestM=[NSMutableURLRequest requestWithURL:url];
  requestM.HTTPBody=bodyData;
  requestM.HTTPMethod=@"POST";
  //创建连接并发送同步请求
  NSError *error=nil;
  NSData *responseData=[NSURLConnection sendSynchronousRequest:requestM returningResponse:nil error:&error];
  if(error) {
    NSLog(@"验证购买过程中发生错误，错误信息：%@",error.localizedDescription);
    return;
  }
  NSDictionary *dic=[NSJSONSerialization JSONObjectWithData:responseData options:NSJSONReadingAllowFragments error:nil];
  NSLog(@"%@",dic);
  if([dic[@"status"] intValue]==0){
    NSLog(@"购买成功！");
    [self toastShow: @"购买成功"];
    NSDictionary *dicReceipt= dic[@"receipt"];
    NSDictionary *dicInApp=[dicReceipt[@"in_app"] firstObject];
    NSString *productIdentifier= dicInApp[@"product_id"];//读取产品标识
    //如果是消耗品则记录购买数量，非消耗品则记录是否购买过
    NSUserDefaults *defaults=[NSUserDefaults standardUserDefaults];
    if([productIdentifier containsString:@"com.qic.wechatWeGuess"]) {
        int purchasedCount=[defaults integerForKey:productIdentifier];//已购买数量
        [[NSUserDefaults standardUserDefaults] setInteger:(purchasedCount+1) forKey:productIdentifier];
      }else{
        [defaults setBool:YES forKey:productIdentifier];
      }
    //在此处对购买记录进行存储，可以存储到开发商的服务器端
  }else if([dic[@"status"] intValue]==21008){
    //应该发送到生产环境的发送到了沙盒环境，重新发送
    [self verifyPurchaseWithPaymentTransaction:@"AppStore"];
  }else{
    NSLog(@"购买失败，未通过验证！");
    [self toastShow: @"购买失败"];
  }
}

//监听购买结果
- (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transaction{
  for(SKPaymentTransaction *tran in transaction){
    switch
    (tran.transactionState) {
      case
      SKPaymentTransactionStatePurchased:{
        NSLog(@"交易完成");
        // 发送到苹果服务器验证凭证
        [self verifyPurchaseWithPaymentTransaction:@"SANDBOX"];
        [[SKPaymentQueue defaultQueue] finishTransaction:tran];
      }
        break;
      case
      SKPaymentTransactionStatePurchasing:
        NSLog(@"商品添加进列表");
        break;
      case
      SKPaymentTransactionStateRestored:{
        NSLog(@"已经购买过商品");
        [[SKPaymentQueue defaultQueue] finishTransaction:tran];
      }
        break;
      case
      SKPaymentTransactionStateFailed:{
        NSLog(@"交易失败");
        [[SKPaymentQueue defaultQueue] finishTransaction:tran];
        [self toastShow: @"购买失败"];
      }
        break;
      default:
        break;
    }
  }
}

//交易结束
- (void)completeTransaction:(SKPaymentTransaction *)transaction{
  NSLog(@"交易结束");
  [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
}

@end

