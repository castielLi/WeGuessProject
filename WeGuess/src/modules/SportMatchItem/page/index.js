/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Alert,
    ListView,
    ScrollView,
    TouchableHighlight,
    Text,
    View,
    Dimensions,
    Image,
    Platform,
    Linking
} from 'react-native';
import {connect} from 'react-redux';
import {GetMatchOdd, GetBet, GetBalance, Bet, PublishBet, PayUrl} from '../../Config/apiUrlConfig';
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import HandleData from '../../Utils/sportHandle';
import config from '../../Utils/sportConfig';
import {BackButton, BlankButton} from "../../Component/BackButton";
import Header from './matchHeader';
import BetPane from '../../SportBet/betPane';
import BetSuccess from '../../SportBet/betSuccess';
import BetFail from '../../SportBet/betFail';
import {numFormat} from '../../Utils/money';
import {bindActionCreators} from "redux";
import * as Actions from '../../TokenManager/reducer/action';
import BackgroundTimer from 'react-native-background-timer';
import ExtendText from '../../Component/ExtendText';

let match, mk;
const ScreenHeight = Dimensions.get('window').height;
class Match extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: "赛事",
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
            matchData: {},
            matchId: this.props.navigation.state.params.matchId,
            betInfo: {},//投注信息
            isShowBet: false,
            betSuccess: false,
            betFail: false,
            selectBetitem: "",//选中的
            balance: 0,
            betParams: '',//投注参数
            betResult: '',
            errorMsg: '盘口关闭',//投注失败信息
            isMix: false,
            isLive: this.props.navigation.state.params.isLive,
            marketID: this.props.navigation.state.params.marketId,
            betPos: this.props.navigation.state.params.betPos,
            changeList: [],
            reLoad:false,//点击加载数据


        }
        this.fetchData = this.fetchData.bind(this);
        this.timer = null;
    }

    componentWillUnmount() {
        if (this.timer) {
            BackgroundTimer.clearInterval(this.timer);
        }
    }

    closeSucPanel = () => {
        this.setState({
            betSuccess: false,
        });
    }
    closeBetPanel = () => {
        this.setState({
            isShowBet: false,
        });
    }
    closeFailPanel = () => {
        this.setState({
            betFail: false,
        });
    }
    publish = (BetID) => {
        let that = this;
        this.showLoading();
        this.setState({
            betSuccess: false,
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

        }, (error) => {
            this.hideLoading();
            this.showError(error);
        }).catch((error) => {
            that.showAlert("提示", "发布失败");
            this.hideLoading();
        })

    }
    getBalance = () => {
        let params = {};
        this.networking.get(GetBalance, params, {}).then((responseData) => {
            this.setState({
                balance: responseData.Data
            })
        }, (error) => {
            this.showError(error)
        }).catch((error) => {

            this.showError(error);
        })
    }
    //联赛时间
    MatchDate = (date) => {
        let month = date.substr(4, 2);
        let mdate = date.substr(6, 2);
        let mhour = date.substr(8, 2);
        let mmiute = date.substr(10, 2);
        return month + "/" + mdate + " " + mhour + ":" + mmiute
    }
    FO = (odds) => {//格式Odds
        return HandleData.FormatOdds(odds);
    }
    Hdp = (hdp) => { //计算大小hdp
        return HandleData.ComputeHDP(hdp);
    }
    HdpH = (hdp) => { //计算主队让球hdp
        return HandleData.HdpH(hdp);
    }
    HdpA = (hdp) => { //计算客队让球hdp
        return HandleData.HdpA(hdp);
    }
    HasOwnProperty = (object, key) => {
        if (object && object.hasOwnProperty(key)) {
            return true;
        }
        return false;
    }
    //获取投注详细
    initBet = (betodd, betpos, couid, marketid) => {

        const {navigate} = this.props.navigation;

        if (this.props.loginStore.isLoggedIn) {

        } else {
            this.showLogin(() => navigate('Login'));
            return;
        }

        this.getBalance();
        if (betodd == 0) {
            this.showAlert("提示", "该盘口此时为关闭状态.");
            //w.vbus.$emit("ShowToast", "该盘口此时为关闭状态.", 1000);
            return;
        }
        this.showLoading();
        this.setState({
            selectBetitem: "{0}-{1}-{2}".format(marketid, 0, betpos)
        });
        var gu = this;
        let parma = {
            betOdds: betodd,
            betPos: betpos,
            couid: couid,
            matchId: this.state.matchId,
            marketId: marketid
        };
        this.networking.get(GetBet, parma, {}).then((responseData) => {
            this.hideLoading();
            let data = responseData;

            switch (data.RequestBetError) {
                case config.RequestBetError.Success:
                case config.RequestBetError.OddChange:
                case config.RequestBetError.OutLeveChanged:
                    if (data.RequestBetError == 1) {
                        //odds变化
                        this.showAlert("提示", "赔率已从{OldOdds}变化为{NewOdds}".format(data.Data.Ticket));
                    }
                    if (data.Data) {
                        this.setState({
                            betInfo: data.Data,
                            isShowBet: true

                        })
                    }
                    break;
                case config.RequestBetError.TicketError:
                case config.RequestBetError.LimitError:
                case config.RequestBetError.SystemError:
                case config.RequestBetError.OverLimit:
                case config.RequestBetError.MixParamNotFind:
                case config.RequestBetError.NeedLogin:
                    this.showAlert("提示", "请求注单失败,请重试或者刷新页面.");
                    break;
            }
        }, (error) => {
            this.showError(error);
            this.hideLoading();
        }).catch((error) => {
            this.hideLoading();
            this.showAlert("提示", "请求注单失败,请重试或者刷新页面.");
        });
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
    //提交投注  按日期 按比赛
    SubmitBet = (params) => {
        this.showLoading();
        this.setState({
            isShowBet: false
        });
        let that = this;
        this.networking.post(Bet, params, {}).then((responseData) => {
            that.hideLoading();
            that.setState.selectBetitem = "";
            let data = responseData;

            //投注成功
            if (data.BetResult === 0) {
                let {BetID, SubBets, BetValue, BackAmount} = data.Data;
                that.props.getMemberInfo();
                that.showAlert("投注成功", (
                    <View>
                        {
                            SubBets.map((match, index) => {
                                return (
                                    <View style={styles.detail} key={index}>
                                        <View style={styles.league}><Text
                                            style={styles.leagueText}>{match.Stage == 3 ? "滚球" : "赛前"}.{this.MarketName(match)}:{match.BetPosName} {this.showHDP(match.Hdp, match.BetPos, match.MarketID)}</Text></View>
                                        <View style={styles.team}><Text>{match.HomeName}
                                            vs {match.AwayName}</Text><Text>{match.LeagueName}@{match.ReportDate}</Text></View>
                                        <View style={styles.bets}>
                                            <View style={styles.betBean}>
                                                <Text>投注猜豆:</Text><Text
                                                style={{color: "#ff5b06"}}>{numFormat(BetValue)}</Text>

                                            </View>
                                            <View style={styles.getBean}>
                                                <Text>预计返还:</Text><Text
                                                style={{color: "#ff5b06"}}>{numFormat(BackAmount)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }</View>), () => {
                    that.publish(data.Data.BetID)
                }, () => {
                }, "立即发布", "取消", "#ff5b06");

                this.setState({
                    betParams: "",
                })


            } else if (data.BetResult === 2 || data.BetResult === 3) {
                var str = "";
                if (data.Changed.NewOdds != data.Changed.OldOdds) {
                    str += "赔率已从{0}变化为{1} ".format(data.Changed.OldOdds, data.Changed.NewOdds);
                }
                that.showAlert("提示", str, () => {
                    that.initBet({
                        betOdds: params.Odds,
                        betPos: params.BetPos,
                        couid: params.CouID,
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
        }, (error) => {
            this.showError(error)
        }).catch((error) => {
            this.hideLoading();
           this.showError(error);
        })
    }
    betItem = (marketid, index, betpos) => {//投注列
        return "{0}-{1}-{2}".format(marketid, index, betpos);
    }
    bgColor = (marketid, index, betpos) => {
        return (this.state.selectBetitem == this.betItem(marketid, index, betpos) ? "#3a66b3" : null)
    }
    fontColor = (marketid, index, betpos, color) => {
        return (this.state.selectBetitem == this.betItem(marketid, index, betpos) ? "#fff" : color)
    }

    fetchData() {
        let params = {
                matchId: this.state.matchId,
            },
            that = this, match = [];
        this.networking.get(GetMatchOdd, params).then((responseData) => {
            this.hideLoading();
            match = responseData.Data
            this.setState({
                matchData: match,
            })
            if (this.state.betPos != undefined && this.state.marketID != undefined) {
                let betPos = this.state.betPos,
                    marketID = this.state.marketID,
                    betodd = match.MK[marketID][0][betPos],
                    couid = match.MK[marketID][0][0];

                that.initBet(betodd, betPos, couid, marketID);
            }
            if(match.Stage===3){
            that.refreshData(match);
            }

        }, (error) => {
            if(error==-2){
                this.setState({
                    reLoad:true,
                })
            }
            this.showError(error);
            this.hideLoading();
        }).catch((error) => {
            if(error==-2){
                this.setState({
                    reLoad:true,
                })
            }
           this.showError(error);

            this.hideLoading();
        });

    }

    fetchRefreshData() {
        let params = {
                matchId: this.state.matchId,
            },
            that = this, match = [];
        this.networking.get(GetMatchOdd, params).then((responseData) => {

            match = responseData.Data
            if (this.state.betPos != undefined && this.state.marketID != undefined) {
                let betPos = this.state.betPos,
                    marketID = this.state.marketID,
                    betodd = match.MK[marketID][0][betPos],
                    couid = match.MK[marketID][0][0];
                
                that.initBet(betodd, betPos, couid, marketID);
            }
            that.MatchChange(match);

        }, (error) => {
           this.showError(error)
        }).catch((error) => {

           this.showError(error);
        });

    }

    //刷新盘口数据
    refreshData = (data) => {
        var that = this;
        this.timer = BackgroundTimer.setInterval(() => {
            that.fetchRefreshData();
        }, 30000);

    }
    //获取盘口变更
    MatchChange = (newdata) => {
        this.setState({
            changeList: HandleData.MatchChange(this.state.matchData, newdata),
            matchData: newdata,
        })
    }
    //计算赔率变更0:无变更,1上升,2下降
    OddChange = (maketid, index, betpos) => {
        var key = "{0}-{1}-{2}".format(maketid, index, betpos);
        if (this.state.changeList.hasOwnProperty(key)) {
            let flag = this.state.changeList[key];
            if (flag == 1) {
                return (
                    <Image style={{marginTop: 5, height: 36, width: 14}} source={require('../resource/icon_09.png')}/>);
            } else if (flag == 2) {
                return (
                    <Image style={{marginTop: 5, height: 36, width: 14}} source={require('../resource/icon_06.png')}/>);
            } else {
                return null;
            }
        }
        ;
        return null;
    }

    reLoad = ()=>{
        return (
            <TouchableHighlight onPress={()=>{
                this.setState({
                    reLoad:false
                })
                this.fetchData()
            }}>
                <View style={{height:ScreenHeight-230,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:16}}>点击重新加载数据</Text>
                </View>
            </TouchableHighlight>
        )
    }
    //当初始化appToken，设置存在的时候,第一次刷新获取数据
    shouldComponentUpdate(nextProps, nextState) {
        if (!this.props.loginStore.hasToken && nextProps.loginStore.hasToken) {
            this.fetchData();
        }
        return true
    }

    componentDidMount() {
        if (this.props.loginStore.hasToken) {
            this.showLoading();
            this.fetchData();
        }
    }

    render() {
        let Alert = this.Alert;
        let Loading = this.Loading;
        let WebView = this.WebView;
        match = this.state.matchData, mk = match.MK;
        return (
            <View style={styles.container}>
                <Header headerData={this.state.matchData} navigate={this.props.navigation.navigate}/>
                {
                    this.state.reLoad?(this.reLoad()):

                (<ScrollView style={styles.scroller}>
                    {//全场赛果
                        this.HasOwnProperty(mk, 5) ? this._allResult() : null
                    }
                    {//全长让球
                        this.HasOwnProperty(mk, 1) ? this._allLetBall() : null
                    }
                    {//全场大小
                        this.HasOwnProperty(mk, 3) ? this._allBS() : null
                    }
                    {//上半场赛果
                        this.HasOwnProperty(mk, 6) ? this._halfFirstResult() : null
                    }
                    {//上半场让球
                        this.HasOwnProperty(mk, 2) ? this._halfFirstLetBall() : null
                    }
                    {//上半场大小
                        this.HasOwnProperty(mk, 4) ? this._halfFirstBS() : null
                    }
                    {//全场波胆
                        this.HasOwnProperty(mk, 9) ? this._allWave() : null
                    }
                    {//全场进球
                        this.HasOwnProperty(mk, 11) ? this._allInBall() : null
                    }
                </ScrollView>)
                }
                <View style={{height: 30, justifyContent: "center", marginBottom: 10}}>
                    <Text >*注：页面无赔率时处于封盘状态</Text>
                </View>
                {
                    this.state.isShowBet ? (
                        <BetPane isCommon={true} isMix={this.state.isMix} betInfo={this.state.betInfo}
                                 balance={this.state.balance}
                                 SubmitBet={this.SubmitBet} closeBetPanel={this.closeBetPanel}/>) : null
                }
                {
                    this.state.betSuccess ? (<BetSuccess betResult={this.state.betResult} publish={this.publish}
                                                         closeSucPanel={this.closeSucPanel}/>) : null
                }
                {
                    this.state.betFail ? (
                        <BetFail errorMsg={this.state.errorMsg} closeFailPanel={this.closeFailPanel}/>) : null
                }
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
        );
    }

    _allResult = () => {//全场赛果
        return (
            <View>
                <View style={styles.gameResult}>
                    <Text style={styles.ResultTextTitle}>全场赛果:</Text>
                    <Text style={styles.ResultTextNotes}>猜90分钟内比赛结果(含伤停补时)</Text>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[5][0][1], 1, match.MK[5][0][0], 5)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(5, 0, 1)}]}>
                            {/*<Text numberOfLines={1} style={[styles.teamName, {color: this.fontColor(5, 0, 1, "#000"),flex:1,}]}>{match.HN}</Text>*/}
                            <ExtendText txt={match.HN}
                                        sty={[styles.teamName, {color: this.fontColor(5, 0, 1, "#000")}]}/>
                            <Text
                                style={[styles.teamVotes, {
                                    textAlign: "right",
                                    flex: 1,
                                    color: this.fontColor(5, 0, 1, "#ff5b06")
                                }]}>{this.FO(mk["5"][0][1])}
                                {this.OddChange(5, 0, 1)}
                            </Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.draw} onPress={() => {
                        this.initBet(match.MK[5][0][3], 3, match.MK[5][0][0], 5)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(5, 0, 3)}]}>
                            <Text numberOfLines={1}
                                  style={[styles.teamName, {color: this.fontColor(5, 0, 3, "#000"), flex: 1}]}>和局</Text>
                            <Text
                                style={[styles.teamVotes, {
                                    textAlign: "right",
                                    flex: 1,
                                    color: this.fontColor(5, 0, 3, "#ff5b06")
                                }]}>
                                {this.FO(mk["5"][0][3])}
                                {this.OddChange(5, 0, 3)}
                            </Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[5][0][2], 2, match.MK[5][0][0], 5)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(5, 0, 2)}]}>
                            {/*<Text numberOfLines={1} style={[styles.teamName, {flex:1,color: this.fontColor(5, 0, 2, "#000")}]}>{match.AN}</Text>*/}
                            <ExtendText txt={match.AN}
                                        sty={[styles.teamName, {color: this.fontColor(5, 0, 2, "#000")}]}/>
                            <Text
                                style={[styles.teamVotes, {
                                    textAlign: "right",
                                    flex: 1,
                                    color: this.fontColor(5, 0, 2, "#ff5b06")
                                }]}>{this.FO(match.MK["5"][0][2])}
                                {this.OddChange(5, 0, 2)}</Text>

                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

    _allLetBall = () => {//全场让球
        return (
            <View>
                <View style={styles.gameResult}>
                    <Text style={styles.ResultTextTitle}>全场让球:</Text>
                    <Text style={styles.ResultTextNotes}>猜90分钟内比赛结果(含伤停补时)</Text>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[1][0][1], 1, match.MK[1][0][0], 1)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(1, 0, 1)}]}>

                            <View style={{flexDirection: "row"}}>
                                {/*<Text numberOfLines={1}
                                 style={[styles.teamName, {color: this.fontColor(1, 0, 1, "#000")}]}>{match.HN}</Text>*/}
                                <ExtendText txt={match.HN}
                                            sty={[styles.teamName, {color: this.fontColor(1, 0, 1, "#000")}]}/>
                                <Text numberOfLines={1}
                                      style={[styles.teamName, {color: this.fontColor(1, 0, 1, "#000")}]}> {this.HdpH(match.MK["1"][0][3])}</Text>
                            </View>


                            <Text
                                style={[styles.teamVotes, {
                                    textAlign: "right",
                                    flex: 1,
                                    color: this.fontColor(1, 0, 1, "#ff5b06")
                                }]}>{this.FO(match.MK["1"][0][1])}
                                {this.OddChange(1, 0, 1)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[1][0][2], 2, match.MK[1][0][0], 1)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(1, 0, 2)}]}>
                            <View style={{flexDirection: "row"}}>
                                {/*<Text numberOfLines={1}
                                 style={[styles.teamName, {flex:3,color: this.fontColor(1, 0, 2, "#000")}]}>{match.AN} {this.HdpA(match.MK["1"][0][3])}</Text>*/}
                                <ExtendText txt={match.AN}
                                            sty={[styles.teamName, {color: this.fontColor(1, 0, 2, "#000")}]}/>
                                <Text
                                    style={[styles.teamName, {color: this.fontColor(1, 0, 2, "#000")}]}> {this.HdpA(match.MK["1"][0][3])}</Text>
                            </View>


                            <Text
                                style={[styles.teamVotes, {
                                    textAlign: "right",
                                    flex: 1,
                                    color: this.fontColor(1, 0, 2, "#ff5b06")
                                }]}>{this.FO(match.MK["1"][0][2])}
                                {this.OddChange(1, 0, 2)}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
    _allBS = () => {//全场大小
        return (
            <View>
                <View style={styles.gameResult}>
                    <Text style={styles.ResultTextTitle}>全场大小:</Text>
                    <Text style={styles.ResultTextNotes}>猜90分钟内比赛结果(含伤停补时)</Text>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[3][0][1], 1, match.MK[3][0][0], 3)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(3, 0, 1)}]}>
                            <Text
                                style={[styles.teamName, {color: this.fontColor(3, 0, 1, "#000")}]}>大于 {this.Hdp(match.MK["3"][0][3])}</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(3, 0, 1, "#ff5b06")}]}>{this.FO(match.MK["3"][0][1])}
                                {this.OddChange(3, 0, 1)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[3][0][2], 2, match.MK[3][0][0], 3)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(3, 0, 2)}]}>
                            <Text
                                style={[styles.teamName, {color: this.fontColor(3, 0, 2, "#000")}]}>小于 {this.Hdp(match.MK["3"][0][3])}</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(3, 0, 2, "#ff5b06")}]}>{this.FO(match.MK["3"][0][2])}

                                {this.OddChange(3, 0, 2)}</Text>

                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
    _halfFirstResult = () => {//上半场赛果
        return (
            <View>
                <View style={styles.gameResult}>
                    <Text style={styles.ResultTextTitle}>上半场赛果:</Text>
                    <Text style={styles.ResultTextNotes}>猜90分钟内比赛结果(含伤停补时)</Text>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[6][0][1], 1, match.MK[6][0][0], 6)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(6, 0, 1)}]}>
                            {/*<Text numberOfLines={1} style={[styles.teamName, {flex:1,color: this.fontColor(6, 0, 1, "#000")}]}>{match.HN}</Text>*/}
                            <ExtendText txt={match.HN}
                                        sty={[styles.teamName, {color: this.fontColor(6, 0, 1, "#000")}]}/>
                            <Text
                                style={[styles.teamVotes, {
                                    flex: 1,
                                    textAlign: "right",
                                    color: this.fontColor(6, 0, 1, "#ff5b06")
                                }]}>{this.FO(mk["6"][0][1])}
                                {this.OddChange(6, 0, 1)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.draw} onPress={() => {
                        this.initBet(match.MK[6][0][3], 3, match.MK[6][0][0], 6)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(6, 0, 3)}]}>
                            <Text numberOfLines={1}
                                  style={[styles.teamName, {flex: 1, color: this.fontColor(6, 0, 3, "#000")}]}>和局</Text>
                            <Text
                                style={[styles.teamVotes, {
                                    textAlign: "right",
                                    flex: 1,
                                    color: this.fontColor(6, 0, 3, "#ff5b06")
                                }]}>{this.FO(mk["6"][0][3])}
                                {this.OddChange(6, 0, 3)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[6][0][2], 2, match.MK[6][0][0], 6)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(6, 0, 2)}]}>
                            {/*<Text numberOfLines={1} style={[styles.teamName, {flex:1,color: this.fontColor(6, 0, 2, "#000")}]}>{match.AN}</Text>*/}
                            <ExtendText txt={match.AN}
                                        sty={[styles.teamName, {color: this.fontColor(6, 0, 2, "#000")}]}/>
                            <Text
                                style={[styles.teamVotes, {
                                    textAlign: "right",
                                    flex: 1,
                                    color: this.fontColor(6, 0, 2, "#ff5b06")
                                }]}>{this.FO(match.MK["6"][0][2])}

                                {this.OddChange(6, 0, 2)}</Text>

                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
    _halfFirstLetBall = () => {//上半场让球
        return (
            <View>
                <View style={styles.gameResult}>
                    <Text style={styles.ResultTextTitle}>上半场让球:</Text>
                    <Text style={styles.ResultTextNotes}>猜90分钟内比赛结果(含伤停补时)</Text>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[2][0][1], 1, match.MK[2][0][0], 2)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(2, 0, 1)}]}>


                            <View style={{flexDirection: "row"}}>
                                {/*<Text numberOfLines={1}
                                 style={[styles.teamName, {flex:3,color: this.fontColor(2, 0, 1, "#000")}]}>{match.HN} {this.HdpH(match.MK["1"][0][3])}</Text>*/}
                                <ExtendText txt={match.HN}
                                            sty={[styles.teamName, {color: this.fontColor(2, 0, 1, "#000")}]}/>
                                <Text numberOfLines={1}
                                      style={[styles.teamName, {color: this.fontColor(2, 0, 1, "#000")}]}> {this.HdpH(match.MK["1"][0][3])}</Text>
                            </View>
                            <Text
                                style={[styles.teamVotes, {
                                    flex: 1,
                                    textAlign: "right",
                                    color: this.fontColor(2, 0, 1, "#ff5b06")
                                }]}>{this.FO(match.MK["2"][0][1])}
                                {this.OddChange(2, 0, 1)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[2][0][2], 2, match.MK[2][0][0], 2)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(2, 0, 2)}]}>
                            <View style={{flexDirection: "row"}}>
                                {/*<Text numberOfLines={1}
                                 style={[styles.teamName, {flex:3,color: this.fontColor(2, 0, 2, "#000")}]}>{match.AN} {this.HdpA(match.MK["1"][0][3])}</Text>*/}
                                <ExtendText txt={match.AN}
                                            sty={[styles.teamName, {color: this.fontColor(2, 0, 2, "#000")}]}/>
                                <Text numberOfLines={1}
                                      style={[styles.teamName, {color: this.fontColor(2, 0, 2, "#000")}]}> {this.HdpA(match.MK["1"][0][3])}</Text>
                            </View>


                            <Text
                                style={[styles.teamVotes, {
                                    textAlign: "right",
                                    flex: 1,
                                    color: this.fontColor(2, 0, 2, "#ff5b06")
                                }]}>{this.FO(match.MK["2"][0][2])}
                                {this.OddChange(2, 0, 2)}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
    _halfFirstBS = () => {//上半场大小
        return (
            <View>
                <View style={styles.gameResult}>
                    <Text style={styles.ResultTextTitle}>上半场大小:</Text>
                    <Text style={styles.ResultTextNotes}>猜90分钟内比赛结果(含伤停补时)</Text>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[4][0][1], 1, match.MK[4][0][0], 4)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(4, 0, 1)}]}>
                            <Text
                                style={[styles.teamName, {color: this.fontColor(4, 0, 1, "#000")}]}>大于 {this.Hdp(match.MK["4"][0][3])}</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(4, 0, 1, "#ff5b06")}]}>{this.FO(match.MK["4"][0][1])}
                                {this.OddChange(4, 0, 1)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[4][0][2], 2, match.MK[4][0][0], 4)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(4, 0, 2)}]}>
                            <Text
                                style={[styles.teamName, {color: this.fontColor(4, 0, 2, "#000")}]}>小于 {this.Hdp(match.MK["4"][0][3])}</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(4, 0, 2, "#ff5b06")}]}>{this.FO(match.MK["4"][0][2])}
                                {this.OddChange(4, 0, 2)}</Text>

                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
    _allWave = () => {//全场波胆
        return (
            <View>
                <View style={styles.gameResult}>
                    <Text style={styles.ResultTextTitle}>全场波胆:</Text>
                    <Text style={styles.ResultTextNotes}>猜90分钟内比赛结果(含伤停补时)</Text>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[9][0][6], 6, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 6)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 6, "#000")}]}>1:0</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 6, "#ff5b06")}]}>{this.FO(match.MK["9"][0][6])}
                                {this.OddChange(9, 0, 6)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.draw} onPress={() => {
                        this.initBet(match.MK[9][0][1], 1, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 1)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 1, "#000")}]}>0:0</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 1, "#ff5b06")}]}>{this.FO(match.MK["9"][0][1])}

                                {this.OddChange(9, 0, 1)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[9][0][2], 2, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 2)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 2, "#000")}]}>0:1</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 2, "#ff5b06")}]}>{this.FO(match.MK["9"][0][2])}
                                {this.OddChange(9, 0, 2)}</Text>

                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[9][0][11], 11, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 11)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 11, "#000")}]}>2:0</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 11, "#ff5b06")}]}>{this.FO(match.MK["9"][0][11])}
                                {this.OddChange(9, 0, 11)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.draw} onPress={() => {
                        this.initBet(match.MK[9][0][7], 7, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 7)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 7, "#000")}]}>1:1</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 7, "#ff5b06")}]}>{this.FO(match.MK["9"][0][7])}
                                {this.OddChange(9, 0, 7)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[9][0][3], 3, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 3)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 3, "#000")}]}>0:2</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 3, "#ff5b06")}]}>{this.FO(match.MK["9"][0][3])}
                                {this.OddChange(9, 0, 3)}</Text>

                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[9][0][12], 12, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 12)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 12, "#000")}]}>2:1</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 12, "#ff5b06")}]}>{this.FO(match.MK["9"][0][12])}

                                {this.OddChange(9, 0, 12)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.draw} onPress={() => {
                        this.initBet(match.MK[9][0][13], 13, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 13)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 13, "#000")}]}>2:2</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 13, "#ff5b06")}]}>{this.FO(match.MK["9"][0][13])}
                                {this.OddChange(9, 0, 13)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[9][0][8], 8, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 8)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 8, "#000")}]}>1:2</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 8, "#ff5b06")}]}>{this.FO(match.MK["9"][0][8])}
                                {this.OddChange(9, 0, 8)}</Text>

                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[9][0][16], 16, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 16)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 16, "#000")}]}>3:0</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 16, "#ff5b06")}]}>{this.FO(match.MK["9"][0][16])}

                                {this.OddChange(9, 0, 16)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.draw} onPress={() => {
                        this.initBet(match.MK[9][0][19], 19, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 19)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 19, "#000")}]}>3:3</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 19, "#ff5b06")}]}>{this.FO(match.MK["9"][0][19])}
                                {this.OddChange(9, 0, 19)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[9][0][4], 4, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 4)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 4, "#000")}]}>0:3</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 4, "#ff5b06")}]}>{this.FO(match.MK["9"][0][4])}
                                {this.OddChange(9, 0, 4)}</Text>

                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[9][0][17], 17, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 17)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 17, "#000")}]}>3:1</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 17, "#ff5b06")}]}>{this.FO(match.MK["9"][0][17])}
                                {this.OddChange(9, 0, 17)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.draw} onPress={() => {
                        this.initBet(match.MK[9][0][25], 25, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 25)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 25, "#000")}]}>4:4</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 25, "#ff5b06")}]}>{this.FO(match.MK["9"][0][25])}
                                {this.OddChange(9, 0, 25)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[9][0][9], 9, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 9)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 9, "#000")}]}>1:3</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 9, "#ff5b06")}]}>{this.FO(match.MK["9"][0][9])}
                                {this.OddChange(9, 0, 9)}</Text>

                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[9][0][18], 18, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 18)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 18, "#000")}]}>3:2</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 18, "#ff5b06")}]}>{this.FO(match.MK["9"][0][18])}
                                {this.OddChange(9, 0, 18)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.draw} onPress={() => {
                        this.initBet(match.MK[9][0][26], 26, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 26)}]}>
                            {/*<Text numberOfLines={1} style={[styles.teamName, {flex:1,color: this.fontColor(9, 0, 26, "#000")}]}>主5球以上</Text>*/}
                            <ExtendText txt='主5球以上' textLength={5}
                                        sty={[styles.teamName, {color: this.fontColor(9, 0, 26, "#000")}]}/>
                            <Text
                                style={[styles.teamVotes, {
                                    textAlign: "right",
                                    flex: 1,
                                    color: this.fontColor(9, 0, 26, "#ff5b06")
                                }]}>{this.FO(match.MK["9"][0][26])}
                                {this.OddChange(9, 0, 26)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[9][0][14], 14, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 14)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 14, "#000")}]}>2:3</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 14, "#ff5b06")}]}>{this.FO(match.MK["9"][0][14])}
                                {this.OddChange(9, 0, 14)}</Text>

                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[9][0][21], 21, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 21)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 21, "#000")}]}>4:0</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 21, "#ff5b06")}]}>{this.FO(match.MK["9"][0][21])}
                                {this.OddChange(9, 0, 21)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.draw} onPress={() => {
                        this.initBet(match.MK[9][0][27], 27, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 27)}]}>
                            {/*<Text numberOfLines={1} style={[styles.teamName, {flex:1,color: this.fontColor(9, 0, 27, "#000")}]}>客5球以上</Text>*/}
                            <ExtendText txt='客5球以上' textLength={5}
                                        sty={[styles.teamName, {color: this.fontColor(9, 0, 27, "#000")}]}/>
                            <Text
                                style={[styles.teamVotes, {
                                    textAlign: "right",
                                    flex: 1,
                                    color: this.fontColor(9, 0, 27, "#ff5b06")
                                }]}>{this.FO(match.MK["9"][0][27])}
                                {this.OddChange(9, 0, 27)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[9][0][5], 5, match.MK[9][0][0], 9)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(9, 0, 5)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(9, 0, 5, "#000")}]}>0:4</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(9, 0, 5, "#ff5b06")}]}>{this.FO(match.MK["9"][0][5])}
                                {this.OddChange(9, 0, 5)}</Text>

                        </View>
                    </TouchableHighlight>
                </View>

            </View>
        )
    }
    _allInBall = () => {//全场总进球数
        return (
            <View>
                <View style={styles.gameResult}>
                    <Text style={styles.ResultTextTitle}>全场总进球数:</Text>
                    <Text style={styles.ResultTextNotes}>猜90分钟内比赛结果(含伤停补时)</Text>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[11][0][1], 1, match.MK[11][0][0], 11)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(11, 0, 1)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(11, 0, 1, "#000")}]}>0-1</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(11, 0, 1, "#ff5b06")}]}>{this.FO(match.MK["11"][0][1])}
                                {this.OddChange(11, 0, 1)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[11][0][2], 2, match.MK[11][0][0], 11)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(11, 0, 2)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(11, 0, 2, "#000")}]}>2-3</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(11, 0, 2, "#ff5b06")}]}>{this.FO(match.MK["11"][0][2])}
                                {this.OddChange(11, 0, 2)}</Text>

                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.bet}>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamOneWin} onPress={() => {
                        this.initBet(match.MK[11][0][3], 3, match.MK[11][0][0], 11)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(11, 0, 3)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(11, 0, 3, "#000")}]}>4-6</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(11, 0, 3, "#ff5b06")}]}>{this.FO(match.MK["11"][0][3])}
                                {this.OddChange(11, 0, 3)}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#3a66b3' style={styles.TeamTwoWin} onPress={() => {
                        this.initBet(match.MK[11][0][4], 4, match.MK[11][0][0], 11)
                    }}>
                        <View style={[styles.teamBet, {backgroundColor: this.bgColor(11, 0, 4)}]}>
                            <Text style={[styles.teamName, {color: this.fontColor(11, 0, 4, "#000")}]}>7以上</Text>
                            <Text
                                style={[styles.teamVotes, {color: this.fontColor(11, 0, 4, "#ff5b06")}]}>{this.FO(match.MK["11"][0][4])}
                                {this.OddChange(11, 0, 4)}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

}
const mapStateToProps = state => ({
    loginStore: state.loginStore,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(Match);
const styles = StyleSheet.create({
    scroller: {
        height: ScreenHeight - 230
    },
    gameResult: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderColor: '#CCC',
        borderBottomWidth: 1,
    },
    ResultTextTitle: {
        color: '#444',
        fontWeight: '700',
        fontSize: 13,
    },
    ResultTextNotes: {
        fontSize: 12,
        fontWeight: '400',
        color: 'grey',
    },
    bet: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: "#fff"
    },
    TeamOneWin: {
        flex: 1,
        height: 45,
        borderRightWidth: 1,
        borderColor: '#ccc',
    },
    draw: {
        flex: 1,
        height: 45,
        borderRightWidth: 1,
        borderColor: '#ccc',
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
    TeamTwoWin: {
        height: 45,
        flex: 1,
    },
    teamBet: {
        paddingLeft: 7,
        paddingRight: 7,
        height: 45,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    teamName: {
        fontSize: 16,
        color: '#000',
    },
    teamVotes: {
        fontSize: 16,
        color: '#ff5b06',
    },
    upOrDown: {
        height: 25,
        width: 9,
        resizeMode: 'cover',
    },

});
