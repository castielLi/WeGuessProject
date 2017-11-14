/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import {
    connect
} from 'react-redux';
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import {IsBindingPhoneUrl, GetCaptchaUrl, BindPhoneUrl} from '../../Config/apiUrlConfig';
import {isPhone, isCaptcha} from '../../Utils/check';
import LoginButton from '../../Component/LoginButton';
import EditView from '../../Component/EditView';
import {BackButton, BlankButton} from "../../Component/BackButton";

class BindPhone extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: "绑定手机号",
            headerLeft: (
                <BackButton onPress={() => {
                    navigation.goBack();
                }}/>
            ),
            headerRight: (
                <BlankButton/>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            bindPhoneStatus: '已绑定',   //手机绑定状态
            isBindPhone: '',  //已经绑定的手机号
            captcha: '',     //验证码
            error: '',   //错误提示信息
            getCaptcha: '获取验证码',   //获取验证码
            disabled: false,    //获取验证码点击状态
            loading: false,
            editableInput: false   //手机号输入框默认不可编辑
        }
        this.interTime = null;
    }

    componentDidMount() {
        this.isBindingPhone();
    }


    componentWillUnmount() {
        if (this.interTime) {
            clearInterval(this.interTime);
        }
    }

    //已绑定的手机号
    isBindingPhone() {
        let that = this;
        this.networking.get(IsBindingPhoneUrl, null, {}).then((data) => {
            if (data.Result == 1) {
                that.setState({
                    isBindPhone: data.Data,
                    phone: data.Data
                })
            } else {
                that.showError(data.Result);
            }
        }, (error) => {

            that.showError(error);
        }).catch((error) => {
            that.showError(error);
        });
    }

    //获取验证码定时器
    setTime = () => {
        let i = 60;
        let that = this;
        this.interTime = setInterval(function () {
            i--;
            that.setState({getCaptcha: i + "秒"});
            that.setState({disabled: true});
            if (i <= 0) {
                clearInterval(that.interTime);
                that.setState({getCaptcha: '获取验证码'});
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
        if (this.state.phone == this.state.isBindPhone) {
            this.setState({error: '*相同的手机号'});
            return false;
        }
        else {
            this.setState({loading: true, error: ''});
            this.networking.get(GetCaptchaUrl, {Phone: this.state.phone}, {}).then((data) => {
                if (data.Result == 1008) {
                    that.setState({error: '*手机号已绑定'});
                }
                else if (data.Result == 1015) {
                    that.setState({error: '*验证码次数超过限制'});
                }
                else if (data.Result == 1016) {
                    that.setState({error: '*请求次数太多，请稍后再试'});
                }
                else if (data.Result == 1) {
                    that.setTime();
                } else {
                    this.showError(data.Result);
                }
                that.setState({loading: false});

            }, (error) => {
                that.setState({loading: false});
                that.showError(error);
            }).catch((error) => {
                that.setState({loading: false});
                that.showError(error);
            });
        }
    }

    //点击确定
    replacePhone() {
        let phone = this.state.phone;
        let captcha = this.state.captcha;
        if (phone == "") {
            this.setState({error: '*请输入手机号'});
            this.hideLoading();
            return false;
        }
        if (!isPhone(phone)) {
            this.setState({error: '*手机号码格式错误'});
            this.hideLoading();
            return false;
        }
        if (phone == this.state.isBindPhone) {
            this.setState({error: '*相同的手机号'});
            this.hideLoading();
            return false;
        }
        if (captcha == "") {
            this.setState({error: '*请输入验证码'});
            this.hideLoading();
            return false;
        }
        if (!isCaptcha(captcha)) {
            this.setState({error: '*验证码格式错误'});
            this.hideLoading();
            return false;
        }
        else {
            this.setState({error: ''});
            let that = this;
            this.showLoading();
            this.networking.post(BindPhoneUrl, {
                Phone: this.state.phone,
                Captcha: this.state.captcha
            }, {}).then((data) => {
                if (data.Result == 1008) {
                    that.setState({error: '*手机号已绑定'});
                }
                else if (data.Result == 1004) {
                    that.setState({error: '*注册验证码失效'});
                }
                else if (data.Result == 1) {

                } else {
                    this.showError()
                }
                this.hideLoading(data.Result);
            }, (error) => {
                this.hideLoading(0);
                that.showError(error);
            }).catch((error) => {
                this.hideLoading(0);
                that.showError(error);
            })
        }
    }

    //点击更换手机号
    replace() {
        this.setState({bindPhoneStatus: ''});
        this.setState({editableInput: true});
        this.refs.replace.setNativeProps({
            style: {position: 'absolute', left: -1000}
        })
        this.refs.show.setNativeProps({
            style: {opacity: 1}
        })
    }

    render() {
        let Loading = this.Loading;
        return (
            <View style={{flex: 1, paddingHorizontal: 16}}>
                <EditView label="手机号" value={this.state.phone} editable={this.state.editableInput}
                          bindPhone={this.state.bindPhoneStatus} onChangeText={phone => this.setState({phone})}/>
                <TouchableOpacity style={{marginTop: 20, marginRight: 10}} onPress={() => this.replace()} ref='replace'>
                    <Text style={{fontSize: 14, color: '#3a66b3', textAlign: 'right'}}>更换手机号</Text>
                </TouchableOpacity>
                <View ref='show' style={{opacity: 0}}>
                    <EditView label="验证码" name="请输入验证码" getyzm={this.state.getCaptcha} disabled={this.state.disabled}
                              onChangeText={captcha => this.setState({captcha})} onPress={() => this.getCaptcha()}/>
                    <Text style={styles.errorMsg}>{this.state.error}</Text>
                    <LoginButton name="确定" onPress={() => this.replacePhone()} disabled={this.state.loading}/>
                </View>
                <Loading ref={(refLoading) => {
                    this.loading = refLoading
                }}></Loading>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    errorMsg: {
        color: 'red',
        fontSize: 12,
        marginVertical: 2,
        textAlign: 'center',
        height: 20
    }
})


export default BindPhone;