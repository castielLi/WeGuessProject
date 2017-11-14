//
//  ApiResult.h
//  NovaiOS
//
//  Created by hecq on 16/3/13.
//  Copyright © 2016年 hecq. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ApiResult : NSObject

    
    @property BOOL Success;
    @property  NSString * Description;
    @property  NSObject * Data;
    @property int ErrorCode;
    

@end