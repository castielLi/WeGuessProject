/**
 * Created by maple on 2017/08/03.
 */
/**
 * Created by apple on 2017/6/7.
 */

'use strict';
import React, {
    Component
} from 'react';
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
    View,
    StyleSheet,
    Text,
    Image,
    ListView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import {
    connect
} from 'react-redux';

import {
    GetResultLeague,
    GetProcessLeague
} from "../../Config/apiUrlConfig"
import {bindActionCreators} from "redux";
import Networking from '../../../Core/WGNetworking/Network.js';
import ContainerComponent from '../../.././Core/Component/ContainerComponent'
import TabView from '../../Component/TabView';
import LeagueLive from '../component/leaguelive'
import LeagueProcess from '../component/leagueprocess'
import LeagueResult from '../component/leagueresult'
import * as tools from '../method';
import Screen from '../component/utils';
import Calander from '../component/calander';
import GameType from '../component/gameType';
import * as Actions from '../reducer/leagueAction';
import {StatusBar} from "../../Component/BackButton";
import BackgroundTimer from 'react-native-background-timer';

const urlObj = {
    '0': GetResultLeague,
    '1': GetProcessLeague
}

class League extends ContainerComponent {
    static navigationOptions = ({
                                    navigation
                                }) => {
        return {
            header: null //隐藏navigation
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showGameType: false,
            showCalander: false,
            today: new Date(),
            currentTime: 0,
            dateList: [],
            type: '2',
            sportId: 1,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
            showLoading:false,

        }
        this.timer = null;
        this.tabList = ["即时", "赛果", "赛程"];
    }

    componentWillUnmount() {
        if (this.timer) {
            BackgroundTimer.clearInterval(this.timer);
        }
    }

