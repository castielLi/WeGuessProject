/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    ActivityIndicator,
    View,
    Text,
    StyleSheet,
    ListView,
    Image,
    Platform,
    Linking
} from 'react-native';
import {
    connect
} from 'react-redux';

import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import {BackButton, BlankButton} from "../../Component/BackButton";
import method from '../../TabRecommend/common/method';

import {GetAllAnalysis, GetMemberInfo, BuyAnalysis, PayUrl} from '../../Config/apiUrlConfig';
import ListViewPull from '../../TabRecommend/common/listViewPull';
import AnalysisItem from '../../TabRecommend/common/analysisItem';

class Analysis extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: "众猜解盘",
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
        this.state = {
            DataSource: ds,
            isLoading: 0,//0：隐藏foot  1：已加载完成   2 ：加载中
            PageIndex: 1,
            isInit: true
        };
        this.data = [];
    }

    componentDidMount() {
        let that = this;
        this.fetchData(true).then(() => {
            that.setState({isInit: false});
        }, (error) => {
            that.setState({isInit: false});
        }).catch(function (error) {
            that.setState({isInit: false});
        });
    }

    fetchData = (isRefresh) => {
        let pageIndex = 1;
        if (isRefresh) {
            this.setState({pageIndex: 1});
        } else {
            this.setState({isLoading: 2});
            pageIndex = this.state.pageIndex;
        }
        let params = {
            PageIndex: pageIndex,
            PageSize: 10,
        };
        let that = this;
        return new Promise((resolve, reject) => {
            this.networking.get(GetAllAnalysis, params, {}).then((responseData) => {
                let {Result, Data} = responseData;
                if (Result === 1) {
                    if (isRefresh) {
                        that.data = [];
                    }
                    // 拼接数据
                    that.data = that.data.concat(Data);
                    if (Data.length < 10) {
                        that.setState({isLoading: 1});
                    }
                    else {
                        that.setState({isLoading: 0});
                    }
                    that.setState({
                        pageIndex: that.state.pageIndex + 1,
                        DataSource: that.state.DataSource.cloneWithRows(that.data),
                    });
                    resolve();
                } else {
                    that.setState({isLoading: 0});
                    that.showError(Result);
                    reject(Result);
                }
            }, (error) => {
                this.showError(error)
            }).catch((error) => {
                that.showError(error);

                throw error;
            })
        })
    };

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
                    '立即充值'
                )
            }
            else if (Result === 1) {
                navigate("AnalysisDetail", {AnalysisNo: params.analysisNo, callback: () => this.onPullRelease()})
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

    loadMore() {
        if (this.state.isLoading !== 0) {
            return;
        }
        this.fetchData();
    }

    RankItem(Item, sectionId, ItemId, highlightRow) {
        const {navigate} = this.props.navigation;
        const {isLoggedIn} = this.props.loginStore;
        return (
            <AnalysisItem
                key={ItemId}
                data={Item}
                onCheck={() => this.isShowAlert(isLoggedIn, Item)}
                onJump={() => navigate("AnalysisDetail", {
                    AnalysisNo: Item.AnalysisNo,
                    callback: () => this.onPullRelease()
                })
                }/>
        )

    }

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

    onButtonPress = () => {
        this.props.navigation.navigate("Login");
    }


    render() {
        let Alert = this.Alert;
        return (
            <View style={styles.container}>
                {this.data.length > 0 ? (
                    <ListViewPull
                        pageSize={10}
                        initialListSize={10}
                        onPullRelease={this.onPullRelease.bind(this)}
                        onEndReached={this.loadMore.bind(this)}
                        dataSource={this.state.DataSource}
                        renderRow={this.RankItem.bind(this)}
                        style={{backgroundColor: '#F0EFF5'}}
                        isLoading={this.state.isLoading}
                    />
                ) : (
                    <View style={styles.nodata}>
                        {this.state.isInit ? (<ActivityIndicator size="large" color="#3a66b3"/>) : (<Text>暂无新数据</Text>)}
                    </View
                    >)}
                <Alert ref={(refAlert) => {
                    this.alert = refAlert
                }}></Alert>
            </View>
        );

    }
}


const mapStateToProps = state => ({
    loginStore: state.loginStore
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch({type: 'Logout'}),
});

export default connect(mapStateToProps, mapDispatchToProps)(Analysis);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    nodata: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center'
    }
});