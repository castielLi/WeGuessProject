/**
 * Created by maple on 2017/7/3.
 */


import React, {Component} from 'react';
import {connect} from 'react-redux';
import NetWorking from '../WGNetworking/Network';
import StorageHelper from '../StorageHelper';
import Loading from './Popup/loading';
import style from '../StyleSheet/style';
import AlertModal from './Popup/alert';
import WebViewModal from './Popup/webview';
import {ErrorCode, TipMsg} from './Error';

export default class ContainerComponent extends Component {

    constructor(props) {
        super(props);
        this.style = style;
        this.Loading = Loading;
        this.Alert = AlertModal;
        this.WebView = WebViewModal;
        this.networking = NetWorking.getInstance();
        this.storageHelper = new StorageHelper();
    }

    showAlert(title, content, ok, cancel, okText = "确定", cancelText = "取消", okColor, callback) {
        if (!ok && ok !== false) {
            ok = () => {
            };
        }
        if (this.alert) {
            this.alert.show(title, content, ok, cancel, okText, cancelText, okColor, callback);
        }
    }

    showError(errorCode, ok, callback) {
        if(errorCode==-2){
            return;
        }
        let errorMsg = this.getErrorMsg(errorCode);
        if (!ok) {
            ok = () => {
            };
        }
        if (this.alert) {
            this.alert.show("提示", errorMsg, ok, null, null, null, null, callback);
        }

    }

    getErrorMsg(errorCode) {
        let errorMsg = ErrorCode["0"];
        if (typeof errorCode == "string" || typeof errorCode == "number") {
            errorMsg = ErrorCode[errorCode];
        }
        if (!errorMsg) {
            errorMsg = ErrorCode["0"];
        }
        return errorMsg;
    }

    showLogin(ok, callback) {
        if (!ok) {
            ok = () => {
            };
        }
        if (this.alert) {
            this.alert.show("提示", TipMsg["NoLogin"], ok, () => {
            }, null, null, null, callback);
        }
    }

    showLogout(ok, callback) {
        if (!ok) {
            ok = () => {
            };
        }
        if (this.alert) {
            this.alert.show("提示", TipMsg["Logout"], ok, () => {
            }, null, null, null, callback);
        }
    }

    showLoading(callback) {
        if (this.loading) {
            this.loading.show(callback);
        }

    }

    showWebView(url, title) {
        if (this.webview) {
            this.webview.show(url, title);
        }

    }

    hideLoading(callback) {
        if (this.loading) {
            this.loading.hide(callback);
        }
    }
}