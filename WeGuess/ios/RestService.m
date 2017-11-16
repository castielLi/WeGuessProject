//
//  HttpRequest.m
//  NovaiOS
//
//  Created by hecq on 16/3/13.
//  Copyright © 2016年 hecq. All rights reserved.
//
#import "RestService.h"



@implementation RestService

#pragma Factory Method

+(instancetype) getInstance{
    RestService *restService = [[RestService alloc]init];
    return restService;
}

#pragma mark -- GET请求 --
- (void)get:(NSString *)resource
              parameters:(id)parameters
                 callback:(void (^)(ApiResult *result,id))callback
                 {
    
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    /**
     *  可以接受的类型
     */
   
    //设置header
     manager.responseSerializer = [AFJSONResponseSerializer alloc];
    [self setRequestHeader:manager];
    
    NSDictionary *paramKeyValues = [parameters mj_keyValues];
    NSString *url = [self getUrl:resource];
    /**
     *  请求队列的最大并发数
     */
    //    manager.operationQueue.maxConcurrentOperationCount = 5;
    /**
     *  请求超时的时间
     */
    //    manager.requestSerializer.timeoutInterval = 5;
    [manager GET:url parameters:paramKeyValues
        progress:nil
        success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        if (callback) {
            
            ApiResult *result = [ApiResult mj_objectWithKeyValues:responseObject];
            id data = result.Data;
            callback(result,data);
        }
    }
         failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
             if(callback)
             {
                 ApiResult * result = [self getNetworkFailResult];
                 callback(result,error);
             }
        }
     ];
                     
}

#pragma mark -- POST请求 --
- (void)post:(NSString *)resource
               parameters:(id)parameters
                  callback:(void (^)(ApiResult *result,id))callback
                  {
    
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    [manager.requestSerializer setTimeoutInterval:20.0];
    manager.responseSerializer = [AFJSONResponseSerializer alloc];
    manager.requestSerializer = [AFJSONRequestSerializer alloc];
                      [manager.requestSerializer setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
                      [manager.requestSerializer setValue:@"application/json" forHTTPHeaderField:@"Accept"];
    [self setRequestHeader:manager];

    NSDictionary *paramKeyValues = [parameters mj_keyValues];
//    NSString *url = [self getUrl:resource];
    NSString *url = resource;
    
    [manager POST:url
       parameters:paramKeyValues
       progress:nil
       success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        if (callback) {
            ApiResult *result = [ApiResult mj_objectWithKeyValues:responseObject];
            id data = result.Data;
            callback(result,data);
        }
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        if(callback){
            ApiResult * result = [self getNetworkFailResult];
            result.Description = @"could not connect the server.";
            callback(result,error);
        }
            }];
}

#pragma mark -- POST/GET网络请求 --
- (void)request:(NSString *)URLString
                  parameters:(id)parameters
                        type:(HttpRequestType)type
                     success:(void (^)(id))success
                     failure:(void (^)(NSError *))failure {
    
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    [manager.requestSerializer setTimeoutInterval:20.0];
    manager.responseSerializer = [AFHTTPResponseSerializer serializer];
    switch (type) {
        case HttpRequestTypeGet:
        {
            [manager GET:URLString parameters:nil progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
                if (success) {
                    success(responseObject);
                }
            } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
                if (failure) {
                    failure(error);
                }
            }];
        }
            break;
        case HttpRequestTypePost:
        {
            [manager POST:URLString parameters:parameters progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
                if (success) {
                    success(responseObject);
                }
            } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
                if (failure) {
                    failure(error);
                                   }
            }];
        }
            break;
    }
}

#pragma mark -- 上传图片 --
- (void)upload:(NSString *)URLString
                 parameters:(id)parameters
                uploadParam:(UploadParam *)uploadParam
                    success:(void (^)())success
                    failure:(void (^)(NSError *))failure {
    
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    [manager.requestSerializer setTimeoutInterval:20.0];
    manager.responseSerializer = [AFHTTPResponseSerializer serializer];
    [manager POST:URLString parameters:parameters constructingBodyWithBlock:^(id<AFMultipartFormData>  _Nonnull formData) {
        [formData appendPartWithFileData:uploadParam.data name:uploadParam.name fileName:uploadParam.filename mimeType:uploadParam.mimeType];
    } progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        if (success) {
            success(responseObject);
        }
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        if (failure) {
            failure(error);
        }
    }];
}

- (void)setRequestHeader:(AFHTTPSessionManager *)manager
{
    [manager.requestSerializer setValue:@"application/json" forHTTPHeaderField:@"ContentType"];
    if(_headers != nil)
    {
        //得到词典中所有KEY值
        NSEnumerator * enumeratorKey = [_headers keyEnumerator];
        
        //快速枚举遍历所有KEY的值
        for (NSObject *object in enumeratorKey) {
            NSString *key = (NSString *)object;
            NSObject *keyValueObject = [_headers objectForKey:key];
            NSString *keyValue =(NSString *)keyValueObject;
            
            [manager.requestSerializer setValue:keyValue forHTTPHeaderField:key];
        }
    }

}

#pragma mark -- Header --
static NSDictionary * _headers;
- (void)setHeader:(NSDictionary *)headers
{
//    _headers = [NSDictionary alloc];
    _headers = [headers mutableCopy];
}

-(NSString *)getUrl:(NSString *)resource
{
  NSString * baseUrl = @"https://";
    return [baseUrl stringByAppendingString:resource];
}


-(ApiResult *)getNetworkFailResult
{
    ApiResult * result = [ApiResult alloc];
    result.Success = false;
    result.Description = @"";
    result.ErrorCode = 9;
    result.Data = nil;
    
    return result;
}

-(ApiResult *)getSuccessResult
{
    ApiResult * result = [ApiResult alloc];
    result.ErrorCode = 0;
    result.Success = true;
    result.Description =@"";
    return  result;
}
@end
