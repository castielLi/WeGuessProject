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
    Button,
    Modal,
    WebView,
    TouchableWithoutFeedback,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;

export default class WebViewModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            modalVisible: false,
            url: "",
            title: "",
            scalesPageToFit: true,
            status: '',
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: true,
        };
    }

    show(url, title) {
        this.setState({
            url: url,
            modalVisible: true,
            title: title
        });
    };

    close = () => {
        this.setState({
            modalVisible: false,
            url: "",
            title: ""
        });
    }

    render() {
        let height = Platform.OS == "ios" ? ScreenHeight - 20 : ScreenHeight;
        if (this.state.modalVisible) {
            return (
                <View>
                    <Modal animationType={"fade"}
                           transparent={false}
                           visible={this.state.modalVisible}
                           onRequestClose={() => {
                               this.close();
                           }}>
                        <View style={styles.statusBar}></View>
                        <View style={[styles.container, {width: ScreenWidth, height: height}, styles.statusBar]}>
                            <View style={[styles.container, {}]}>
                                <WebView
                                    ref={'webview'}
                                    automaticallyAdjustContentInsets={false}
                                    style={[styles.webView, {width: ScreenWidth, height: height}]}
                                    source={{uri: this.state.url}}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    decelerationRate="normal"
                                    startInLoadingState={true}
                                    scalesPageToFit={this.state.scalesPageToFit}
                                />
                            </View>
                            <View style={[styles.webViewHeader]}>
                                <TouchableWithoutFeedback onPress={this.close}>
                                    <Icon.Button name="ios-arrow-back" backgroundColor="#ffffff" color="#3a66b3"
                                                 iconStyle={{fontSize: (Platform.OS === 'ios') ? 20 : 30}}>
                                        <Text style={{width: 20}}/>
                                    </Icon.Button>
                                </TouchableWithoutFeedback>
                                <View>
                                    <Text style={[styles.title]}>{this.state.title}</Text>
                                </View>
                                <TouchableWithoutFeedback onPress={() => {
                                }}>
                                    <Icon.Button backgroundColor="#ffffff" size={30}>
                                        <Text style={{width: 30}}> </Text>
                                    </Icon.Button>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </Modal>
                </View>
            );
        } else {
            return (<View style={styles.hidden}></View>)
        }


    }
}

const styles = StyleSheet.create({
    statusBar: {
        height: (Platform.OS === 'ios') ? 20 : 0,
        backgroundColor: 'rgba(255, 255, 255, 1.0)',
        borderBottomWidth: 1,
        borderBottomColor: "#cccccc"
    },
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
        backgroundColor: '#efeff4',
    },
    back: {
        position: "absolute",
        left: 10,
        width: 50,
        backgroundColor: "black"
    },
    title: {
        color: "#3a66b3",
        fontSize: 18,
    },
    webViewHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 46,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: ScreenWidth,
        backgroundColor: "#ffffff",
        borderColor: "#cccccc",
        borderBottomWidth: 1,
        paddingBottom: 2,
        paddingLeft: 8,
        paddingRight: 8
    },
    webView: {
        backgroundColor: "#efeff4",
    }

});