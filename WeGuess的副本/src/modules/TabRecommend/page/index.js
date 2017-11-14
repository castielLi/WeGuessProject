/**
 * Created by Hsu. on 2017/8/2.
 */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
} from 'react-native';

import {connect} from 'react-redux';
import ContainerComponent from '../../.././Core/Component/ContainerComponent';

import {GetPublishRankUrl, GetAnalysisUrl, GetMemberInfo, BuyAnalysis, WebViewUrl} from '../../Config/apiUrlConfig';
import method from '../../TabRecommend/common/method';

import RankItem from '../common/rankItem';
import AnalysisItem from '../common/analysisItem';
import Header from './header';
import {StatusBar} from "../../Component/BackButton";
import {PullView} from 'react-native-pull';

class Recommend extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        return {
            header: null //隐藏navigation
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            RankList: [],
            GuessList: [],
            rankType: 0

        };
    }

    componentDidMount() {
        if (this.props.loginStore.hasToken) {
            this.GetRankList(0);
            this.GetGuessList();
        }
    }

    showWebViewTab = (index) => {
        if (index == 0) {
            this.showWebView(WebViewUrl.analysisRule.url, WebViewUrl.analysisRule.title);
        } else {
            this.showWebView(WebViewUrl.userRankRule.url, WebViewUrl.userRankRule.title);
        }
    }

    //当初始化appToken，设置存在的时候,第一次刷新获取数据
    shouldComponentUpdate(nextProps, nextState) {
        if (!this.props.loginStore.hasToken && nextProps.loginStore.hasToken) {
            this.GetRankList(0);
            this.GetGuessList();
        }
        return true
    }

    GetRankList(type) {
        let params = {
            PageIndex: 1,
            PageSize: 5,
            Type: type
        }
        let that = this;
        this.networking.get(GetPublishRankUrl, params, {}).then((responseJson) => {
            let {Result, Data} = responseJson;
            if (Result === 1) {
                this.setState({
                    RankList: Data,
                    rankType: type,
                });
            } else {
                that.showError(Result);
            }
        }, (error) => {

            that.showError(error);
        }).catch((error) => {

            that.showError(error);
        })
    }

    GetGuessList(resolve) {
        let params = {
            Count: 4
        }
        let that = this;
        this.networking.get(GetAnalysisUrl, params, {}).then((responseJson) => {
            let {Result, Data} = responseJson;
            if (Result === 1) {
                this.setState({
                    GuessList: Data,
                });
                if (resolve) {
                    resolve();
                }
            } else {
                that.showError(Result);
            }
        }, (error) => {

            if (resolve) {
                resolve();
            }
            that.showError(error);
        }).catch((error) => {

            if (resolve) {
                resolve();
            }
            that.showError(error);
        })
    }

    onPullRelease(resolve) {
        setTimeout(() => {
            this.GetRankList(this.state.rankType);
            this.GetGuessList(resolve);
        }, 1000);
    }


    rankList = () => {
        const {navigate} = this.props.navigation;
        if (this.state.RankList.length) {
            return (
                this.state.RankList.map((Item, index) =>
                    <RankItem data={Item} key={index} index={index} onCheck={() => {
                        navigate("UserRank", {OpenID: Item.OpenID})
                    }}/>
                ))
        } else {
            return (<View style={{
                marginTop: 20,
                marginBottom: 4,
                alignItems: 'center',
                justifyContent: 'center'
            }}><Text>暂无新数据</Text></View>)
        }
    }


    buyGuess(params, userData) {
        const {navigate} = this.props.navigation;
        let that = this;
        this.networking.post(BuyAnalysis, params, {}).then((responseData) => {
            let {Result, Data} = responseData;
            if (Result === 1107) {
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
            }
            else if (Result === 1) {
                navigate("AnalysisDetail", {AnalysisNo: params.analysisNo, callback: () => this.onPullRelease()})
            }
            else if (Result === 0) {
                this.showError(Result)
            }
        }, (error) => {
            this.showError(error)
        }).catch((error) => {
            that.showError(error);

        })
    }

    goToVoucherCenter = () => {
        this.props.navigation.navigate('VoucherCenter', {state: 0})
    }

    isShowAlert(isLogin, matchData) {
        const {navigate} = this.props.navigation;
        let GuessMatch = JSON.parse(matchData.GuessMatch);
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
                        {GuessMatch.map((Data, index) =>
                            <View key={index} style={{
                                flexDirection: 'row',
                                paddingHorizontal: 20,
                                paddingVertical: 5,
                                borderColor: '#ddd',
                                borderBottomWidth: GuessMatch.length === 1 ? 0 : 1,
                                backgroundColor: index % 2 ? '#f7f7f7' : '#fff'
                            }}>
                                <Text style={{width: 50, fontSize: 12, lineHeight: 20}}>
                                    {matchData.EndTimeStr}
                                </Text>
                                <View style={{flex: 1, flexDirection: 'row', marginLeft: 10, alignItems: 'center'}}>
                                    <Text
                                        style={{textAlign: 'left', flex: 1, fontSize: 14}}>{Data.MatchInfo.Home}</Text>
                                    <Text style={{textAlign: 'center', fontSize: 12}}> vs </Text>
                                    <Text
                                        style={{textAlign: 'right', flex: 1, fontSize: 14}}>{Data.MatchInfo.Away}</Text>
                                </View>
                            </View>
                        )}
                        <View style={{paddingVertical: 15}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 5
                            }}>
                                <Text style={{color: '#d80100'}}>查看需要</Text>
                                <Image source={require('../../Resources/gold.png')} style={{height: 16, width: 16}}/>
                                <Text style={{color: '#d80100'}}>&nbsp;{method.numberFormat(matchData.Fee)}</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{color: '#d80100'}}>赠送</Text>
                                <Image source={require('../../Resources/bean.png')} style={{height: 16, width: 16}}/>
                                <Text style={{color: '#d80100'}}>&nbsp;{method.numberFormat(matchData.FreeBean)}</Text>
                            </View>
                        </View>
                    </View>,
                    () => this.buyGuess({analysisNo: matchData.AnalysisNo, fee: matchData.Fee}, Data),
                    () => {
                    },
                    '立即查看'
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

    analysisList = () => {
        const {navigate} = this.props.navigation;
        const {isLoggedIn} = this.props.loginStore;
        if (this.state.GuessList.length) {
            return (
                this.state.GuessList.map((Item, index) =>
                    <AnalysisItem
                        data={Item}
                        key={index}
                        onCheck={() => this.isShowAlert(isLoggedIn, Item)}
                    />
                )
            )
        } else {
            return (<View style={{
                marginTop: 20,
                marginBottom: 4,
                alignItems: 'center',
                justifyContent: 'center'
            }}><Text>暂无新数据</Text></View>)
        }
    }

    changeRank = (index) => {
        this.setState({rankType: index});
        this.GetRankList(index);
    }

    renderRankHeader = () => {
        let params = {
            buttonList: [
                {
                    name: "连红榜",
                    onPress: this.changeRank,
                },
                {
                    name: "胜率榜",
                    onPress: this.changeRank
                }
            ],
            help: () => {
                this.showWebViewTab(1);
            },
            more: () => {
                this.props.navigation.navigate("Rank", {type: this.state.rankType})
            },
            selectIndex: this.state.rankType
        }
        return this._renderHeader(params);
    }

    renderAnalysisHeader = () => {
        let params = {
            buttonList: [
                {
                    name: "众猜解盘",
                    onPress: () => {
                    },
                }
            ],
            help: () => {
                this.showWebViewTab(0);
            },
            more: () => {
                this.props.navigation.navigate("Analysis")
            },
            selectIndex: 0
        }
        return this._renderHeader(params);
    }

    _renderHeader = (params) => {
        return (
            <Header params={params}/>
        )
    }

    render() {
        const {navigate} = this.props.navigation;
        let WebView = this.WebView;
        let Alert = this.Alert;
        return (
            <View style={this.style.container}>
                <StatusBar/>
                <PullView style={{flex: 1, backgroundColor: '#F0EFF5'}}
                          onPullRelease={this.onPullRelease.bind(this)}
                          enableEmptySections={true}
                >
                    <View style={{marginBottom: 16}}>
                        {this.renderAnalysisHeader()}
                        {this.analysisList()}
                    </View>

                    <View>
                        {this.renderRankHeader()}
                        {this.rankList()}
                    </View>
                    <WebView ref={(refWebView) => {
                        this.webview = refWebView
                    }}/>
                    <Alert ref={(refAlert) => {
                        this.alert = refAlert
                    }}/>
                </PullView>
            </View>

        );
    }
}

const mapStateToProps = state => ({
    loginStore: state.loginStore
});

const mapDispatchToProps = dispatch => ({
    // ...bindActionCreators(tabbarAction,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Recommend);

const styles = StyleSheet.create({});
