/**
 * Created by maple on 2017/10/10.
 * Hoc 模式
 * 封装Android 返回键侦听
 * 实现双击退出应用
 */

import React, {Component} from 'react';
import {
    BackHandler,
    ToastAndroid
} from 'react-native';
import config from "./config";

export default HocAndroidBack = (ComposedComponent) => class extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.lastBackPressed && this.lastBackPressed + config.Time >= Date.now()) {
                //最近间隔秒内按过back键，可以退出应用。
                BackHandler.exitApp();
                return false;
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.show(config.Message, config.ToastAndroid);
            return true;
        });
    }

    render() {
        return <ComposedComponent {...this.props}/>;
    }
};