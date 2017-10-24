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

@interface WFTPay ()<PKPaymentAuthorizationViewControllerDelegate>
@end

@implementation WFTPay


RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(pay:(NSString *)token callback:(RCTResponseSenderBlock (^)())callback){
  
  UIViewController * currentVC = [UIApplication sharedApplication].keyWindow.rootViewController;
  
    [[SPayClient sharedInstance] pay:currentVC amount:[NSNumber numberWithFloat:0.0] spayTokenIDString:token payServicesString:@"pay.alipay.native.towap" finish:^(SPayClientPayStateModel *payStateModel, SPayClientPaySuccessDetailModel *paySuccessDetailModel) {
    callback();
  }];
}

RCT_EXPORT_METHOD(applepay:(NSString *)money callback:(RCTResponseSenderBlock (^)())callback){
  
  if (![PKPaymentAuthorizationViewController class]) {
    //PKPaymentAuthorizationViewController需iOS8.0以上支持
    NSLog(@"操作系统不支持ApplePay，请升级至9.0以上版本，且iPhone6以上设备才支持");
//    @throw  [NSException exceptionWithName:@"CQ_Error" reason:@"操作系统不支持ApplePay，请升级至9.0以上版本，且iPhone6以上设备才支持" userInfo:nil];
    //callback();
    return;
  }
  //检查当前设备是否可以支付
  if (![PKPaymentAuthorizationViewController canMakePayments]) {
    //支付需iOS9.0以上支持
    NSLog(@"设备不支持ApplePay，请升级至9.0以上版本，且iPhone6以上设备才支持");
//    @throw  [NSException exceptionWithName:@"CQ_Error" reason:@"设备不支持ApplePay，请升级至9.0以上版本，且iPhone6以上设备才支持" userInfo:nil];
    //callback();
    return;
  }
  //检查用户是否可进行某种卡的支付，是否支持Amex、MasterCard、Visa与银联四种卡，根据自己项目的需要进行检测
  NSArray *supportedNetworks = @[PKPaymentNetworkAmex, PKPaymentNetworkMasterCard,PKPaymentNetworkVisa,PKPaymentNetworkChinaUnionPay];
//  NSArray *supportedNetworks = @[PKPaymentNetworkChinaUnionPay];
  if (![PKPaymentAuthorizationViewController canMakePaymentsUsingNetworks:supportedNetworks]) {
    NSLog(@"没有绑定支付卡");
//    callback();
//    @throw  [NSException exceptionWithName:@"CQ_Error" reason:@"没有绑定支付卡" userInfo:nil];
    return;
  }
  
  // 订单请求对象
  PKPaymentRequest *request = [[PKPaymentRequest alloc]init];
  //商品订单信息对象
  PKPaymentSummaryItem *item1 = [PKPaymentSummaryItem summaryItemWithLabel:@"虚拟钻石" amount:[NSDecimalNumber decimalNumberWithString:money ]];
  request.paymentSummaryItems = @[item1];
  //指定国家地区编码
  request.countryCode = @"CN";
  //指定国家货币种类--人民币
  request.currencyCode = @"CNY";
  //指定支持的网上银行支付方式
  request.supportedNetworks = @[PKPaymentNetworkVisa,PKPaymentNetworkChinaUnionPay,PKPaymentNetworkMasterCard];
  //指定APP需要的商业ID
  request.merchantIdentifier = @"merchant.com.qic.wechatweguess";
  //指定支付的范围限制
  request.merchantCapabilities = PKMerchantCapabilityEMV;
  //指定订单接受的地址是哪里
  request.requiredBillingAddressFields = PKAddressFieldEmail | PKAddressFieldPostalAddress;
  
  //支付界面显示对象
  PKPaymentAuthorizationViewController *pvc = [[PKPaymentAuthorizationViewController alloc]initWithPaymentRequest:request];
  pvc.delegate = self;
  if (!pvc) {
    NSLog(@"出问题了，请注意检查");
    @throw  [NSException exceptionWithName:@"CQ_Error" reason:@"创建支付显示界面不成功" userInfo:nil];
  }else{
    [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:pvc animated:YES completion:nil];
  }
  
}



//在支付的过程中进行调用，这个方法直接影响支付结果在界面上的显示
//payment 是代表的支付对象，支付相关的所有信息都存在于这个对象,1 token 2 address
//comletion 是一个回调Block块，block块传递的参数直接影响界面结果的显示。
-(void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller didAuthorizePayment:(PKPayment *)payment completion:(void (^)(PKPaymentAuthorizationStatus))completion{
  /*
   NSError *error;
   ABMultiValueRef addressMultiValue = ABRecordCopyValue(payment.billingAddress ,kABPersonAddressProperty);
   NSDictionary *addressDictionary = (__bridge_transfer NSDictionary *) ABMultiValueCopyValueAtIndex(addressMultiValue, 0);
   //这里模拟取出地址里的每一个信息。
   NSLog(@"%@",addressDictionary[@"State"]);
   NSData *json = [NSJSONSerialization dataWithJSONObject:addressDictionary options:NSJSONWritingPrettyPrinted error: &error];
   // 这里需要将Token和地址信息发送到自己的服务器上，进行订单处理，处理之后，根据自己的服务器返回的结果调用completion()代码块，根据传进去的参数界面的显示结果会不同
   PKPaymentAuthorizationStatus status; // From your server
   completion(status);
   */
  //拿到token，
  PKPaymentToken *token = payment.token;
  //拿到订单地址
  NSString *city = payment.billingContact.postalAddress.city;
  NSLog(@"city:%@",city);
  ///在这里将token和地址发送到自己的服务器，有自己的服务器与银行和商家进行接口调用和支付将结果返回到这里
  //我们根据结果生成对应的状态对象，根据状态对象显示不同的支付结构
  //状态对象
  PKPaymentAuthorizationStatus status = PKPaymentAuthorizationStatusFailure;
  completion(status);
}

//当支付过程完成的时候进行调用
-(void)paymentAuthorizationViewControllerDidFinish:(PKPaymentAuthorizationViewController *)controller{
  NSLog(@"支付结束");
  [controller dismissViewControllerAnimated:YES completion:nil];
//  _payCallback();
}

@end
