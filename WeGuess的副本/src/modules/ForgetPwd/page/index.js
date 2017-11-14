/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text
} from 'react-native';
import {
    connect
} from 'react-redux';
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import LoginButton from '../../Component/LoginButton';
import EditView from '../../Component/EditView';
import {GetMobileCaptchaForRetrievePasswordUrl, RetrievePasswordValidateByPhoneUrl} from '../../Config/apiUrlConfig';
import {isPhone, isCaptcha} from '../../Utils/check';
import {StatusBar} from "../../Component/BackButton";

class ForgetPwd extends ContainerComponent {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            captcha: '',
            error: '',
            GetCaptcha: '获取验证码',   //获取验证码
            disabled: false,    //获取验证码点击状态
            loading: false,
        };
        this.interTime = null;
    }

    componentWillUnmount() {
        if (this.interTime) {
            clearInterval(this.interTime);
        }
    }

    //下一步
    next() {
        var phone = this.state.phone;
        var captcha = this.state.captcha;
        if (phone == "") {
            this.setState({error: '*请输入手机号'});
            this.setState({loading: false});
            return false;
        }
        if (!isPhone(phone)) {
            this.setState({error: '*手机号码格式错误'});
            this.setState({loading: false});
            return false;
        }
        if (captcha == "") {
            this.setState({error: '*请输入验证码'});
            this.setState({loading: false});
            return false;
        }
        if (!isCaptcha(captcha)) {
            this.setState({error: '*验证码格式错误'});
            this.setState({loading: false});
            return false;
        }

        //取消掉错误信息
        this.setState({error: ''});

        let that = this;
        let params = {
            PhoneNumber: this.state.phone,
            Captcha: this.state.captcha
        }
        this.showLoading();
        this.networking.post(RetrievePasswordValidateByPhoneUrl, params, {})
            .then(function (data) {
                that.hideLoading();
                if (data.Result == 1) {
                    that.props.navigation.navigate('NewPwd', {
                        keyPwd: data.Data,
                        loginKey: that.props.navigation.state.key
                    });
                } else {
                    that.setState({error: '*' + that.getErrorMsg(data.Result)});
                }
            }, () => {
                that.hideLoading();
            }).catch((error) => {

            that.hideLoading();
        });

    }


    //获取验证码定时器
    setTime = () => {
        let i = 60;
        let that = this;
        this.interTime = setInterval(function () {
            i--;
            that.setState({GetCaptcha: i + "秒"});
            that.setState({disabled: true});
            if (i <= 0) {
                clearInterval(that.interTime);
                that.setState({GetCaptcha: '获取验证码', disabled: false});
            }
        }, 1000);
    }

    //获取验证码
    GetCaptcha() {
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
            this.networking.get(GetMobileCaptchaForRetrievePasswordUrl, {PhoneNumber: this.state.phone}, {})
                .then((data) => {
                    if (data.Result == 1) {
                        that.setTime();
                    }
                    else {
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
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <StatusBar/>
                <View style={styles.padding}>
                    <View style={styles.list}>
                        <EditView label="手机号" name="请输入手机号" getyzm={this.state.GetCaptcha}
                                  disabled={this.state.disabled}
                                  onChangeText={phone => this.setState({phone})} onPress={() => this.GetCaptcha()}/>
                        <EditView label="验证码" name="请输入验证码" onChangeText={captcha => this.setState({captcha})}/>
                    </View>
                    <View>
                        <Text style={styles.errormsg}>{this.state.error}</Text>
                    </View>
                    <LoginButton name="下一步" onPress={() => this.next()} disabled={this.state.loading}/>
                </View>
                <View style={{flex: 1, flexDirection: 'column-reverse'}}>
                    <Image resizeMode='contain' source={require('../resources/logo-bottom.png')}
                           style={styles.loginIcon}/>
                </View>
                <Loading ref={(refLoading) => {
                    this.loading = refLoading
                }}></Loading>
            </View>
        );
    }
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f4f4f4',
        },
        padding: {
            paddingHorizontal: 16,
        },
        errormsg: {
            color: 'red',
            fontSize: 12,
            marginVertical: 2,
            textAlign: 'center',
            height: 20
        },
        loginIcon: {
            height: 20,
            width: 100,
            alignSelf: 'center',
            marginBottom: 16,
        },
    });

const mapStateToProps = state => ({
    loginStore: state.loginStore
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch({type: 'Logout'}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPwd);