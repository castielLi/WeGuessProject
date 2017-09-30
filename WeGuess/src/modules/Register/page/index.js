/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Animated,
    TouchableWithoutFeedback
} from 'react-native';
import {
    connect
} from 'react-redux';
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import LoginButton from '../../Component/LoginButton';
import EditView from '../../Component/EditView';
import {RegistByMobilePhoneUrl, GetMobileCaptchaForRegistionUrl, WebViewUrl} from '../../Config/apiUrlConfig';
import {isPhone, isCaptcha, checkPassword} from '../../Utils/check';
import TokenManager from '../../TokenManager';
import {StatusBar} from "../../Component/BackButton";
import Partner from "../../Config/spreadConfig";

var Dimensions = require('Dimensions');

class Register extends ContainerComponent {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            password: '',
            error: '',
            captcha: '',
            protocol: new Animated.Value(1.0),  //协议勾选状态
            choose: 1,   //协议勾选初始值
            getCaptchaMsg: '获取验证码',   //获取验证码
            disabled: false,    //获取验证码点击状态
            loading: false
        };
        this.interTime = null;
        //初始化Token;
        this.tokenManager = TokenManager.getInstance();
    }

    componentWillUnmount() {
        if (this.interTime) {
            clearInterval(this.interTime);
        }
    }

    //注册
    register = () => {
        let phone = this.state.phone;
        let password = this.state.password;
        let captcha = this.state.captcha;
        if (phone == "") {
            this.setState({error: '*请输入手机号'});
            return false;
        }
        if (!isPhone(phone)) {
            this.setState({error: '*手机号码格式错误'});
            return false;
        }
        if (captcha == "") {
            this.setState({error: '*请输入验证码'});
            return false;
        }
        if (!isCaptcha(captcha)) {
            this.setState({error: '*验证码格式错误'});
            return false;
        }
        if (password == "") {
            this.setState({error: '*请输入密码'});
            return false;
        }
        if (!checkPassword(password)) {
            this.setState({error: '*密码为8-20个字符（包含至少一个字母）'});
            return false;
        }
        if (this.state.choose == 0) {
            this.setState({error: '*还未同意"用户协议"'});
            return false;
        }
        //取消掉错误信息
        this.setState({error: ''});

        //注册
        let that = this;  //调用this
        let params = {
            PhoneNumber: this.state.phone,
            Password: this.state.password,
            Captcha: this.state.captcha,
            Partner: Partner
        };
        this.showLoading();
        this.networking.post(RegistByMobilePhoneUrl, params, {})
            .then((data) => {
                let {Result, Data} = data;
                if (Result == 1) {
                    that.tokenManager.setToken(Data.Token, !Data.Tourist, Data.RefreshTime, Data.OpenID);
                    that.props.getMemberInfo();
                    that.hideLoading();
                    that.props.navigation.goBack(that.props.navigation.state.params.backKey);
                    return;
                }
                else {
                    that.hideLoading();
                    that.setState({
                        error: that.getErrorMsg(Result)
                    })
                }
            }, (error) => {
                that.hideLoading();
            }).catch((error) => {
            that.hideLoading();
        });
    }

    //协议选择
    protocolChoose() {
        this.state.choose = this.state.choose == 1 ? 0 : 1;
        Animated.timing(
            this.state.protocol,
            {
                toValue: this.state.choose,
                duration: 100
            }
        ).start();
    }

    //获取验证码定时器
    setTime = () => {
        let i = 60;
        let that = this;
        this.interTime = setInterval(function () {
            i--;
            that.setState({getCaptchaMsg: i + "秒"});
            that.setState({disabled: true});
            if (i <= 0) {
                clearInterval(that.interTime);
                that.setState({getCaptchaMsg: '获取验证码'});
                that.setState({disabled: false});
            }
        }, 1000);
    }

    //获取验证码
    getCaptcha() {
        if (this.state.loading) {
            return;
        }
        let that = this;  //调用this
        if (this.state.phone == "") {
            this.setState({error: '*请输入手机号'});
            return false;
        }
        if (!isPhone(this.state.phone)) {
            this.setState({error: '*手机号码格式错误'});
            return false;
        }
        else {
            this.setState({loading: true, error: ''});
            this.networking.get(GetMobileCaptchaForRegistionUrl, {PhoneNumber: this.state.phone}, {}).then((data) => {
                if (data.Result == 1008) {
                    that.setState({error: that.getErrorMsg(data.Result + "r")});
                }
                else if (data.Result == 1) {
                    that.setTime();
                } else {
                    that.setState({error: '*' + that.getErrorMsg(data.Result)});
                }
                that.setState({loading: false});

            }, () => {
                that.setState({loading: false});
            }).catch((error) => {

                that.setState({loading: false});
            });
        }
    }

    render() {
        let Alert = this.Alert;
        let Loading = this.Loading;
        let WebView = this.WebView;
        return (
            <View style={styles.container}>
                <StatusBar/>
                <View style={styles.padding}>
                    <View style={styles.list}>
                        <EditView label="手机号" name="请输入手机号" onChangeText={phone => this.setState({phone})}/>
                        <EditView label="验证码" name="请输入验证码" getyzm={this.state.getCaptchaMsg}
                                  disabled={this.state.disabled}
                                  onChangeText={captcha => this.setState({captcha})} onPress={() => this.getCaptcha()}/>
                        <EditView label="密码" name="请输入8-20个字符(包含至少一个字母)"
                                  onChangeText={password => this.setState({password})} secureTextEntry={true}/>
                    </View>
                    <View style={{marginTop: 16, flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableWithoutFeedback onPress={() => this.protocolChoose()}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={require('../resources/noarg.png')}
                                       style={{width: 16, height: 16, position: 'absolute'}}
                                />
                                <Animated.Image source={require('../resources/yesarg.png')}
                                                style={{width: 16, height: 16, opacity: this.state.protocol}}/>
                                <Text style={styles.protocol}>&nbsp;我已阅读&nbsp;</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <Text style={[styles.protocol, {color: '#3b67b2', textDecorationLine: "underline"}]}
                              onPress={() => this.showWebView(WebViewUrl.registerAgreement.url, WebViewUrl.registerAgreement.title)}>"用户协议"</Text>
                    </View>
                    <View>
                        <Text style={styles.errorMsg}>{this.state.error}</Text>
                    </View>
                    <LoginButton name="注册" onPress={() => this.register()} disabled={this.state.loading}/>

                </View>
                <View style={{flex: 1, flexDirection: 'column-reverse'}}>
                    <Image resizeMode="contain" source={require('../resources/logo-bottom.png')}
                           style={styles.loginIcon}/>
                </View>
                <Loading ref={(refLoading) => {
                    this.loading = refLoading
                }}></Loading>
                <WebView ref={(refWebView) => {
                    this.webview = refWebView
                }}></WebView>
                <Alert ref={(refAlert) => {
                    this.alert = refAlert
                }}></Alert>
            </View>
        );

    }
}

function select(store) {
    return {
        isLoggedIn: store.loginStore.isLoggedIn,
    }
}

export default connect(select)(Register);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    padding: {
        paddingHorizontal: 16,
    },
    errorMsg: {
        color: 'red',
        fontSize: 12,
        marginVertical: 2,
        textAlign: 'center',
        height: 20
    },
    loginIcon: {
        width: 100,
        alignSelf: 'center',
        marginBottom: 16
    },
    tishi: {
        fontSize: 16,
        color: '#3b67b2',
        textAlign: 'center'
    },
    protocol: {
        fontSize: 14
    }

});