/**
 * Created by maple on 2017/6/29.
 */

import React, {Component} from 'react';
import StyleSheetHelper from '../StyleSheet/index';
import Style from '../StyleSheet/style';
import Loading from './Popup/loading';
import AlertModal from './Popup/alert';
import {ErrorCode, TipMsg} from './Error';

export default class DisplayComponent extends Component {

    constructor(props) {
        super(props);
        this.Loading = Loading;
        this.Alert = AlertModal;
    }

    componentWillMount(newStyles) {
        const styles = StyleSheetHelper.mergeStyleSheets(Style, newStyles);
        return styles;
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

    showAlert(title, content, ok, cancel, okText = "确定", cancelText = "取消", okColor, callback) {
        if (this.alert) {
            this.alert.show(title, content, ok, cancel, okText, cancelText, okColor, callback);
        }
    }

    showError(errorCode, ok, callback) {
        if (errorCode === -2 || errorCode === "-2") {
            return;
        }
        let errorMsg = this.getErrorMsg(errorCode);
        if (this.alert) {
            this.alert.show("提示", errorMsg, ok, null, null, null, null, callback);
        }

    }

    showLoading(callback) {
        if (this.loading) {
            this.loading.show(callback);
        }
    }

    hideLoading(callback) {
        if (this.loading) {
            this.loading.hide(callback);
        }

    }

}
