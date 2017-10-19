/**
 * Created by maple on 2017/10/10.
 * Hoc 模式
 * 封装Loading效果，需要的组件直接使用。
 * 使用方法：
 *      import HocAlert from "/Core/Hoc/Loading" (路径为相对位置,实际使用注意修改)
 *      HocAlert(ComposedComponent);(将需要封装的组件传入)
 *      显示alert:this.props.showAlert(options); (回调参数可选)
 *      隐藏alert:this.props.hideAlert(options); (回调参数可选)
 *
 *      参数options：{
 *          Title:string|component,//标题
 *          Content:string|component,//内容
 *          HideOk:false,//隐藏确定按钮，默认为false
 *          HideCancel:false,//隐藏取消按钮，默认为false
 *          Ok：function,//确定回调方法
 *          Cancel:function,//取消回调方法,
 *          OkText: "确定",//默认确认按钮文本
 *          CancelText: "取消",//默认取消按钮文本
 *          OkColor: "#3a66b3",//默认确认按钮文本颜色
 *          CancelColor: "gray",//默认取消按钮文本颜色
 *      }
 */

import React, {Component} from 'react';
import {ErrorCode, TipMsg} from '../../Component/Error';

export default HocError = (ComposedComponent) => class extends Component {

    constructor(props, context) {
        super(props, context);
    }

    getErrorMsg=(errorCode)=> {
        let errorMsg = ErrorCode["0"];
        if (typeof errorCode == "string" || typeof errorCode == "number") {
            errorMsg = ErrorCode[errorCode];
        }
        if (!errorMsg) {
            errorMsg = ErrorCode["0"];
        }
        return errorMsg;
    }

    render() {
        let newProps = {
            getErrorMsg: this.getErrorMsg,
        }
        return (
                <ComposedComponent {...this.props} {...newProps}/>
        );
    }
}