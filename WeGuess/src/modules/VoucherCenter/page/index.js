/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    Dimensions,
    ListView,
    ActivityIndicator,
    TouchableWithoutFeedback,
    TouchableHighlight,
    NativeModules,
    Platform
} from 'react-native';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from '../../TokenManager/reducer/action';

import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import {BackButton, BlankButton} from "../../Component/BackButton";
import {
    GetDiamondsUrl,
    GetPropListUrl,
    GetAwardListUrl,
    GetAwardEndTimeUrl,
    WebViewUrl,
    BuyDiamondUrl,
    BuyPropUrl,
    AddAwardRecordUrl,
    IsBindingPhoneUrl
} from '../../Config/apiUrlConfig';
import TabView from '../../Component/TabView';
import {numFormat} from '../../Utils/money';
import PayType from './enum';
import Icon from 'react-native-vector-icons/Ionicons';

var width = Dimensions.get('window').width;
var cellWidth = (width - 10 * 4) / 3;  //单个框的宽度
let WFTPay = NativeModules.WFTPay;

class VoucherCenter extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: "充值中心",
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
            dataSourceDiamonds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            dataSourceProp: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            dataSourceAward: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            getDiamonds: false,  //钻石充值加载状态
            getPropList: false,  //道具购买加载状态
            getAwardList: false,  //抽奖加载状态
            getAwardEndTime: ''   //获取抽奖截止时间
        }
        this.diamondsData = [];    //获取钻石数据
        this.propListData = [];    //获取道具数据
        this.awardListData = [];   //获取抽奖数据
        this.renderRow = this.renderRow.bind(this);
        this.tabList = ["钻石充值", "道具购买", "抽奖"];
        this.canPress = {
            Diamond: true,
            Prop: true,
            Award: true
        }
    }

    componentDidMount() {
        //钻石充值
        let state = this.props.navigation.state.params.state;
        if (state == 0) {
            this.refs.TabView.onPress(0)
        }
        if (state == 2) {
            this.refs.TabView.onPress(2)
        }
    }

    //主体内容
    content() {
        if (this.state.getDiamonds) {
            return (
                <View>
                    <ListView
                        contentContainerStyle={styles.listView}
                        dataSource={this.state.dataSourceDiamonds}
                        renderRow={this.renderRow}
                        ref={component => this._scrollView0 = component}
                    />
                    <Text
                        style={{color: '#b2b2b2', margin: 10, opacity: 0.8, fontSize: 12}}>*钻石仅用于购买增值服务和道具，不可提现。</Text>
                </View>

            )
        }
        if (this.state.getPropList) {
            return (
                <View>
                    <ListView
                        contentContainerStyle={styles.listView}
                        dataSource={this.state.dataSourceProp}
                        renderRow={this.renderRow}
                        ref={component => this._scrollView1 = component}
                    />
                    <Text style={{
                        color: '#b2b2b2',
                        margin: 10,
                        opacity: 0.8,
                        fontSize: 12
                    }}>*系统先充值钻石，然后再自动兑换虚拟道具，同时赠送猜豆，猜豆可参与竞猜娱乐活动。</Text>
                </View>
            )
        }
        if (this.state.getAwardList) {
            return (
                <View>
                    <View style={styles.tip}>
                        <Text style={{color: '#b2b2b2', flex: 1, opacity: 0.8}}>截止时间:{this.state.GetAwardEndTime}</Text>
                        <TouchableWithoutFeedback
                            onPress={() => this.showWebView(WebViewUrl.awardRule.url, WebViewUrl.awardRule.title)}>
                            <Image source={require('../resources/help.png')}
                                   style={{width: 20, height: 20}}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <ListView
                        contentContainerStyle={styles.listView}
                        dataSource={this.state.dataSourceAward}
                        renderRow={this.renderRow}
                        ref={component => this._scrollView2 = component}
                    />

                    {
                        Platform.OS == 'ios' ?
                            (
                                <View style={styles.tip}>
                                    <Text style={{color: '#b2b2b2', flex: 1, opacity: 0.8}}>本活动所包含内容，与苹果公司Apple
                                        lnc.无关。</Text>
                                </View>
                            ) : null
                    }
                </View>
            )
        }
        if (!this.state.getDiamonds && !this.state.getPropList && !this.state.getAwardList) {
            return (
                <ActivityIndicator size="large" color="#3a66b3"/>
            )
        }
    }

    //行数据
    renderRow(data, selectID, rowID) {
        if (this.state.getDiamonds) {
            return (
                <View>
                    <TouchableWithoutFeedback ID={data.ID} onPress={() => this.buyDiamond(data)}>
                        <View style={styles.listBtn}>
                            <Image source={require('../resources/diamonds.png')} style={styles.listImg}/>
                            <Text style={{marginTop: 5, fontSize: 14}}>{numFormat(data.Gold)}&nbsp;钻石</Text>
                            <View style={styles.listMoney}>
                                <Text style={{color: '#fff', fontSize: 12}}>¥&nbsp;{numFormat(data.Money)}</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )
        }
        if (this.state.getPropList) {
            return (
                <View>
                    <TouchableWithoutFeedback ID={data.PropID} onPress={() => this.buyProp(data)}>
                        <View style={styles.listBtn}>
                            <Image source={{uri: data.PictureURL}} style={styles.listImg}/>
                            <Text style={{marginTop: 10, fontSize: 14}}>{data.Name}</Text>
                            <Text style={{
                                marginTop: 5,
                                color: '#b2b2b2',
                                fontSize: 10
                            }}>赠送{numFormat(data.Bean)}猜豆</Text>
                            <View style={styles.listMoney}>
                                <Text style={{color: '#fff', fontSize: 12}}>¥&nbsp;{data.Money}元</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )
        }
        if (this.state.getAwardList) {
            return (
                <View>
                    <TouchableWithoutFeedback ID={data.AwardID} onPress={() => this.isBindingPhone(data)}>
                        <View style={styles.listBtn}>
                            <Image source={{uri: data.PictureURL}} style={styles.listImg}/>
                            <Text style={{marginTop: 10, fontSize: 14}}>{data.Name}</Text>
                            <Text style={{marginTop: 5, color: '#b2b2b2', fontSize: 10}}>&nbsp;
                                还剩{parseInt(data.Count - data.SendCount)}&nbsp;份</Text>
                            <View style={styles.listMoney}>
                                <Text style={{color: '#fff', fontSize: 10}}>{numFormat(data.Bean)}猜豆</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )
        }
    }

    //支付
    Pay = (token, money, bean) => {
        let that = this
        that.showAlert(
            (<View style={[styles.alertTitle]}>
                <Text style={{textAlign: 'left'}}>支付方式</Text>
                <TouchableWithoutFeedback onPress={() => {
                    that.alert.Ok()
                }}>
                    <View style={[styles.titleCancel]}>
                        <Image source={require('../resources/cancel.png')} style={[styles.titleCancelImg]}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>),
            (
                <View style={[styles.alertContent]}>
                    <View style={[styles.alertMoney]}>
                        <Text style={[styles.money]}>支付金额：¥ {money}</Text>{bean ? (
                        <Text style={[styles.bean]}>赠送{numFormat(bean)}猜豆</Text>) : null}
                    </View>
                    {
                        this.props.loginStore.isPay ? (
                            <TouchableWithoutFeedback style={styles.userListLi} onPress={() => {
                                that.WFTPay(0, token)
                            }}>
                                <View style={[styles.payType]}>
                                    <View style={[styles.payItem]}>
                                        <Image source={require('../resources/zhifubao.png')} style={styles.listIcon}/>
                                        <Text style={[styles.customFont]}>支付宝支付</Text>
                                    </View>
                                    <Icon name="ios-arrow-forward" color="#cbcbcb" size={24}/>
                                </View>
                            </TouchableWithoutFeedback>
                        ) : (
                            <TouchableWithoutFeedback style={styles.userListLi} onPress={() => {
                                that.WFTPay(1,"", money)
                            }}>
                                <View style={[styles.payType]}>
                                    <View style={[styles.payItem]}>
                                        <Image source={require('../resources/applepay.png')} style={styles.listIcon}/>
                                        <Text style={[styles.customFont]}>Apple Pay</Text>
                                    </View>
                                    <Icon name="ios-arrow-forward" color="#cbcbcb" size={24}/>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    }

                </View>), false, null
        )
    }

    WFTPay = (type, token,money) => {
        let that = this;
        that.alert.BackInit(() => {
            if (type === 0) {
                WFTPay.pay(token, () => {
                    that.props.getMemberInfo();
                })
            } else if(type===1) {
                WFTPay.pay(token, () => {
                    that.props.getMemberInfo();
                })
            }
        });
    }

    //点击进行钻石充值
    buyDiamond(data) {
        if (!this.canPress.Diamond) {
            return;
        }
        this.canPress.Diamond = false;
        this.showLoading(() => {
            let that = this;
            let params = {
                id: data.ID,
                payAmount: data.Money,
                payPlatform: 1,
                payType: PayType.APP,
                productName: "虚拟钻石",
                osType: Platform.OS == 'ios' ? 1 : 0
            }
            this.networking.post(BuyDiamondUrl, params, {}).then(function (response) {
                that.canPress.Diamond = true;
                let {Result, Data} = response;
                that.hideLoading(() => {
                    if (Result == 1) {
                        that.Pay(Data, data.Money);
                    } else {
                        that.showError(Result);
                    }
                });
            }, (error) => {
                that.canPress.Diamond = true;
                that.hideLoading(() => {
                    that.showError(error);
                });
            }).catch((error) => {
                that.canPress.Diamond = true;
                that.hideLoading(() => {
                    that.showError(error);
                });
            });
        });


    }

    //点击进行道具购买
    buyProp(data) {
        if (!this.canPress.Prop) {
            return;
        }
        this.canPress.Prop = false;
        this.showLoading(() => {
            let that = this;
            let params = {
                propID: data.PropID,
                payAmount: data.Money,
                payPlatform: 1,
                payType: PayType.APP,
                productName: "虚拟钻石",
                osType: Platform.OS == 'ios' ? 1 : 0,
            }
            this.networking.post(BuyPropUrl, params, {}).then(function (response) {
                let {Result, Data} = response;
                that.canPress.Prop = true;
                that.hideLoading(() => {
                    if (Result == 1) {
                        that.Pay(Data, data.Money, data.Bean);
                    } else {
                        that.showError(Result);
                    }
                });
            }, (error) => {
                that.canPress.Diamond = true;
                that.hideLoading(() => {
                    that.showError(error);
                });
            }).catch((error) => {
                that.canPress.Diamond = true;
                that.hideLoading(() => {
                    that.showError(error);
                });
            });
        });
    }

    //点击进行抽奖
    isBindingPhone(data) {
        if (!this.canPress.Award) {
            return;
        }
        this.canPress.Award = false;
        this.showLoading(() => {
            let that = this;
            let PictureURL = data.PictureURL;
            let Name = data.Name;
            let Bean = data.Bean;
            this.networking.get(IsBindingPhoneUrl, null, {}).then(function (response) {
                let {Result} = response;
                that.canPress.Award = true;
                if (Result == 1) {
                    that.hideLoading(() => {
                        that.showAlert(
                            '提示',
                            <View style={{alignItems: 'center'}}>
                                <Image source={{uri: PictureURL}} style={styles.listImg}/>
                                <Text style={{margin: 10, fontSize: 14}}>{Name}</Text>
                                <Text style={{color: '#999'}}>抽取该项奖品需要猜豆<Text
                                    style={{color: 'orange'}}>{numFormat(Bean)}</Text></Text>
                                <Text style={{color: '#999', fontSize: 14, marginVertical: 5}}>是否进行抽奖</Text>
                            </View>,
                            () => {
                                that.addAwardRecord(data)
                            },
                            () => {
                            }
                        )
                    });
                    return false;
                } else {
                    that.hideLoading(() => {
                        that.showError(Result);
                    });
                }
            }, (error) => {
                that.canPress.Diamond = true;
                that.hideLoading(() => {
                    that.showError(error);
                });
            }).catch((error) => {
                that.canPress.Diamond = true;
                that.hideLoading(() => {
                    that.showError(error);
                });
            });
        });

    }

    addAwardRecord(data) {
        let that = this;
        that.hideLoading(() => {
            let params = {
                awardID: data.AwardID,
                bean: data.Bean,
            };
            let PictureURL = data.PictureURL;
            let Name = data.Name;
            this.networking.get(AddAwardRecordUrl, params, {}).then(function (data) {
                that.hideLoading(() => {
                    if (data.Result == 1) {
                        that.showAlert(
                            <View style={{alignItems: 'center', paddingVertical: 10, backgroundColor: '#f7f7f7'}}>
                                <Text style={{textAlign: 'center', color: 'red'}}>恭喜您,获得奖品!</Text>
                                <TouchableHighlight
                                    style={{width: 15, height: 15, position: 'absolute', right: 10, top: 10}}
                                    onPress={() => that.alert.Ok()}>
                                    <Image source={require('../resources/cancel.png')}
                                           style={{width: 15, height: 15, opacity: 0.6}}/>
                                </TouchableHighlight>
                            </View>,
                            <View style={{alignItems: 'center', padding: 30}}>
                                <Image source={{uri: PictureURL}} style={styles.listImg}/>
                                <Text style={{margin: 10, fontSize: 14}}>{Name}</Text>
                                <Text style={{color: 'red'}}>恭喜您,成功抽到奖品!</Text>
                                <Text style={{margin: 10, color: 'red'}}>稍后会有工作人员与您联系并派发奖品.</Text>
                                <Text style={{color: 'red'}}>请耐心等待.</Text>
                            </View>, false,
                        )
                        that.getAwardList();
                    }
                    else if (data.Result == 1102) {
                        that.showAlert(
                            '猜豆不足',
                            <View style={{alignItems: 'center', padding: 30}}>
                                <Text style={{fontSize: 14}}>很抱歉,您的猜豆余额不足,</Text>
                                <Text style={{marginTop: 15, fontSize: 14}}>可以通过以下方式获取猜豆.</Text>
                            </View>,
                            () => {
                                that.refs.TabView.onPress(1)
                            },
                            () => {
                                that.props.navigation.navigate('TabAction')
                            },
                            "购买道具",
                            "参与活动"
                        )
                    } else {
                        that.showError(Result);
                    }
                });
            }, (error) => {
                that.canPress.Diamond = true;
                that.hideLoading(() => {
                    that.showError(error);
                });
            }).catch((error) => {
                that.canPress.Diamond = true;
                that.hideLoading(() => {
                    that.showError(error);
                });
            });
        })

    }

    //选择钻石充值板块
    getDiamonds() {
        let that = this;
        this.setState({
            getDiamonds: true,
            getPropList: false,
            getAwardList: false,
        })
        this.networking.get(GetDiamondsUrl, null, {}).then((data) => {
            let {Result, Data} = data;
            if (Result == 1) {
                this.diamondsData = Data;
                that.setState({
                    dataSourceDiamonds: this.state.dataSourceDiamonds.cloneWithRows(this.diamondsData),
                })
            } else {
                that.showError(Result);
            }
        }, (error) => {
            that.showError(error);
        }).catch(() => {
            that.showError(error);
        })
    }

    //选择道具购买板块
    getPropList() {
        let that = this;
        this.setState({
            getDiamonds: false,
            getPropList: true,
            getAwardList: false,
        })
        this.networking.get(GetPropListUrl, null, {}).then((data) => {
            let {Result, Data} = data;
            if (Result == 1) {
                this.propListData = Data;
                that.setState({
                    dataSourceProp: this.state.dataSourceProp.cloneWithRows(this.propListData),
                })
            } else {
                that.showError(Result);
            }
        }, (error) => {

            that.showError(error);
        }).catch(() => {
            that.showError(error);
        })
    }

    //选择抽奖板块
    getAwardList() {
        let that = this;
        this.setState({
            getDiamonds: false,
            getPropList: false,
            getAwardList: true,
        })
        this.networking.get(GetAwardListUrl, null, {}).then((data) => {
            let {Result, Data} = data;
            if (Result == 1) {
                this.awardListData = Data;
                that.setState({
                    dataSourceAward: this.state.dataSourceAward.cloneWithRows(this.awardListData),
                })
            } else {
                that.showError(Result);
            }
        }, (error) => {

            that.showError(error);
        }).catch(() => {
            that.showError(error);
        })
        this.networking.get(GetAwardEndTimeUrl, null, {}).then((data) => {
            let {Result, Data} = data;
            if (Result == 1) {
                that.setState({
                    GetAwardEndTime: Data,
                })
            } else {
                that.showError(Result);
            }
        }, (error) => {

            that.showError(error);
        }).catch((error) => {
            that.showError(error);
        })
    }

    changeType = (index) => {
        if (index === 0) {
            this.getDiamonds();
            if (this._scrollView0) {
                setTimeout(() => {
                    this._scrollView0.scrollTo({y: 0});
                }, 100)
            }
        } else if (index === 1) {
            this.getPropList();
            if (this._scrollView1) {
                setTimeout(() => {
                    this._scrollView1.scrollTo({y: 0});
                }, 100)
            }
        } else {
            this.getAwardList();
            if (this._scrollView2) {
                setTimeout(() => {
                    this._scrollView2.scrollTo({y: 0});
                }, 100)
            }
        }
    }

    render() {
        let Alert = this.Alert;
        let Loading = this.Loading;
        let WebView = this.WebView;
        return (
            <View style={{flex: 1}}>
                <TabView tabList={this.tabList} onPress={this.changeType} ref='TabView'></TabView>
                <ScrollView>{this.content()}</ScrollView>
                <Alert ref={(refAlert) => {
                    this.alert = refAlert
                }}></Alert>
                <Loading ref={(refLoading) => {
                    this.loading = refLoading
                }}></Loading>
                <WebView ref={(refWebView) => {
                    this.webview = refWebView
                }}></WebView>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    topUl: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    topLi: {
        textAlign: 'center',
        color: '#b2b2b2',
        fontSize: 15,
        paddingVertical: 12,
        width: 80,
        height: 45,
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
    },
    listView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    listBtn: {
        width: cellWidth,
        marginVertical: 10,
        marginLeft: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#dedede',
        alignItems: 'center'
    },
    listImg: {
        width: 70,
        height: 60,
        marginTop: 10
    },
    listMoney: {
        height: 27,
        width: cellWidth - 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3a66b3',
        borderRadius: 5,
        marginVertical: 5
    },
    customFont: {
        fontSize: 16
    },
    listIcon: {
        width: 24,
        height: 24,
        marginRight: 10
    },
    alertMoney: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        paddingLeft: 8,
        paddingRight: 8,
    },
    money: {
        color: "#3a66b3",
        fontSize: 18
    },
    bean: {
        color: "#bbbbbb",
        fontSize: 14
    },
    alertTitle: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f7f7f7',
        paddingLeft: 8,
    },
    titleCancel: {
        width: 32,
        height: 40,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleCancelImg: {
        width: 15,
        height: 15,
        opacity: 0.6

    },
    alertContent: {
        flexDirection: 'column',
    },
    payType: {
        borderTopWidth: 1,
        borderTopColor: "#eeeeee",
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 8
    },
    payItem: {
        flex: 1,
        flexDirection: 'row',
        height: 56,
        alignItems: 'center'
    },
    tip: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
        marginRight: 24
    }
})

const mapStateToProps = (state) => ({
    loginStore: state.loginStore
});
const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(VoucherCenter);