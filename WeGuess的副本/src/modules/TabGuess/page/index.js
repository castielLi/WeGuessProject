/**
 * Created by maple on 2017/08/03.
 */
/**
 * Created by apple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Button,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Dimensions,
    Platform,
    ScrollView,
    Alert,
    Linking
} from 'react-native';
import {
    connect
} from 'react-redux';
import ContainerComponent from '../../.././Core/Component/ContainerComponent'
import {
    GetBalance,
    GetMixBet,
    BetMix,
    PublishBet,
    GetBet,
    Bet
} from '../../Config/apiUrlConfig';
import config from '../../Utils/sportConfig';
import HandleData from '../../Utils/sportHandle';
import Screen from '../method/index';
import TabView from '../../Component/TabView';
import Headers from '../component/header'
import TimeItem from '../component/timeitem';
import MatchItem from '../component/matchitem';
import Live from '../component/live';
import Mix from '../component/mix';
import GameType from '../component/gameType';
import BetPanel from '../../SportBet/betPane';
import BetSuccess from '../../SportBet/betSuccess';
import BetFail from '../../SportBet/betFail';
import {StatusBar} from "../../Component/BackButton";
import {bindActionCreators} from "redux";
import AppUpdate from '../../AppUpdate/page/index';
import * as Actions from '../reducer/action';
import * as ActionsBean from '../../TokenManager/reducer/action';
import Notice from '../../Notice/components/notice';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const type = { //头部tab切换 按时间 按联赛 滚球 串关
    time: 1,
    league: 2,
    live: 3,
    mix: 4,
}

class Guess extends ContainerComponent {

    static navigationOptions = ({navigation}) => {
        return {
            header: null //隐藏navigation
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            sportId: 1,
            type: 1, //按时间，按联赛，滚球，串关
            balance: 0, //猜豆数目
            showGameType: false,
            isShowBet: false,
            isBetSuccess: false,
            isBetFail: false,
            betInfo: [],//投注信息
            betParams: [],//投注参数
            isMix: false,
            betResult: [],//投注结果
            errorMsg: "",
            hideBetMsg: false,
            betlist: [],
            removeIndex: "",
        }
        this.tabList = ["按日期", "按联赛", "滚球", "串关"];
        this.getBalance = this.getBalance.bind(this);
    }

    onPress = (statusId) => {
        this.setState({
            type: statusId - 0 + 1
        });
    }

    closeBetPanel = () => {
        this.setState({
            isShowBet: false,
        })
    }
    closeBetSuccessPanel = () => {
        this.setState({
            isBetSuccess: false,
        })
    }
    closeBetFailPanel = () => {
        this.setState({
            isBetFail: false,
        })
    }
    goRank = () => {
        if (this.props.loginStore.isLoggedIn) {
            this.props.navigation.navigate("SportRank");
        } else {
            this.showLogin(() => this.props.navigation.navigate("Login"));
            return;
        }

    }
    goBetList = () => {
        if (this.props.loginStore.isLoggedIn) {
            this.props.navigation.navigate("SportBetList");
        } else {
            this.showLogin(() => this.props.navigation.navigate("Login"));
            return;
        }

    }

    getBalance() {
        let params = {};
        this.networking.get(GetBalance, params, {}).then((responseData) => {
            if (!responseData.Data) {
                this.setState({
                    balance: 0
                })
                return;
            }
            this.setState({
                balance: Math.round(responseData.Data)
            })
        }).catch((error) => {

        })
    }

    //移除比赛
    removeMatch = (indexMatchid) => {
        let index = indexMatchid.split("-")[0];
        let {betInfo} = this.state;
        let {TicketList} = this.state.betInfo;
        TicketList.splice(index, 1);
        betInfo.TicketList = TicketList;
        this.setState({
            removeIndex: indexMatchid,
            betInfo: betInfo,

        })
        if (TicketList.length <= 1) {
            this.setState({
                isShowBet: false,
                hideBetMsg: false,
            })
        }
    }
    //请求投注 type:{true:串关，false:普通投注}
    initBet = (type, parma) => {
        this.setState({
            hideBetMsg: false,
        })
        const {navigate} = this.props.navigation;
        if (this.props.loginStore.isLoggedIn) {

        } else {
            this.showLogin(() => navigate('Login'));
            return;
        }
        this.setState({
            isMix: type,
        })
        if (this.props.loginStore.isLoggedIn) {

        } else {
            this.showLogin(() => navigate('Login'));
            return;
        }
        this.showLoading();
        this.getBalance();
        var that = this;

        if (type) {//串关投注
            this.networking.get(GetMixBet, parma, {}).then((responseData) => {
                this.hideLoading();
                let data = responseData;
                switch (data.RequestBetError) {
                    case config.RequestBetError.Success:
                    case config.RequestBetError.OddChange:
                    case config.RequestBetError.OutLeveChanged:
                        if (data.RequestBetError == 1) {
                            //odds变化
                            this.showAlert("提示", "赔率变化为" + data.Data.MixTotalOdds);
                        }
                        if (data.Data) {
                            this.setState({
                                isShowBet: true,
                                betInfo: data.Data
                            })
                        }
                        break;
                    case config.RequestBetError.TicketError:
                    case config.RequestBetError.LimitError:
                    case config.RequestBetError.SystemError:
                    case config.RequestBetError.OverLimit:
                    case config.RequestBetError.MixParamNotFind:
                    case config.RequestBetError.NeedLogin:


                        this.showAlert("提示", "请求串关注单失败,请重试或者刷新页面.");
                        break;

                }
            }).catch((err) => {
                this.hideLoading();
                this.showAlert("提示", "请求串关注单失败,请重试或者刷新页面.");

            });
        } else {
            this.networking.get(GetBet, parma).then((data) => {
                this.hideLoading();
                switch (data.RequestBetError) {
                    case config.RequestBetError.Success:
                    case config.RequestBetError.OddChange:
                    case config.RequestBetError.OutLeveChanged:
                        if (data.RequestBetError == 1) {
                            //odds变化
                            this.showAlert("提示", "赔率已从{OldOdds}变化为{NewOdds}".format(data.Data.Ticket));
                            // w.vbus.$emit("ShowToast", "赔率已从{OldOdds}变化为{NewOdds}".format(data.Data.Ticket), 2000);
                        }
                        if (data.Data) {
                            this.setState({
                                isShowBet: true,
                                betInfo: data.Data
                            })
                        }
                        break;
                    case config.RequestBetError.TicketError:
                    case config.RequestBetError.LimitError:
                    case config.RequestBetError.SystemError:
                    case config.RequestBetError.OverLimit:
                    case config.RequestBetError.MixParamNotFind:
                    case config.RequestBetError.NeedLogin:

                        this.showAlert("提示", "请求串关注单失败,请重试或者刷新页面.");
                        break;
                }

            }).catch((err) => {
                this.hideLoading();
                this.showAlert("提示", "请求串关注单失败,请重试或者刷新页面.");

            });
        }
    }
    MarketName = (m) => {
        return config.MarketName[m.MarketID] || m.MarketName;
    }
    showHDP = (hdp, pos, market) => {
        if (market <= 2 && market >= 1) {
            return (hdp < 0 ? "-" : "+") + HandleData.ComputeHDP(hdp);
        }
        if (market <= 4 && market >= 3) {
            return HandleData.ComputeHDP(hdp);
        }
        return "";
    }
    //提交投注 混合过关 滚球
    SubmitBet = (params) => {

        this.setState({
            betParams: params,
            isShowBet: false,
        })
        //显示loading;
        this.showLoading();
        let that = this;
        if (this.state.isMix) { //混合投注;
            this.networking.post(BetMix, params, {}).then((data) => {
                that.hideLoading();
                if (data.Data != null) {
                    let {BetID, SubBets, BetValue, BackAmount} = data.Data;

                    if (data.BetResult === 0) {
                        that.props.getMemberInfo();
                        that.showAlert("投注成功", (<View style={{maxHeight: 300,}}><ScrollView>{
                            SubBets.map((match, index) => {
                                return (
                                    <View style={styles.detail} key={index}>
                                        <View style={styles.league}><Text
                                            style={styles.leagueText}>{match.Stage == 3 ? "滚球" : "赛前"}.{this.MarketName(match)}:{match.BetPosName} {this.showHDP(match.Hdp, match.BetPos, match.MarketID)}</Text></View>
                                        <View style={styles.team}><Text>{match.HomeName}
                                            vs {match.AwayName}</Text><Text>{match.LeagueName}@{match.ReportDate}</Text></View>
                                        <View style={styles.bets}>
                                            <View style={styles.betBean}>
                                                <Text>投注猜豆:</Text><Text style={{color: "#ff5b06"}}>{(BetValue)}</Text>

                                            </View>
                                            <View style={styles.getBean}>
                                                <Text>预计返还:</Text><Text
                                                style={{color: "#ff5b06"}}>{Math.round(BackAmount)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }</ScrollView></View>), () => {
                        });
                        that.setState({
                            hideBetMsg: true,
                            betParams: null,
                        })


                    }
                }
                else if (data.BetResult === 2 || data.BetResult === 3) {
                    that.showAlert("提示", "串关赔率已变化");
                } else {
                    that.showAlert("提示", data.ErrorMsg, () => {
                        that.props.navigation.navigate("VoucherCenter", {state: 0});
                    }, () => {
                        that.props.navigation.navigate("TabAction", {state: 0});
                    }, "立即充值", "参与活动")
                }

            }).catch((err) => {
                that.getBalance();
                that.hideLoading();


            })
        } else {
            //滚球投足
            this.showLoading();
            this.setState({
                isShowBet: false
            });
            this.networking.post(Bet, params, {}).then((responseData) => {
                this.hideLoading();
                that.setState.selectBetitem = "";
                let data = responseData;

                //投注成功
                if (data.BetResult === 0) {
                    that.props.getMemberInfo();
                    if (data.Data != null) {
                        let {BetID, SubBets, BetValue, BackAmount} = data.Data;
                        that.showAlert("投注成功", (<View>{
                            SubBets.map((match, index) => {
                                return (
                                    <View style={styles.detail} key={index}>
                                        <View style={styles.league}><Text
                                            style={styles.leagueText}>{match.Stage == 3 ? "滚球" : "赛前"}.{this.MarketName(match)}:{match.BetPosName} {this.showHDP(match.Hdp, match.BetPos, match.MarketID)}</Text></View>
                                        <View style={styles.team}><Text>{match.HomeName}
                                            vs {match.AwayName}</Text><Text>{match.LeagueName}@{match.ReportDate}</Text></View>
                                        <View style={styles.bets}>
                                            <View style={styles.betBean}>
                                                <Text>投注猜豆:</Text><Text style={{color: "#ff5b06"}}>{(BetValue)}</Text>

                                            </View>
                                            <View style={styles.getBean}>
                                                <Text>预计返还:</Text><Text style={{color: "#ff5b06"}}>{(BackAmount)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }</View>), () => {
                        });
                        that.setState({
                            betResult: data.Data,
                            betParams: "",
                            betSuccess: true,
                        })
                    }

                } else if (data.BetResult === 2 || data.BetResult === 3) {
                    var str = "";
                    if (data.Changed.NewOdds != data.Changed.OldOdds) {
                        str += "赔率已从{0}变化为{1} ".format(data.Changed.OldOdds, data.Changed.NewOdds);
                    }
                    that.showAlert("提示", str, () => {
                        that.initBet(false, {
                            betOdds: params.Odds,
                            betPos: params.BetPos,
                            couid: params.CouID,
                            matchId: params.MatchID,
                            marketId: params.MarketID,
                        });
                    }, () => {
                    }, "继续投注", "取消");

                } else {
                    //处理异常状态
                    this.showAlert("提示", data.ErrorMsg, () => {
                        this.props.navigation.navigate("VoucherCenter", {state: 0});
                    }, () => {
                        this.props.navigation.navigate("TabAction", {state: 0});
                    }, "立即充值", "参与活动")
                }
            }).catch((error) => {
                that.hideLoading();

            })
        }
    }
    publish = (BetID) => {
        let that = this;
        this.showLoading();
        this.setState({
            isBetSuccess: false,
        })
        var params = {BetID: BetID}     //请求唯一参数注单ID
        this.networking.post(PublishBet, params, {}).then((data) => {
            this.hideLoading();
            var msg = data.Result;
            if (msg == 1) {
                that.showAlert("提示", "发布成功");
                return
            } else {
                var text = config.PublishMsg[msg];

                that.showAlert("提示", text);

            }

        }, () => {
            this.hideLoading();
        }).catch((error) => {
            that.showAlert("提示", "发布失败");
            this.hideLoading();

        })
    }
    _changeShowType = (newShowType) => {
        this.setState({
            showGameType: newShowType,
        })
    }
    _changeBallType = (newBallType) => {
        this.setState({
            sportId: newBallType,
        })
    }

    //打开APP获取token需要时间，所以选择在获取到token后页面才去请求数据。reducer中loginStore.hasToken变化触发shouldComponentUpdate
    shouldComponentUpdate(nextProps, nextState) {
        if (!this.props.loginStore.hasToken && nextProps.loginStore.hasToken) {
            this.getBalance();
        }
        //登录或退出后刷新活动列表
        if (this.props.loginStore.isLoggedIn !== nextProps.loginStore.isLoggedIn) {
            this.getBalance();
        }
        return true
    }

    componentDidMount() {
        if (this.props.loginStore.hasToken) {
            this.getBalance();
        }
    }

    renderGameType = () => {
        if (this.state.sportId == 1) {
            if (this.state.showGameType) {
                return (
                    <View style={styles.buttonImg}>

                        <Image source={require('../resource/icon_57.png')} style={styles.ballIcon}></Image>
                        <Image source={require('../resource/icon_20.png')} style={styles.downButton}></Image>

                    </View>
                );
            } else {
                return (
                    <View style={styles.buttonImg}>
                        <Image source={require('../resource/icon_57.png')} style={styles.ballIcon}></Image>
                        <Image source={require('../resource/icon_18.png')} style={styles.downButton}></Image>
                    </View>
                );
            }
        } else if (this.state.sportId == 2) {
            if (this.state.showGameType) {
                return (
                    <View style={styles.buttonImg}>
                        <Image source={require('../resource/icon_75.png')} style={styles.ballIcon}></Image>
                        <Image source={require('../resource/icon_20.png')} style={styles.downButton}></Image>
                    </View>
                );
            } else {
                return (
                    <View style={styles.buttonImg}>
                        <Image source={require('../resource/icon_75.png')} style={styles.ballIcon}></Image>
                        <Image source={require('../resource/icon_18.png')} style={styles.downButton}></Image>
                    </View>
                );
            }
        } else {
            if (this.state.showGameType) {
                return (
                    <View style={styles.buttonImg}>
                        <Image source={require('../resource/icon_68.png')} style={styles.ballIcon}></Image>
                        <Image source={require('../resource/icon_20.png')} style={styles.downButton}></Image>
                    </View>
                );
            } else {
                return (
                    <View style={styles.buttonImg}>
                        <Image source={require('../resource/icon_68.png')} style={styles.ballIcon}></Image>
                        <Image source={require('../resource/icon_18.png')} style={styles.downButton}></Image>
                    </View>
                );
            }
        }
    }


    render() {
        let Alert = this.Alert;
        let Loading = this.Loading;
        let noticeHeight = 40;
        let contentHeight = height - 146;

        if (this.props.loginStore.isPay) {
            noticeHeight = 0;
            contentHeight = contentHeight - 40;
        }
        return (
            <View style={styles.container}>
                <AppUpdate/>
                <StatusBar/>
                <View style={styles.top}>
                    <Headers navigation={this.props.navigation} balance={this.state.balance} goRank={this.goRank}
                             goBetList={this.goBetList}></Headers>
                </View>
                {/*公告*/}
                {
                    this.props.loginStore.isPay ? (
                        <Notice navigation={this.props.navigation}></Notice>
                    ) : null
                }

                <View style={styles.gameContainer}>
                    <View style={{width: width * 0.2, height: 42, justifyContent: "center", alignItems: "center"}}>
                        <TouchableWithoutFeedback onPress={() => {
                            this.setState({showGameType: !this.state.showGameType})
                        }}>
                            {
                                (this.renderGameType())
                            }
                        </TouchableWithoutFeedback>
                    </View>

                    <TabView tabList={this.tabList} styleFather={{height: 40, borderBottomWidth: 0, width: width * 0.8}}
                             styleChild={{height: 40}} onPress={this.onPress}></TabView>
                </View>
                <View style={[styles.content, {height: contentHeight}]}>
                    {
                        this.state.type == 1 ? (
                            <TimeItem sportId={this.state.sportId}
                                      navigation={this.props.navigation}></TimeItem>) : this.state.type == 2 ? (
                            <MatchItem sportId={this.state.sportId}
                                       navigation={this.props.navigation}></MatchItem>) : this.state.type == 3 ? (
                            <Live sportId={this.state.sportId} initBet={this.initBet}
                                  navigation={this.props.navigation}></Live>) : (
                            <Mix removeIndex={this.state.removeIndex} sportId={this.state.sportId}
                                 hideBetMsg={this.state.hideBetMsg}
                                 balance={this.state.balance} initBet={this.initBet}></Mix>)
                    }

                </View>
                {
                    this.state.showGameType ? (<GameType
                        changeBallType={this._changeBallType}
                        sportId={this.state.sportId}
                        showGameType={this.state.showGameType}
                        changeGameType={this._changeShowType}
                    ></GameType>) : null
                }
                {this.state.showGameType ? <View
                    style={[styles.forthFive, {top: Platform.OS == 'ios' ? 134 - noticeHeight : 114 - noticeHeight}]}></View> : null}
                {this.state.isShowBet ?
                    <BetPanel isCommon={false} removeMatch={this.removeMatch} balance={this.state.balance}
                              betInfo={this.state.betInfo}
                              isMix={this.state.isMix}
                              SubmitBet={this.SubmitBet} closeBetPanel={this.closeBetPanel}/> : null}
                {
                    this.state.isBetSuccess ?
                        <BetSuccess publish={this.publish} closeSucPanel={this.closeBetSuccessPanel}
                                    betResult={this.state.betResult}/> : null
                }
                {
                    this.state.isBetFail ? <BetFail closeFailPanel={this.closeBetFailPanel}/> : null
                }
                <Alert ref={(refAlert) => {
                    this.alert = refAlert
                }}></Alert>
                <Loading ref={(refLoading) => {
                    this.loading = refLoading
                }}></Loading>
            </View>
        );

    }
}

