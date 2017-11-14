/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    TouchableWithoutFeedback,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import TokenManager from '../../TokenManager';
import Icon from 'react-native-vector-icons/Ionicons';
import {numFormat} from "../../Utils/money";
import {StatusBar} from "../../Component/BackButton";
import {WebViewUrl} from "../../Config/apiUrlConfig";

class Me extends ContainerComponent {

    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    };

    constructor(props) {
        super(props);
        //获取单例Token;
        this.tokenManager = TokenManager.getInstance();
    }

    loginOut = () => {
        this.showLogout(() => {
            this.tokenManager.clearToken();
            this.props.navigation.navigate("Login");
        })
    }

    tabGo = (route, params, isNeedLogin = true) => {
        if (isNeedLogin) {
            if (this.props.loginStore.isLoggedIn) {
                this.props.navigation.navigate(route, params)
            } else {
                this.props.navigation.navigate("Login")
            }
        } else {
            this.props.navigation.navigate(route, params)
        }
    }

    showWebViewTabMe = (index) => {
        if (index == 0) {
            this.showWebView(WebViewUrl.userAgreement.url, WebViewUrl.userAgreement.title);
        } else {
            this.showWebView(WebViewUrl.winBean.url, WebViewUrl.winBean.title);
        }

    }

    renderUserMsg() {
        if (this.props.loginStore.isLoggedIn) {
            return (
                <View style={styles.userTop}>
                    <TouchableWithoutFeedback style={styles.userImg}>
                        {
                            this.props.loginStore.headImageUrl ? (
                                <Image source={{uri: this.props.loginStore.headImageUrl}}
                                       style={{width: 60, height: 60, borderRadius: 7}}/>) : (
                                <Image source={require('../../Resources/head.png')}
                                       style={{width: 60, height: 60, borderRadius: 7}}/>)
                        }
                    </TouchableWithoutFeedback>
                    <View style={styles.userInfo}>
                        <Text style={{fontSize: 16, color: '#333'}}>
                            <Text>{this.props.loginStore.nickname}</Text>
                            <Text style={{
                                fontSize: 14,
                                color: '#818181',
                                paddingLeft: 5
                            }}>(账号:{this.props.loginStore.account})</Text>
                        </Text>
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <Image source={require('../../Resources/gold.png')}
                                       style={{width: 18, height: 18, marginRight: 5}}/>
                                <Text>钻石:<Text style={{color: '#fd5d07'}}>{numFormat(this.props.loginStore.gold)}</Text></Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <Image source={require('../../Resources/bean.png')}
                                       style={{width: 18, height: 18, marginRight: 5}}/>
                                <Text>猜豆:<Text style={{color: '#fd5d07'}}>{numFormat(this.props.loginStore.bean)}</Text></Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.userTop}>
                    <TouchableWithoutFeedback style={styles.userImg}>
                        <Image source={require('../../Resources/head.png')}
                               style={{width: 60, height: 60, borderRadius: 7}}/>
                    </TouchableWithoutFeedback>
                    <View style={styles.noLogin}>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate("Login")}>
                            <View>
                                <Text style={{fontSize: 16, color: '#3a66b3'}}>
                                    立即登录
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            )
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        let WebView = this.WebView;
        let Alert = this.Alert;
        return (
            <View style={this.style.container}>
                <StatusBar/>
                <ScrollView style={[{flex: 1}]}>

                    {this.renderUserMsg()}

                    <View style={styles.userList}>
                        <TouchableWithoutFeedback onPress={() => this.tabGo("VoucherCenter", {state: 0})}>
                            <View style={styles.userListLi}>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <Image source={require('../resources/charge.png')} style={styles.listIcon}/>
                                    <Text style={[styles.customFont]}>充值中心</Text>
                                </View>
                                <Icon name="ios-arrow-forward" color="#cbcbcb" size={24}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.tabGo("VoucherCenter", {state: 2})}>
                            <View style={styles.userListLi}>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <Image source={require('../resources/lottery.png')} style={styles.listIcon}/>
                                    <Text style={[styles.customFont]}>抽奖中心</Text>
                                </View>
                                <Icon name="ios-arrow-forward" color="#cbcbcb" size={24}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.tabGo("MoneyRecord", {})}>
                            <View style={styles.userListLi}>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <Image source={require('../resources/moneyrecord.png')} style={styles.listIcon}/>
                                    <Text style={[styles.customFont]}>账目明细</Text>
                                </View>
                                <Icon name="ios-arrow-forward" color="#cbcbcb" size={24}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.tabGo("BuyRecommend", {})}>
                            <View style={styles.userListLi}>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <Image source={require('../resources/buyrecommend.png')} style={styles.listIcon}/>
                                    <Text style={[styles.customFont]}>购买推荐</Text>
                                </View>
                                <Icon name="ios-arrow-forward" color="#cbcbcb" size={24}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.tabGo("UserRank", {
                            OpenID: this.props.loginStore.openID,
                            title: "我的发布"
                        })}>
                            <View style={styles.userListLi}>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <Image source={require('../resources/mypublish.png')} style={styles.listIcon}/>
                                    <Text style={{fontSize: 14}}>我的发布</Text>
                                </View>
                                <Icon name="ios-arrow-forward" color="#cbcbcb" size={24}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.tabGo("BindPhone", {state: 2})}>
                            <View style={styles.userListLi}>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <Image source={require('../resources/bindphone.png')} style={styles.listIcon}/>
                                    <Text style={{fontSize: 14}}>绑定手机号</Text>
                                </View>
                                <Icon name="ios-arrow-forward" color="#cbcbcb" size={24}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.showWebViewTabMe(0)}>
                            <View style={styles.userListLi}>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <Image source={require('../resources/argument.png')} style={styles.listIcon}/>
                                    <Text style={{fontSize: 14}}>用户协议</Text>
                                </View>
                                <Icon name="ios-arrow-forward" color="#cbcbcb" size={24}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.showWebViewTabMe(1)}>
                            <View style={[styles.userListLi, {borderBottomWidth: 0}]}>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <Image source={require('../resources/winbean.png')} style={styles.listIcon}/>
                                    <Text style={{fontSize: 14}}>如何获取猜豆</Text>
                                </View>
                                <Icon name="ios-arrow-forward" color="#cbcbcb" size={24}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                    <TouchableWithoutFeedback onPress={this.loginOut}>
                        <View style={styles.buttonView}>
                            {this.props.loginStore.isLoggedIn ? (
                                <Text style={styles.button}>退出登录</Text>
                            ) : null}
                        </View>
                    </TouchableWithoutFeedback>
                    <WebView ref={(refWebView) => {
                        this.webview = refWebView
                    }}></WebView>
                    <Alert ref={(refAlert) => {
                        this.alert = refAlert
                    }}></Alert>
                </ScrollView>
            </View>

        )
    }
}

const mapStateToProps = state => ({
    loginStore: state.loginStore
});


export default connect(mapStateToProps)(Me);

const styles = StyleSheet.create({
    customFont: {
        fontSize: 14
    },
    userTop: {
        marginVertical: 6,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16
    },
    noLogin: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userImg: {
        marginHorizontal: 10,
    },
    userInfo: {
        flex: 1,
        paddingLeft: 20,
    },
    userList: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc'
    },
    userListLi: {
        marginLeft: 16,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#b2b2b2',
        paddingRight: 16
    },
    listIcon: {
        width: 18,
        height: 18,
        marginRight: 10
    },
    listGt: {
        flex: 1,
        textAlign: 'right',
        fontSize: 18
    },
    buttonView: {
        margin: 16,
        backgroundColor: "#d90000",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    button: {
        color: "#ffffff",
        marginTop: 12,
        marginBottom: 12,
        fontSize: 16
    }
})