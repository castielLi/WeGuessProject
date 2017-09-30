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
    TouchableWithoutFeedback
} from 'react-native';
import {
    connect
} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../TokenManager/reducer/action';
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import LoginButton from '../../Component/LoginButton';
import EditView from '../../Component/EditView';
import {PostLoginUrl} from '../../Config/apiUrlConfig';
import {isPhone, checkPassword} from '../../Utils/check';
import TokenManager from '../../TokenManager';
import {StatusBar} from "../../Component/BackButton";

class Login extends ContainerComponent {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            password: '',
            error: '',   //错误提示信息
            loading: false
        };

        //初始化Token;
        this.tokenManager = TokenManager.getInstance();
    }


    //登录成功后，页面将直接跳转至testRefresh页面
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.loginStore.isLoggedIn != this.props.loginStore.isLoggedIn && nextProps.loginStore.isLoggedIn === true) {
            this.props.navigation.goBack();
            return false;
        }
        return true;
    }

    //登录
    onButtonPress() {
        //开始loading
        let phone = this.state.phoneNumber;
        let pwd = this.state.password;
        if (phone == "") {
            this.setState({error: '*请输入手机号'});
            this.hideLoading();
            return false;
        }
        if (!isPhone(phone)) {
            this.setState({error: '*手机号码格式错误'});
            return false;
        }
        if (pwd == "") {
            this.setState({error: '*请输入密码'});
            return false;
        }
        if (!checkPassword(pwd)) {
            this.setState({error: '*密码为8-20个字符（包含至少一个字母）'});
            return false;
        }
        //取消掉错误信息
        this.setState({error: ''});
        let that = this;  //调用this
        let params = {
            PhoneNumber: that.state.phoneNumber,
            Password: that.state.password
        }
        this.showLoading();
        this.networking.post(PostLoginUrl, params, {})
            .then(function (data) {
                let {Result, Data} = data;
                if (Result == 1) {
                    that.tokenManager.setToken(Data.Token, !Data.Tourist, Data.RefreshTime, Data.OpenID);
                    that.props.getMemberInfo();
                    that.hideLoading();
                    that.props.navigation.goBack();
                    return;
                } else {
                    that.hideLoading();
                    that.setState({
                        error: that.getErrorMsg(Result)
                    })
                }
            }, (error) => {

                that.hideLoading();
                that.showError(error);
            }).catch((error) => {

            that.hideLoading();
            that.showError(error);
        });

    }

    onTest = () => {
        if (typeof this.index == "undefined") {
            this.index = 0;
        }
        this.index += 1;
        if (this.index > 4 && this.state.phoneNumber == "......") {
            this.index = 0;
            this.props.navigation.navigate("Test");
        }
    }

    render() {

        const {navigate} = this.props.navigation;
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <StatusBar/>
                <View style={styles.padding}>
                    <View style={styles.list}>
                        <EditView label="手机号" name="请输入手机号" onChangeText={phoneNumber => this.setState({phoneNumber})}
                                  value={this.state.phoneNumber}/>
                        <EditView label="密码" name="请输入密码" onChangeText={password => this.setState({password})}
                                  secureTextEntry={true} value={this.state.password}/>
                    </View>
                    <View>
                        <Text style={styles.errorMsg}>{this.state.error}</Text>
                    </View>
                    <LoginButton name="登录" onPress={() => this.onButtonPress()} disabled={this.state.loading}/>
                    <View style={{marginTop: 20, flexDirection: 'row'}}>
                        <Text style={[styles.gn, {color: '#3a65b3'}]}
                              onPress={() => navigate('Register', {backKey: this.props.navigation.state.key})}>快速注册</Text>
                        <Text style={[styles.gn, {textAlign: 'right'}]}
                              onPress={() => navigate('ForgetPwd')}>忘记密码?</Text>
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: 'column-reverse'}}>
                    <TouchableWithoutFeedback onPress={this.onTest}>
                        <Image resizeMode='contain' source={require('../resources/logo-bottom.png')}
                               style={styles.loginIcon}/>
                    </TouchableWithoutFeedback>
                </View>
                <Loading ref={(refLoading) => {
                    this.loading = refLoading
                }}></Loading>
            </View>
        );

    }
}

const mapStateToProps = state => ({
    loginStore: state.loginStore
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

//样式
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
        height: 20,
        width: 100,
        alignSelf: 'center',
        marginBottom: 16,
    },
    gn: {
        flex: 1,
        fontSize: 14
    }
});