const mapStateToProps = state => ({
    loginStore: state.loginStore,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions, dispatch),
    ...bindActionCreators(ActionsBean, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(Guess);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        maxHeight: Screen.ScreenHeight,
    },
    top: {
        height: 40
    },
    body: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    gameContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    tab: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    balance: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        // paddingLeft:10,
        // paddingRight:10,
    },

    ballIcon: {
        width: 26,
        height: 20,
        resizeMode: 'contain',
    },
    downButton: {
        width: 15,
        height: 10,
        resizeMode: 'stretch',
    },
    buttonImg: {
        width: 50,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    forthFive: {
        left: 0.1 * Screen.ScreenWidth - 6,
        height: 14,
        width: 14,
        backgroundColor: '#fff',
        position: 'absolute',
        top: Platform.OS == 'ios' ? 134 : 114,
        transform: [{
            rotateZ: '45deg'
        }],
        borderLeftWidth: 1,
        borderColor: '#ccc',
        borderTopWidth: 1,
    },
    select: {
        borderBottomColor: "#3a67b3",
        borderBottomWidth: 2,
    },
    selectColor: {
        color: "#3a67b3"
    },
    noSelect: {
        borderBottomColor: "#ffffff",
    },
    noSelectColor: {
        color: "grey"
    },
    detail: {
        borderTopWidth: 1,
        borderTopColor: "#fff",
        paddingLeft: 10,
        paddingRight: 10,
    },
    league: {
        height: 30,
        justifyContent: 'center',
    },
    leagueText: {
        color: "#333",
    },
    team: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 30,
    },
    bets: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 30,
        alignItems: "center",
    },
    betBean: {
        flexDirection: "row",
    },
    getBean: {
        flexDirection: "row"
    },
    betSuc: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 30,
        alignItems: "center",
    },
    content: {
        height: height - 146
    }
});