    fetchData = (sportId = this.state.sportId) => {
        //this.showLoading();
        let url = "";
        let params = {
            "SportId": sportId,
            'reportDate': this.state.dateList[this.state.currentTime].day
        };
        if (this.state.type == 6) {
            url = GetResultLeague;
        } else {
            url = GetProcessLeague;
        }
        //this.refreshData();
        this.networking.get(url, params, {}).then((responseData) => {
            this.setState({
               showLoading:false
           })
            this.hideLoading();
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.Data)
            });
        }, (error) => {
             this.setState({
               showLoading:false
           })
            this.hideLoading();
            this.showError(error);
        }).catch((error) => {
            this.setState({
               showLoading:false
           })
            this.hideLoading();
            this.showError(0);
        })
    }

    fetchRefreshData(sportId = this.props.sportId) {
        let url = "";
        let params = {
            "SportId": sportId,
            'reportDate': this.state.dateList[this.state.currentTime].day
        };
        if (this.state.type == 6) {
            url = GetResultLeague;
        } else {
            url = GetProcessLeague;
        }
        this.networking.get(url, params, {}).then((responseData) => {
            this.hideLoading();
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.Data)
            });
        }, () => {
            this.hideLoading()
        }).catch((error) => {
            this.hideLoading();

        })
    }

    //刷新盘口数据
    refreshData = (data) => {
        let that = this;
        this.timer = BackgroundTimer.setInterval(() => {
            that.fetchRefreshData(sportId = that.props.sportId);
        }, 10000);

    }

    getDateList(type) {
        let that = this;
        let arr = [],
            date;
        if (type == 2 || type == 6) { //赛果
            this.setState({
                currentTime: 6
            });
            for (let i = 0; i <= 6; i++) {
                date = new Date(new Date() - 24 * 60 * 60 * 1000 * i);
                arr.unshift({
                    'week': date.getDay(),
                    'day': date.getFullYear() + "-" + (date.getMonth() - 0 + 1) + "-" + date.getDate()
                })
            }
            that.setState({
                dateList: arr
            })

        } else { //赛程
            this.setState({
                currentTime: 0
            })
            for (let i = 0; i <= 6; i++) {
                date = new Date((new Date() - 0) + 24 * 60 * 60 * 1000 * i);
                arr.push({
                    'week': date.getDay(),
                    'day': date.getFullYear() + "-" + (date.getMonth() - 0 + 1) + "-" + date.getDate()
                })
            }
            that.setState({
                dateList: arr
            })

        }
    }

    goForwardDay() {
        if (this.state.currentTime <= 0) {
            return;
        }
        this.setState({
            currentTime: this.state.currentTime - 1
        }, () => {
            this.showLoading();
            this.fetchData();
        });

    }

    goAfterDay() {
        if (this.state.currentTime >= 6) {
            return;
        }
        this.setState({
            currentTime: this.state.currentTime + 1
        }, () => {
            this.showLoading();
            this.fetchData();
        })

    }

    componentWillMount() {
        this.getDateList(this.state.type);
    }

    _changeCalander = (newState) => {
        this.setState({
            showCalander: newState
        })
    }
    _changeCurrentTime = (newState) => {
        this.setState({
            currentTime: newState
        })
        setTimeout(this.fetchData, 200);
    }
    _changeImgType = (newBallType) => {
        this.setState({
            sportId: newBallType
        })
        this.fetchData(newBallType);
    }
    _changeGameType = (newGameType) => {
        this.setState({
            showGameType: newGameType
        })
    }
    getDataFunc = () => {
        return this.getDateList(this.state.type);
    }

    _changeType = (flag) => {//2:live 6:result 0:process
        if (flag == 0) {
            flag = 2;
            this.setState({
                showLoading:false
            })
        } else if (flag == 1) {
            flag = 6;
            this.setState({
                showLoading:true
            })
        } else {
            flag = 0;
            this.setState({
                showLoading:true
            })
        }
        this.setState({
            type: flag,
            showGameType: false,
            currentTime: flag,
        })
        setTimeout(this.getDataFunc, 100);
        setTimeout(this.fetchData, 200);

    }

    SelectMatch = (mid) => {
        this.props.navigation.navigate("SportMatch", {matchId: mid})
    }

    render() {
        let Alert = this.Alert;
        let Loading = this.Loading;
        const weekArr = ['(周日)', '(周一)', '(周二)', '(周三)', '(周四)', '(周五)', '(周六)'],
            week = weekArr[this.state.dateList[this.state.currentTime].week],
            day = this.state.dateList[this.state.currentTime].day;
        return (
            <View style={styles.container}>
                <StatusBar/>
                <View style={{height: 44,marginTop:2}}>
                    <TabView tabList={this.tabList} onPress={this._changeType} styleFather={{height:44}}></TabView>
                </View>
                {
                    this.state.type == 2 ? null : (
                        <View style={styles.body}>
                            <View>
                                <TouchableWithoutFeedback onPress={() => {
                                    this.setState({showGameType: !this.state.showGameType})
                                }}>
                                    <View style={styles.buttonImg}>
                                        {
                                            this.state.sportId == 1 ? (
                                                    <Image source={require('../resource/icon_57.png')}
                                                           style={styles.ballIcon}></Image>) :
                                                (this.state.sportId == 2 ? (
                                                        <Image source={require('../resource/icon_75.png')}
                                                               style={styles.ballIcon}></Image>) :
                                                    (<Image source={require('../resource/icon_68.png')}
                                                            style={styles.ballIcon}></Image>))
                                        }
                                        {
                                            !this.state.showGameType ? (
                                                <Image source={require('../resource/icon_18.png')}
                                                       style={styles.downButton}></Image>) : (
                                                <Image source={require('../resource/icon_20.png')}
                                                       style={styles.downButton}></Image>)
                                        }
                                    </View>
                                </TouchableWithoutFeedback>

                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'center',}}>
                                <View style={styles.touchButtonView}>

                                    {
                                        this.state.currentTime !== 0 ?
                                            (
                                                <TouchableWithoutFeedback onPress={() => {
                                                    this.goForwardDay()
                                                }} style={styles.touchButton}>
                                                    <View style={{
                                                        width: 60,
                                                        height: 40,
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}>
                                                        <Image source={require('../resource/icon_22.png')}></Image>
                                                    </View>
                                                </TouchableWithoutFeedback>)
                                            : (<Image source={require('../resource/icon_26.png')}></Image>)
                                    }

                                </View>
                                <View>
                                    <Text style={{marginRight: 10, marginLeft: 10, color: "#3a66b3"}}>
                                        {week + this.state.dateList[this.state.currentTime]['day']}
                                    </Text>
                                </View>
                                <View style={styles.touchButtonView}>
                                    {
                                        this.state.currentTime !== 6 ?
                                            (<TouchableWithoutFeedback onPress={() => {
                                                this.goAfterDay()
                                            }} style={styles.touchButton}>
                                                <View style={{
                                                    width: 60,
                                                    height: 40,
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>
                                                    <Image source={require('../resource/icon_24.png')}></Image>
                                                </View>
                                            </TouchableWithoutFeedback>) : (
                                                <Image source={require('../resource/icon_34.png')}></Image>)
                                    }

                                </View>
                            </View>
                            <View style={styles.DataImg}>
                                <TouchableWithoutFeedback onPress={() => {
                                    this.setState({showCalander: !this.state.showCalander})
                                }}>
                                    <View
                                        style={{width: 60, height: 40, justifyContent: "center", alignItems: "center"}}>
                                        <Image source={require('../resource/icon_54.png')}
                                               style={{resizeMode: 'stretch', height: 22, width: 22,}}></Image>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>)

                }
                <View>
                     {this.state.showLoading?(<View style={{backgroundColor:"#fff",justifyContent:"center",height:Screen.ScreenHeight-148}}>
                              <ActivityIndicator
                                    color="#3a67b3"
                                    style={[styles.centering, {height: 80}]}
                                    size="large"
                                />
                    </View>):
                        this.state.type == 2 ? (
                            <LeagueLive SelectMatch={this.SelectMatch}></LeagueLive>) : this.state.type == 6 ? (
                            <LeagueResult dataSource={this.state.dataSource}></LeagueResult>) : (
                            <LeagueProcess dataSource={this.state.dataSource}
                                           SelectMatch={this.SelectMatch}></LeagueProcess>)
                    }
                </View>
                {
                    this.state.showGameType == false ? (null) : (
                        <GameType
                            changeGameType={this._changeGameType}
                            showGameType={this.state.showGameType}
                            changeImgType={this._changeImgType}
                            sportId={this.state.sportId}></GameType>)
                }
                {
                    this.state.showCalander == false ? null : (
                        <Calander dateList={this.state.dateList}
                                  currentTime={this.state.currentTime}
                                  changeCalander={this._changeCalander}
                                  showCalander={this.state.showCalander}
                                  changeCurrentTime={this._changeCurrentTime}
                        ></Calander>)
                }
                {this.state.showGameType ? <View style={styles.forthFive}></View> : null}
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
    leagueResult: state.leagueResult,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(League);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    body: {
        width: Screen.ScreenWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 10,
        height: 45,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: "#fff",
    },

    title: {
        height: 40,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",

    },
    ballIcon: {
        width: 28,
        height: 23,
        resizeMode: 'contain',
    },
    downButton: {
        width: 15,
        height: 10,
        resizeMode: 'stretch',
    },
    buttonImg: {
        width: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    DataImg: {
        height: 40,
        width: 60,
        justifyContent: 'center',
    },
    touchButton: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchButtonView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
    },
    tTouch: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tChild: {
        height: 41,
        lineHeight: 30,
        paddingLeft: 20,
        paddingRight: 20,
    },
    borderBtm: {
        borderBottomColor: '#3a67b3',
        borderBottomWidth: 3,
    },
    forthFive: {
        left: 45,
        height: 14,
        width: 14,
        backgroundColor: '#fff',
        position: 'absolute',
        top: Platform.OS == 'ios' ? 98 : 78,
        transform: [{
            rotateZ: '45deg'
        }],
        borderLeftWidth: 1,
        borderColor: '#ccc',
        borderTopWidth: 1,
    },

});