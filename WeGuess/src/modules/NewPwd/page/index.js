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
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import LoginButton from '../../Component/LoginButton';
import EditView from '../../Component/EditView';
import {ResetPasswordUrl} from '../../Config/apiUrlConfig';
import {checkPassword} from '../../Utils/check';
import {StatusBar} from "../../Component/BackButton";

class NewPwd extends ContainerComponent {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            newPwd: '',
            surePwd: '',
            error: '',
            loading: false
        };
    }

    updatePwd() {
        var newPwd = this.state.newPwd;
        var surePwd = this.state.surePwd;

        if (newPwd == "") {
            this.setState({error: '*请输入密码'});
            return false;
        }
        if (!checkPassword(newPwd)) {
            this.setState({error: '*密码为8-20个字符（包含至少一个字母）'});
            return false;
        }
        if (surePwd == "") {
            this.setState({error: '*请再次输入密码'});
            return false;
        }
        if (surePwd != newPwd) {
            this.setState({error: '*两次输入密码不统一'});
            return false;
        }
        //取消掉错误信息
        this.setState({error: ''});

        let that = this;
        let keyPwd = this.props.navigation.state.params.keyPwd;
        this.showLoading();
        this.networking.post(ResetPasswordUrl, {NewPassword: this.state.newPwd, Key: keyPwd})
            .then((data) => {
                that.hideLoading();
                if (data.Result == 1) {
                    this.showAlert("提示", "修改密码成功", () => {
                        that.props.navigation.goBack(that.props.navigation.state.params.loginKey);
                    }, null)
                } else {
                    that.showError(data.Result);
                }
            }, (error) => {
                that.hideLoading();

                that.showError(error);
            }).catch((error) => {

            that.hideLoading();
            that.showError(error);

        });

    }

    render() {
        let Loading = this.Loading;
        let Alert = this.Alert;
        return (
            <View style={styles.container}>
                <StatusBar/>
                <View style={styles.list}>
                    <EditView label="新密码" name="请输入您的密码" onChangeText={newPwd => this.setState({newPwd})}
                              secureTextEntry={true}/>
                    <EditView label="确认密码" name="请重复您的新密码" onChangeText={surePwd => this.setState({surePwd})}
                              secureTextEntry={true}/>
                </View>
                <View>
                    <Text style={styles.errormsg}>{this.state.error}</Text>
                </View>
                <LoginButton name="确定" onPress={() => this.updatePwd()} disabled={this.state.loading}/>
                <View style={{flex: 1, flexDirection: 'column-reverse'}}>
                    <Image resizeMode='contain' source={require('../resources/logo-bottom.png')}
                           style={styles.loginIcon}/>
                </View>
                <Loading ref={(refLoading) => {
                    this.loading = refLoading
                }}></Loading>
                <Alert ref={(refAlert) => {
                    this.alert = refAlert
                }}></Alert>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
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

export default NewPwd;