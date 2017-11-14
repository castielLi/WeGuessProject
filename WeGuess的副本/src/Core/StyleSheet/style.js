/**
 * Created by maple on 2017/6/29.
 */

import React, { Component } from 'react';
import { Platform } from 'react-native';
import {
    StyleSheet
} from 'react-native';

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    //signout只是测试例子
    signout:{
        height:40,
        width:310,
        backgroundColor:'rgba(53, 79, 138,1.0)',
        borderRadius:8,
    },
    statusBar:{
        paddingTop:(Platform.OS === 'ios') ? 0 : 20,
    }

});

export default style;