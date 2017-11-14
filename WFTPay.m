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
#import <PassKit/PassKit.h>
#import <AddressBook/AddressBook.h>
#import "Toast+UIView.h"
#import "RestService.h"
#import "IAPManager.h"

@interface WFTPay ()<PKPaymentAuthorizationViewControllerDelegate>
@end

@implementation WFTPay

RCT_EXPORT_MODULE(WFTPay)


RCT_EXPORT_METHOD(pay:(NSString *)token callback:(RCTResponseSenderBlock (^)())callback){
  
  UIViewController * currentVC = [UIApplication sharedApplication].keyWindow.rootViewController;
  
    [[SPayClient sharedInstance] pay:currentVC amount:[NSNumber numberWithFloat:0.0] spayTokenIDString:token payServicesString:@"pay.alipay.native.towap" finish:^(SPayClientPayStateModel *payStateModel, SPayClientPaySuccessDetailModel *paySuccessDetailModel) {
    callback();
  }];
}

RCT_EXPORT_METHOD(applepay:(NSString *)money callback:(RCTResponseSenderBlock (^)())callback){
  IAPManager * iapManager = [IAPManager alloc];
  NSString *proId = @"com.qic.wechatWeGuess2";
  [iapManager IPAPay:proId];
//  if (![PKPaymentAuthorizationViewController class]) {
//    //PKPaymentAuthorizationViewController需iOS8.0以上支持
//    NSLog(@"操作系统不支持ApplePay，请升级至9.0以上版本，且iPhone6以上设备才支持");
//    [self toastShow: @"操作系统不支持ApplePay，请升级至9.0以上版本，且iPhone6以上设备才支持"];
////    @throw  [NSException exceptionWithName:@"CQ_Error" reason:@"操作系统不支持ApplePay，请升级至9.0以上版本，且iPhone6以上设备才支持" userInfo:nil];
//    //callback();
//    return;
//  }
//  //检查当前设备是否可以支付
//  if (![PKPaymentAuthorizationViewController canMakePayments]) {
//    //支付需iOS9.0以上支持
//    NSLog(@"设备不支持ApplePay，请升级至9.0以上版本，且iPhone6以上设备才支持");
//    [self toastShow: @"设备不支持ApplePay，请升级至9.0以上版本，且iPhone6以上设备才支持"];
////    @throw  [NSException exceptionWithName:@"CQ_Error" reason:@"设备不支持ApplePay，请升级至9.0以上版本，且iPhone6以上设备才支持" userInfo:nil];
//    //callback();
//    return;
//  }
//  //检查用户是否可进行某种卡的支付，是否支持Amex、MasterCard、Visa与银联四种卡，根据自己项目的需要进行检测
//  NSArray *supportedNetworks = @[PKPaymentNetworkAmex, PKPaymentNetworkMasterCard,PKPaymentNetworkVisa,PKPaymentNetworkChinaUnionPay];
//  NSArray *supportedNetworks = @[PKPaymentNetworkChinaUnionPay];
//  if (![PKPaymentAuthorizationViewController canMakePaymentsUsingNetworks:supportedNetworks]) {
//    NSLog(@"没有绑定支付卡");
//    [self toastShow: @"没有绑定支付卡"];
////    callback();
////    @throw  [NSException exceptionWithName:@"CQ_Error" reason:@"没有绑定支付卡" userInfo:nil];
//    return;
//  }
//
//  // 订单请求对象
//  PKPaymentRequest *request = [[PKPaymentRequest alloc]init];
//  //商品订单信息对象
//  PKPaymentSummaryItem *item1 = [PKPaymentSummaryItem summaryItemWithLabel:@"虚拟钻石" amount:[NSDecimalNumber decimalNumberWithString:money ]];
//  request.paymentSummaryItems = @[item1];
//  //指定国家地区编码
//  request.countryCode = @"CN";
//  //指定国家货币种类--人民币
//  request.currencyCode = @"CNY";
//  //指定支持的网上银行支付方式
//  request.supportedNetworks = @[PKPaymentNetworkVisa,PKPaymentNetworkChinaUnionPay,PKPaymentNetworkMasterCard];
//  //指定APP需要的商业ID
//  request.merchantIdentifier = @"merchant.com.qic.wechatweguess";
//  //指定支付的范围限制
//  request.merchantCapabilities = PKMerchantCapabilityEMV;
//  //指定订单接受的地址是哪里
//  request.requiredBillingAddressFields = PKAddressFieldEmail | PKAddressFieldPostalAddress;
//
//  //支付界面显示对象
//  PKPaymentAuthorizationViewController *pvc = [[PKPaymentAuthorizationViewController alloc]initWithPaymentRequest:request];
//  pvc.delegate = self;
//  if (!pvc) {
//    [self toastShow: @"支付发生错误"];
//    NSLog(@"出问题了，请注意检查");
//    @throw  [NSException exceptionWithName:@"CQ_Error" reason:@"创建支付显示界面不成功" userInfo:nil];
//  }else{
//    [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:pvc animated:YES completion:nil];
//  }
//
}



