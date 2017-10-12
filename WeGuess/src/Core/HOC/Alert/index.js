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
import {
    StyleSheet,
    View,
    Image,
    Modal,
    Text,
    Button,
    TouchableWithoutFeedback
} from 'react-native';

var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;


export default HocAlert = (ComposedComponent) => class extends Component {

    constructor(props, context) {
        super(props, context);
        this.initOptions = {
            modalVisible: false,
            Title: "提示",
            Content: "",
            HideOk: false,
            HideCancel: false,
            Ok: null,
            Cancel: null,
            OkText: "确定",
            CancelText: "取消",
            OkColor: "#3a66b3",
            CancelColor: "gray"
        }
        this.state = Object.assign({}, this.initOptions);
    }

    show = (options) => {
        let that = this;
        let newOptions = Object.assign({}, this.state, options,{modalVisible: true});
        that.setState(newOptions, () => {
            if (typeof callback === "function") {
                callback()
            }
        });
    };

    init = (callback) => {
        let newOptions = Object.assign({}, this.initOptions);
        this.setState(newOptions, () => {
            if (typeof callback === "function") {
                callback();
            }
        });
    }

    Cancel = () => {
        let cancelBack = this.state.cancel;
        this.init(cancelBack);
    }

    Ok = () => {
        let okBack = this.state.ok;
        this.init(okBack);
    }

    render() {
        let newProps = {
            showAlert: this.show,
            hideAlert: this.init
        }
        const width = ScreenWidth - 60;
        const buttonWidth = this.state.Cancel ? width / 2 : width;
        return (
            <View style={{flex: 1}}>
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        if (typeof this.state.Cancel == "function") {
                            this.Cancel();
                        } else {
                            this.Ok();
                        }
                    }}
                >
                    <TouchableWithoutFeedback onPress={this.Cancel}>
                        <View style={[styles.container, {width: ScreenWidth}]}>
                            <TouchableWithoutFeedback onPress={() => {
                            }}>
                                <View style={[styles.alert, {width: width}]}>
                                    <View style={[styles.titleView]}>
                                        {
                                            typeof this.state.Title == "string" ?
                                                (<Text style={[styles.title]}>{this.state.Title}</Text>) :
                                                (this.state.Title)
                                        }
                                    </View>
                                    <View style={[styles.contentView]}>
                                        {
                                            typeof this.state.Content == "string" ?
                                                (<Text style={[styles.content]}>{this.state.Content}</Text>) :
                                                (this.state.Content)
                                        }
                                    </View>
                                    <View style={[styles.buttonView]}>
                                        {
                                            this.state.HideCancel ? null : (
                                                <TouchableWithoutFeedback onPress={this.Cancel}>
                                                    <View style={[styles.button]}>
                                                        <Text
                                                            style={[styles.buttonCancel, {width: buttonWidth}]}>{this.state.CancelText}</Text>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            )
                                        }
                                        {
                                            this.state.HideOk ? null : (
                                                <TouchableWithoutFeedback onPress={this.Ok}>
                                                    <View style={[styles.button]}>
                                                        <Text style={[styles.buttonOk, {
                                                            width: buttonWidth,
                                                            color: this.state.OkColor
                                                        }]}>确定</Text>
                                                    </View>

                                                </TouchableWithoutFeedback>
                                            )
                                        }
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <ComposedComponent {...this.props} {...newProps}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    hidden: {
        position: 'absolute',
        height: 0,
        width: 0,
        top: 0,
        left: 0,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alert: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: "#eeeeee",
        borderRadius: 5,
    },
    titleView: {},
    title: {
        color: "#3a66b3",
        backgroundColor: "#f7f7f7",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    contentView: {
        borderColor: "#eeeeee",
        borderTopWidth: 1,
        borderBottomWidth: 1
    },
    content: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 30,
        paddingBottom: 30,
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonCancel: {
        paddingTop: 10,
        paddingBottom: 10,
        color: "gray",
        textAlign: "center",
        borderColor: "#eeeeee",
        borderRightWidth: 1,
    },
    buttonOk: {
        paddingTop: 10,
        paddingBottom: 10,
        color: "#3a66b3",
        textAlign: "center"
    },
});