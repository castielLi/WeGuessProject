/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
    Component
} from 'react';
import {
    AppRegistry,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ListView,
    Text,
    View,
    ActivityIndicator
} from 'react-native';

import {
    connect
} from 'react-redux';
import {
    GetTimeLeague
} from "../../Config/apiUrlConfig"
import HTTPBase from '../network/http.js';
import Networking from '../../../Core/WGNetworking/Network.js';
import * as methods from '../method'
import BackgroundTimer from 'react-native-background-timer';
import ContainerComponent from '../../.././Core/Component/ContainerComponent'

const Dimensions = require('Dimensions');
const ScreenHeight = Dimensions.get('window').height;
class LeagueResult extends ContainerComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentDate: '',
            dateList: '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
            showLoading:false,
        }
        this.timer = null;
        this.fetchData = this.fetchData.bind(this);
        this.networking = Networking.getInstance();
        this.liveTime = this.liveTime.bind(this);
    }

 componentWillUnmount() {
        if (this.timer) {
            BackgroundTimer.clearInterval(this.timer);
        }
    } 

    liveTime(sid, ph, lt) {

        return methods.ComputeLiveTime(1, ph, lt)
    }
   SelectMatch=(mid)=>{
        this.props.SelectMatch(mid)
   }

    //网络请求
    fetchData() {
        this.setState({
                showLoading:true
            })
        let params = {
            "SportId": 1,
        };
        let that = this;
        that.refreshData();
        this.networking.get(GetTimeLeague, params, {}).then((responseData) => {
            this.setState({
                showLoading:false
            })
                // 清空数组
            if (responseData.Data.length<=0) {
                    return;
            } else {
                this.setState({
                    data: responseData.Data,
                    dataSource:this.state.dataSource.cloneWithRows(responseData.Data)
                    //isload: true,
                    // isHiddenFooter: true
                });
            }
        },(error)=>{
            this.setState({
                showLoading:false
            })
            this.showError(error);
        }).catch((error) => {
            this.setState({
                showLoading:false
            })
            this.showError(error);
        })
    }

    fetchRefreshData() {
        let params = {
            "SportId": 1,
        };
        let that = this;
        this.networking.get(GetTimeLeague, params, {}).then((responseData) => {
                // 清空数组
            if (responseData.Data.length<=0) {
                    return;
            } else {
                this.setState({
                    data: responseData.Data,
                    dataSource:this.state.dataSource.cloneWithRows(responseData.Data)
                    //isload: true,
                    // isHiddenFooter: true
                });
            }
        },(error)=>{
            if(error!=-2){
               this.showError(error);
            }
        }).catch((error) => {

           this.showError(error);
        })
    }

    //刷新盘口数据
    refreshData = () => {
        var that = this;
        this.timer = BackgroundTimer.setInterval(() => {
            that.fetchRefreshData();
        }, 30000);

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
        return (
            
            <View style={styles.body}>
                {this.state.showLoading?(<View style={{backgroundColor:"#fff",justifyContent:"center",height: ScreenHeight - 108}}>
                              <ActivityIndicator
                                    color="#3a67b3"
                                    style={[styles.centering, {height: 80}]}
                                    size="large"
                                />
                    </View>):
                    this.state.dataSource.rowIdentities.length>0?(
                        <View style={styles.wraper}>
                                <ListView
                                    initialListSize = {10}
                                    pageSize = {1}
                                    dataSource={this.state.dataSource}
                                    renderRow={this.renderRow.bind(this)}
                                />
                        </View>):(<View style={{alignItems:"center",marginTop:200}}><Text>暂无数据</Text></View>)
                }
                
            </View>
        );
    }

    renderRow(rowData, sectionID, rowID) {
        const time = this.liveTime(rowData.SID, rowData.PH, rowData.LT);
        return (
           <TouchableOpacity onPress={()=>{this.SelectMatch(rowData.MID)}}>
            <View style={[styles.item, {backgroundColor: rowID % 2 == 0 ? "#ededed" : "#f7f7f7"}]}>
                <View style={styles.league}>
                    <Text numberOfLines={1} style={{flex: 1, textAlign: 'center', paddingTop: 10, color: 'grey'}}>{rowData.LN}</Text>
                    <Text style={{flex: 1, textAlign: 'center', color: '#ff5b06'}}>{time}</Text>
                </View>
                <View style={styles.team}>
                    <View style={{flex:3,flexDirection:"row",justifyContent:"flex-end"}}>
                        {rowData.HC>0?(<View style={{justifyContent:"center",alignItems:"center",height:14,marginTop:3,backgroundColor:"#d80204",borderRadius:2}}><Text style={{color:"#fff"}}>{rowData.HC}</Text></View>):null}
                        <Text style={{color: '#000'}}> {rowData.HN}</Text> 
                    </View>
                    <View style={{flex: 1,}}>
                        <Text style={{textAlign: 'center', fontSize: 12}}>({rowData.HSH}-{rowData.ASH})</Text>

                        <Text style={{
                            textAlign: 'center',
                            color: 'green',
                            fontSize: 14,
                            fontWeight: '500'
                        }}>{rowData.HS}-{rowData.AS}</Text>
                    </View>
                     <View style={{flex:3,flexDirection:"row",justifyContent:"flex-start"}}>
                        <Text style={{color: '#000'}}>{rowData.AN} </Text>
                        {rowData.AC>0?(<View style={{justifyContent:"center",alignItems:"center",height:14,marginTop:3,backgroundColor:"#d80204",borderRadius:2}}><Text style={{color:"#fff"}}>{rowData.AC}</Text></View>):null} 
                    </View>
                    
                </View>
            </View>
          </TouchableOpacity>
        );
    }
}

const mapStateToProps = state => ({
    loginStore: state.loginStore,
});

const mapDispatchToProps = dispatch => ({
    // ...bindActionCreators(tabbarAction,dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(LeagueResult);

const styles = StyleSheet.create({
    body: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    wraper: {
        height: ScreenHeight - 108
    },
    item: {
        flexDirection: 'row',
        height: 70,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    league: {
        height: 67,
        justifyContent: 'center',
        flex: 1
    },
    team: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 5,
        justifyContent: 'space-between',

    },
});