//在支付的过程中进行调用，这个方法直接影响支付结果在界面上的显示
//payment 是代表的支付对象，支付相关的所有信息都存在于这个对象,1 token 2 address
//comletion 是一个回调Block块，block块传递的参数直接影响界面结果的显示。
-(void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller didAuthorizePayment:(PKPayment *)payment completion:(void (^)(PKPaymentAuthorizationStatus))completion{
  
  //拿到token，
  PKPaymentToken *token = payment.token;
  //拿到订单地址
  NSString *city = payment.billingContact.postalAddress.city;
  NSLog(@"city:%@",city);
  ///在这里将token和地址发送到自己的服务器，有自己的服务器与银行和商家进行接口调用和支付将结果返回到这里
  //我们根据结果生成对应的状态对象，根据状态对象显示不同的支付结构
  //状态对象

  
  [self toastShow: @"支付结果查询中"];
  [self verifyTransactionResult:0];
  PKPaymentAuthorizationStatus status = PKPaymentAuthorizationStatusFailure;
  completion(status);
}

//当支付过程完成的时候进行调用
-(void)paymentAuthorizationViewControllerDidFinish:(PKPaymentAuthorizationViewController *)controller{
  NSLog(@"支付结束");
  [self toastShow: @"支付结束"];
  [controller dismissViewControllerAnimated:YES completion:nil];
//  _payCallback();
}

-(void)toastShow:(NSString *)message {
  NSString *position =@"center";
  NSNumber *addPixelsY  =nil;

  NSInteger durationInt = 2;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [[[[UIApplication sharedApplication]windows]firstObject] makeToast:message duration:durationInt position:position addPixelsY:addPixelsY == nil ? 0 : [addPixelsY intValue]];
  });

}

#pragma mark - VerifyFinishedTransaction
- (void)verifyTransactionResult:(int)isSandBox
{
  // 验证凭据，获取到苹果返回的交易凭据
  // appStoreReceiptURL iOS7.0增加的，购买交易完成后，会将凭据存放在该地址
  NSURL *receiptURL = [[NSBundle mainBundle] appStoreReceiptURL];
  // 从沙盒中获取到购买凭据
  NSData *receipt = [NSData dataWithContentsOfURL:receiptURL];
  // 传输的是BASE64编码的字符串
  /**
   BASE64 常用的编码方案，通常用于数据传输，以及加密算法的基础算法，传输过程中能够保证数据传输的稳定性
   BASE64是可以编码和解码的
   */
  NSDictionary *requestContents = @{
                                    @"receipt-data": [receipt base64EncodedStringWithOptions:0]
                                    };
  NSError *error;
  // 转换为 JSON 格式
  NSData *requestData = [NSJSONSerialization dataWithJSONObject:requestContents
                                                        options:0
                                                          error:&error];
  // 不存在
  if (!requestData) {
    /* ... Handle error ... */
    [self toastShow: @"支付失败"];
  }
  
  // 发送网络POST请求，对购买凭据进行验证
  NSString *verifyUrlString;
  if (isSandBox==1){
    verifyUrlString = @"https://sandbox.itunes.apple.com/verifyReceipt";
  }
  else{
    verifyUrlString = @"https://buy.itunes.apple.com/verifyReceipt";
  }
  
  RestService * service = [[RestService alloc]init];
  
  [service post:verifyUrlString parameters:requestContents callback:^(ApiResult *result,id response){
    NSError *error;
    NSDictionary *jsonResponse = [NSJSONSerialization JSONObjectWithData:response options:0 error:&error];
    if (!jsonResponse) {
      NSLog(@"验证失败");
      [self toastShow: @"支付失败"];
    }
    if([[jsonResponse objectForKey:@"status"] intValue]==0) //注意，status=@"0" 是验证收据成功
    {
      NSLog(@"验证成功");
      [self toastShow: @"支付成功"];
    }
    else if([[jsonResponse objectForKey:@"status"] intValue]==21007) //注意，status=@"0" 是验证收据成功
    {
      [self verifyTransactionResult:1];
    }
    else{
      NSLog(@"验证失败");
      [self toastShow: @"支付失败"];
    }
  }];
  
}


@end
