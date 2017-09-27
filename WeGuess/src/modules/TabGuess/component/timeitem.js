/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    Alert,
    StyleSheet,
    Text,
    View,
    Platform,
    Dimensions
} from 'react-native';
import {connect} from 'react-redux';
import HTTPBase from '../network/http.js';
import Networking from '../../../Core/WGNetworking/Network.js';
import ContainerComponent from '../../.././Core/Component/ContainerComponent'
import LeftItem from './leftitem'
import RightItem from './rightitem'
import {GetOddsByTime} from '../../Config/apiUrlConfig';
import BackgroundTimer from 'react-native-background-timer';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


class TimeItem extends ContainerComponent {

    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.state = {
            gameType: 0,
            data: [],
            matchList: [],
            currentIndex: 0,
        };
        this.timer=null;
        this.fetchData = this.fetchData.bind(this);
        this.networking = Networking.getInstance();
        this.changeIndex = this.changeIndex.bind(this);
        this.goMatch = this.goMatch.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.sportId !== this.props.sportId) {
            this.fetchData(newProps.sportId);
        }
    }
    componentWillUnmount() {
        if (this.timer) {
            BackgroundTimer.clearInterval(this.timer);
        }
    }  

    changeIndex(index) {
        this.setState({
            matchList: this.state.data[index].MList,
            currentIndex:index
        });
    }

    goMatch = (params) => {
        this.props.navigation.navigate("SportMatch", {matchId: params.MID});
    }
    //网络请求
    fetchData(sportId = this.props.sportId) {
        this.showLoading();
        let params = {
            "SportId": sportId,
        };
        this.refreshData();
        this.networking.get(GetOddsByTime, params, {}).then((responseData) => {
            this.hideLoading();
            if (responseData.Data.length <= 0) {
                this.setState({
                    data: responseData.Data,
                })
                return;
            }
            this.setState({
                data: responseData.Data,
                matchList: responseData.Data[0].MList
            });

        }, (error) => {
            this.hideLoading();
            this.showError(error);
        }).catch((error) => {
            this.hideLoading();
            this.showError(error);
        })
    }
    fetchRefreshData=(sportId = this.props.sportId)=>{
        let params = {
            "SportId": sportId,
        };
        this.networking.get(GetOddsByTime, params, {}).then((responseData) => {
            this.hideLoading();
            if (responseData.Data.length <= 0) {
                this.setState({
                    data: responseData.Data,
                })
                return;
            }
            this.setState({
                data: responseData.Data,
                matchList: responseData.Data[this.state.currentIndex].MList
            });

        }, (error) => {

            this.hideLoading();
            this.showError(error);
        }).catch((error) => {
            this.hideLoading();

            this.showError(error);
        })
    }
    //刷新盘口数据
    refreshData = () => {
        var that = this;
        this.timer = BackgroundTimer.setInterval(() => {
            that.fetchRefreshData(sportId = that.props.sportId);
        }, 10000);

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
            this.fetchData();
        }
    }

    render() {
        let Alert = this.Alert;
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                {this.state.data.length > 0 ? (<View style={styles.body}>
                    <LeftItem data={this.state.data} kind='1' changeIndex={(index) => {
                        this.changeIndex(index)
                    }}></LeftItem>
                    <RightItem currentIndex={this.state.currentIndex} kind='1' goMatch={this.goMatch} matchList={this.state.matchList}></RightItem>

                </View>) : (
                    <View style={{
                        alignItems: "center",
                        paddingTop: 200,
                        borderTopColor: "#ccc",
                        borderTopWidth: 1
                    }}><Text>暂无数据</Text></View>
                )}
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
    // ...bindActionCreators(tabbarAction,dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(TimeItem);


const styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    container:{
        height:height-148
    }
    
});
