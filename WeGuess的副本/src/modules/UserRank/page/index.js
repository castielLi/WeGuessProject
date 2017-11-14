/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React  from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    Platform,
    Linking
} from 'react-native';
import {
    connect
} from 'react-redux';
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import {BackButton, BlankButton} from "../../Component/BackButton";

import ListViewPull from '../../TabRecommend/common/listViewPull';
import RankItem from '../../TabRecommend/common/rankItem';
import UserGuessItem from '../../TabRecommend/common/userGuessItem';

import {GetPublishBetByOpenID, GetMyPublishBet, GetMemberInfo, BuyBetRecord, PayUrl} from '../../Config/apiUrlConfig';
import method from '../../TabRecommend/common/method';

class UserRank extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        const {state, setParams} = navigation;
        const {params} = state;
        return {
            headerTitle: params.title ? params.title : "排行详情",
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
        let ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        const {params} = this.props.navigation.state;
        this.state = {
            DataSource: ds,
            isLoading: 1,//0：隐藏foot  1：已加载完成   2 ：加载中
            pageIndex: 1,
            userInfo: null,
            isInit: true
        };
        this.OpenID = params.OpenID;
        this.data = [];
        this.logged = {};
    }

    componentWillMount() {
        this.isLogged();
        let that = this;
        this.fetchData(true).then(() => {
            that.setState({isInit: false});
        }, (error) => {

            that.setState({isInit: false});
        }).catch(function (error) {

            that.setState({isInit: false});
        });
    }

    isLogged() {
        const {isLoggedIn, openID} = this.props.loginStore;
        if (openID === this.OpenID) {
            this.logged = {isLoggedIn, isSelf: true}
        }
        else {
            this.logged = {isLoggedIn}
        }
    }


    fetchData = (isRefresh) => {
        let pageIndex = 1;
        let url = GetPublishBetByOpenID;
        if (isRefresh) {
            this.setState({pageIndex: 1});
        } else {
            this.setState({isLoading: 2});
            pageIndex = this.state.pageIndex;
        }

        let params = {
            PageIndex: pageIndex,
            PageSize: 10,
            OpenID: this.OpenID,
        };
        if (this.logged.isSelf) {
            url = GetMyPublishBet;
            params = {
                PageIndex: pageIndex,
                PageSize: 10,
            }
        }
        let that = this;
        return new Promise((resolve, reject) => {
            this.networking.get(url, params, {}).then((responseData) => {
                let {Result, Data, UserRankInfo} = responseData;
                if (Result === 1) {
                    if (isRefresh) {
                        that.data = [];
                    }
                    if (!Data) {
                        that.setState({isLoading: 1});
                        return resolve();
                    }
                    // 拼接数据
                    that.data = that.data.concat(Data.Bets);

                    that.setState({
                        pageIndex: that.state.pageIndex + 1,
                        DataSource: that.state.DataSource.cloneWithRows(that.data),
                        userInfo: Data.UserRankInfo,
                    });

                    if (Data.Bets.length < 10) {
                        that.setState({isLoading: 1});
                    }
                    else {
                        that.setState({isLoading: 0});
                    }
                    resolve();
                } else {
                    that.setState({isLoading: 0});
                    that.showError(Result);
                    reject(Result);
                }
            }, (error) => {
                that.showError(error);
            }).catch((error) => {
                that.showError(error);

                throw error;
            })
        })
    };

    onPullRelease(resolve) {
        this.fetchData(true).then(() => {
            if (typeof resolve === "function") {
                resolve()
            }
        }, (error) => {
            if (typeof resolve === "function") {
                resolve()
            }
        }).catch(function (error) {
            if (typeof resolve === "function") {
                resolve()
            }
        });
    }

    loadMore() {
        if (this.state.isLoading !== 0) {
            return;
        }
        this.fetchData();
    }

    buyGuess(params, userData) {
        const {navigate} = this.props.navigation;
        let that = this;
        if (userData.Gold < params.Fee) {
            return (
                this.showAlert(
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        backgroundColor: '#f7f7f7'
                    }}>
                        <Text style={{color: '#3a66b3'}}>用户:{userData.Account}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../Resources/gold.png')} style={{height: 16, width: 16}}/>
                            <Text style={{color: '#3a66b3'}}>&nbsp;{method.numberFormat(userData.Gold)}</Text>
                        </View>
                    </View>,
                    <Text style={{textAlign: 'center', paddingVertical: 30, paddingHorizontal: 20}}>钻石余额不足</Text>,
                    this.goToVoucherCenter,
                    () => {
                    },
                    "立即充值"
                )
            )
        }
        this.networking.post(BuyBetRecord, params, {}).then((responseData) => {
            let {Result, Data} = responseData;
            if (Result === 1) {
                this.showAlert(
                    '提示',
                    <Text style={{textAlign: 'center', paddingVertical: 30, paddingHorizontal: 20}}>购买成功</Text>,
                    () => this.onPullRelease()
                )
            }
            else {
                this.showError(Result)
            }
        }, (error) => {
            this.showError(error)
        }).catch((error) => {
            that.showError(error);

        })
    }

    goToVoucherCenter = () => {
        this.props.navigation.navigate('VoucherCenter', {state: 0});
    }


    isShowAlert(isLogin, matchData) {
        const {navigate} = this.props.navigation;
        if (!isLogin) {
            this.showAlert(
                '提示',
                <Text style={{textAlign: 'center', paddingVertical: 30, paddingHorizontal: 20}}>用户未登录,是否立即登录？</Text>,
                () => navigate('Login'),
                () => {
                }
            );
            return;
        }
        let that = this;
        this.networking.get(GetMemberInfo, {}, {}).then((responseData) => {
            let {Result, Data} = responseData;
            if (Result === 1) {
                return this.showAlert(
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        backgroundColor: '#f7f7f7'
                    }}>
                        <Text style={{color: '#3a66b3'}}>用户:{Data.Account}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../Resources/gold.png')} style={{height: 16, width: 16}}/>
                            <Text style={{color: '#3a66b3'}}>&nbsp;{Data.Gold}</Text>
                        </View>
                    </View>,
                    <View>
                        <View style={{flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 5}}>
                            <Text style={{width: 50, fontSize: 12, lineHeight: 20}}>
                                {method.timeFormatTwo(matchData.Match.MatchTime, true)}
                            </Text>
                            <View style={{flex: 1, flexDirection: 'row', marginLeft: 10, alignItems: 'center'}}>
                                <Text
                                    style={{textAlign: 'left', flex: 1, fontSize: 14}}>{matchData.Match.HomeName}</Text>
                                <Text style={{textAlign: 'center', fontSize: 12}}> vs </Text>
                                <Text style={{
                                    textAlign: 'right',
                                    flex: 1,
                                    fontSize: 14
                                }}>{matchData.Match.AwayName}</Text>
                            </View>
                        </View>
                        <View style={{paddingVertical: 15}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{color: '#d80100'}}>查看需要</Text>
                                <Image source={require('../../Resources/gold.png')} style={{height: 16, width: 16}}/>
                                <Text style={{color: '#d80100'}}>&nbsp;{method.numberFormat(matchData.Fee)}</Text>
                            </View>
                        </View>
                    </View>,
                    () => this.buyGuess({
                        RecordID: matchData.RecordID,
                        BetID: matchData.BetID,
                        Fee: matchData.Fee,
                        ShareRate: matchData.ShareRate,
                        BuyWay: 1
                    }, Data),
                    () => {
                    },
                );
            } else {
                that.showError(Result);
            }
        }, (error) => {
            this.showError(error)
        }).catch((error) => {
            that.showError(error);

        })
    }

    confirmHaveBought(Item) {
        const {navigate} = this.props.navigation;
        let params = {
            RecordID: Item.RecordID,
            BetID: Item.BetID,
            Fee: Item.Fee,
            ShareRate: Item.ShareRate,
            BuyWay: 1
        };
        let that = this;

        this.networking.post(BuyBetRecord, params, {}).then(responseData => {
            let {Result, Data} = responseData;
            if (Result === 1) {
                navigate("SportMatch", {
                    matchId: Item.Match.MatchID,
                    marketId: Item.Bet.MarketID,
                    betPos: Item.Bet.betPos
                })
            }
            else {
                that.showError(Result);
            }
        }, (error) => {
            this.showError(error)
        }).catch((error) => {
            that.showError(error);

        });
    }

    RankItem(Item, sectionId, ItemId, highlightRow) {
        const {navigate} = this.props.navigation;
        return (
            <UserGuessItem
                data={Item}
                onCheck={() => this.isShowAlert(this.logged.isLoggedIn, Item)}
                isSelf={this.logged.isSelf}
                onJump={() => this.confirmHaveBought(Item)}
            />
        )
    }

    renderHeader() {
        let userInfo = this.state.userInfo;
        return (
            <RankItem data={userInfo}/>
        )
    }

    onButtonPress = () => {
        this.props.navigation.navigate("Login");
    }

    render() {
        let Alert = this.Alert;
        this.isLogged();
        return (
            <View style={styles.container}>
                {this.state.isInit ? (
                    <View style={styles.ai}>
                        <ActivityIndicator size="large" color="#3a66b3"/>
                    </View>
                ) : (
                    <ListViewPull
                        pageSize={10}
                        initialListSize={10}
                        onPullRelease={this.onPullRelease.bind(this)}
                        onEndReached={this.loadMore.bind(this)}
                        dataSource={this.state.DataSource}
                        renderRow={this.RankItem.bind(this)}
                        style={{backgroundColor: '#fff'}}
                        isLoading={this.state.isLoading}
                        renderHeader={() => this.renderHeader()}
                    />
                )}


                <Alert ref={(refAlert) => {
                    this.alert = refAlert
                }}/>
            </View>
        );

    }
}


const mapStateToProps = state => ({
    loginStore: state.loginStore
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UserRank);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    nodata: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    ai: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center'
    }
});