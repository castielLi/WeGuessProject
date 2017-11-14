/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView
} from 'react-native';
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import {BackButton, BlankButton} from "../../Component/BackButton";
import {GetGoldBalanceLogsUrl, GetBeanBalanceLogsUrl} from '../../Config/apiUrlConfig';
import RecordList from './recordList';
import TabView from '../../Component/TabView';

class MoneyRecord extends ContainerComponent {

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: "账目明细",
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
            dataSourceGold: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            dataSourceBean: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            getType: 0,   //0,获取钻石明细 1,获取猜豆明细
            logIDGold: 0,
            logIDBean: 0,
            isLoadingGold: 0,//0，未加载，1，正在加载，2无更多数据
            isLoadingBean: 0,//0，未加载，1，正在加载，2无更多数据
        }
        this.dataListGold = []; //获取数据
        this.dataListBean = []; //获取数据
        this.loadMore = this.loadMore.bind(this);
        this.onPullRelease = this.onPullRelease.bind(this);
        this.tabList = ["钻石明细", "猜豆明细"];
    }

    componentDidMount() {
        this.fetchData(null, 0, 0, true);
        this.fetchData(null, 1, 0, true);
    }

    //列表数据显示
    content() {
        if (this.state.getType == 0) {
            return (
                <RecordList
                    onPullRelease={this.onPullRelease}
                    onEndReached={this.loadMore}
                    dataSource={this.state.dataSourceGold}
                    dataList={this.dataListGold}
                    type={0}
                >
                </RecordList>
            )
        } else {
            return (
                <RecordList
                    onPullRelease={this.onPullRelease}
                    onEndReached={this.loadMore}
                    dataSource={this.state.dataSourceBean}
                    dataList={this.dataListBean}
                    type={1}
                >
                </RecordList>
            )
        }
    }

    changeBalanceType(index) {
        this.setState({getType: index});
    }


    //下拉刷新
    onPullRelease(resolve, index) {
        let that = this;
        let logID = 0
        if (index == 0 && this.state.isLoadingGold !== 1) {
            this.setState({logIDGold: 0, isLoadingGold: 1, getType: index}, () => {
                that.fetchData(resolve, 0, 0, true);
            });

        } else if (index == 1 && this.state.isLoadingBean !== 1) {
            this.setState({logIDBean: 0, isLoadingBean: 1, getType: index}, () => {
                that.fetchData(resolve, 1, 0, true);
            });
        } else {
            if (typeof resolve == "function") {
                resolve();
            }
        }
    }

    //上拉加载更多
    loadMore() {
        let logID = 0;
        if (this.state.getType == 0) {
            if (this.state.isLoadingGold == 2) {
                return;
            } else {
                logID = this.state.logIDGold
            }
        } else if (this.state.getType == 1) {
            if (this.state.isLoadingBean == 2) {
                return;
            } else {
                logID = this.state.logIDBean
            }
        }
        this.fetchData(null, this.state.getType, logID);
    }

    fetchData = (resolve, type, logID, isRefresh = false) => {
        let that = this;
        let params = {
            Desc: true,
            PageSize: 20,
            LogID: logID
        }
        let url = type === 0 ? GetGoldBalanceLogsUrl : GetBeanBalanceLogsUrl;
        this.networking.post(url, params, {}).then(function (data) {
            let {Result, Data} = data;
            if (type == 0) {
                if (isRefresh) {
                    that.dataListGold = [];
                }
                if (Result == 1) {
                    if (Data) {
                        that.dataListGold = that.dataListGold.concat(Data);
                    }
                    if (!Data || Data.length < 20) {
                        that.setState({
                            dataSourceGold: that.state.dataSourceGold.cloneWithRows(that.dataListGold),
                            isLoadingGold: 2
                        });
                    } else {
                        that.setState({
                            dataSourceGold: that.state.dataSourceGold.cloneWithRows(that.dataListGold),
                            isLoadingGold: 0,
                            logIDGold: Data[Data.length - 1].ID
                        });
                    }
                } else {
                    that.setState({isLoadingGold: 0}, () => {
                        that.showError(Result);
                    });
                }
            } else {
                if (isRefresh) {
                    that.dataListBean = [];
                }
                if (Result == 1) {
                    if (Data) {
                        that.dataListBean = that.dataListBean.concat(Data);
                    }
                    if (!Data || Data.length < 20) {
                        that.setState({
                            dataSourceBean: that.state.dataSourceBean.cloneWithRows(that.dataListBean),
                            isLoadingBean: 2
                        });
                    } else {
                        that.setState({
                            dataSourceBean: that.state.dataSourceBean.cloneWithRows(that.dataListBean),
                            isLoadingBean: 0,
                            logIDBean: Data[Data.length - 1].ID
                        });
                    }
                } else {
                    that.setState({isLoadingBean: 0},()=>{
                        that.showError(Result);
                    });
                }
            }
            if (typeof resolve == "function") {
                resolve();
            }
        }, (error) => {
            this.showError(error)
        }).catch((error) => {
            if (typeof resolve == "function") {
                resolve();
            }
            this.showError(error);
        });
    }

    changeType = (index) => {
        if (index === 0) {
            this.changeBalanceType(0)
        } else {
            this.changeBalanceType(1)
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <TabView tabList={this.tabList} onPress={this.changeType}></TabView>
                <View style={styles.stateTop}>
                    <Text style={[styles.stateTopLi, {width: 160}]}>时间</Text>
                    <Text style={styles.stateTopLi}>项目</Text>
                    <Text style={[styles.stateTopLi, {paddingRight: 10, textAlign: 'right'}]}>收支</Text>
                </View>
                {this.content()}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    stateTop: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: '#3a66b3',
        alignItems: 'center',
    },
    stateTopLi: {
        color: '#fff',
        flex: 1,
        textAlign: 'center',
        fontSize: 16
    },
})

export default MoneyRecord;