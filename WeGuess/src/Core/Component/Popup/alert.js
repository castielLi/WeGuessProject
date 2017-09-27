/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    Button,
    Modal,
    TouchableWithoutFeedback,
    TouchableHighlight
} from 'react-native';
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;

export default class AlertModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            modalVisible: false,
            cancel: null,
            ok: null,
            title: "",
            content: "",
            okText: "确定",
            cancelText: "取消",
            okColor: "#3a66b3"
        };
    }

    show(title, content, ok, cancel, okText = "确定", cancelText = "取消", okColor = "#3a66b3") {
        this.setState({
            modalVisible: true,
            title: title ? title : "提示",
            content: content,
            ok: ok,
            cancel: cancel,
            okText: okText,
            cancelText: cancelText,
            okColor: okColor
        });
    };

    Cancel = () => {
        if (typeof this.state.cancel == "function") {
            this.state.cancel();
            this.setState({
                modalVisible: false,
                title: "提示",
                content: "",
                ok: null,
                cancel: null,
                okText: "确定",
                cancelText: "取消"
            });
        }
    }

    Ok = () => {
        this.setState({
            modalVisible: false,
            title: "提示",
            content: "",
            ok: null,
            cancel: null,
            okText: "确定",
            cancelText: "取消"
        });
        if (typeof this.state.ok == "function") {
            this.state.ok();
        }
    }

    render() {
        const width = ScreenWidth - 60;
        const buttonWidth = this.state.cancel ? width / 2 : width;
        if (this.state.modalVisible) {
            return (
                <View>
                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            if (typeof this.state.cancel == "function") {
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
                                                typeof this.state.title == "string" ?
                                                    (<Text style={[styles.title]}>{this.state.title}</Text>) :
                                                    (this.state.title)
                                            }
                                        </View>
                                        <View style={[styles.contentView]}>
                                            {
                                                typeof this.state.content == "string" ?
                                                    (<Text style={[styles.content]}>{this.state.content}</Text>) :
                                                    (this.state.content)
                                            }
                                        </View>
                                        <View style={[styles.buttonView]}>
                                            {this.state.cancel ? (
                                                <TouchableWithoutFeedback onPress={this.Cancel}>
                                                    <View style={[styles.button]}>
                                                        {this.state.cancelText ? (
                                                            <Text
                                                                style={[styles.buttonCancel, {width: buttonWidth}]}>{this.state.cancelText}</Text>) : (
                                                            <Text
                                                                style={[styles.buttonCancel, {width: buttonWidth}]}>取消</Text>)}
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            ) : null}
                                            {
                                                this.state.ok ? (
                                                    <TouchableWithoutFeedback onPress={this.Ok}>
                                                        <View style={[styles.button]}>
                                                            {this.state.okText ? (
                                                                <Text
                                                                    style={[styles.buttonOk, {
                                                                        width: buttonWidth,
                                                                        color: this.state.okColor
                                                                    }]}>{this.state.okText}</Text>) : (
                                                                <Text
                                                                    style={[styles.buttonOk, {
                                                                        width: buttonWidth,
                                                                        color: this.state.okColor
                                                                    }]}>确定</Text>)}
                                                        </View>

                                                    </TouchableWithoutFeedback>
                                                ) : null
                                            }
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
            );
        } else {
            return (<View style={styles.hidden}></View>)
        }


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