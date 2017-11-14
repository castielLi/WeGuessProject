/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Text,
    View,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import {GetOddsByLive} from '../../Config/apiUrlConfig';
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import tools from '../../Utils/sportTool';
import HandleData from '../../Utils/sportHandle';
import config from '../../Utils/sportConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import BackgroundTimer from 'react-native-background-timer';
let {width, height} = Dimensions.get('window');
class Live extends ContainerComponent {

    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.state = {
            UpdateTime: "",
            data: [],
            SportId: this.props.SportId,
            changeList: {},
        }
        this.timer
        this.fetchData = this.fetchData.bind(this);
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

fetchData(sportId = this.props.sportId, refresh, callback) {
         this.setState({
               showLoading:true
           })
        let that = this;
        let params = {
            SportId: sportId,
            UpdateTime: "",
            isMix: false,
        }
        this.networking.get(GetOddsByLive, params, {}).then((responseData) => {
            let {Success, Data, ErrorMsg} = responseData;
            if(Success && Data){
                if (refresh) {
                    if (typeof (callback) == "function") callback(Data);
                    } else {
                        this.setState({
                            data: Data,
                            UpdateTime: Data.T
                        });
                        that.refreshData();
                    }
            }else{
               that.showAlert("提示", ErrorMsg);
            }
            this.setState({
               showLoading:false
           })

        }, (error) => {
            this.setState({
                showLoading:false,
            })
            this.showError(error);
        }).catch((error) => {
            this.setState({
                showLoading:false,
            })
            this.showError(error);
        });
    }

    fetchRefreshData(sportId = this.props.sportId, refresh, callback) {
        let that = this;
        let params = {
            SportId: sportId,
            UpdateTime: "",
            isMix: false,
        }
        this.networking.get(GetOddsByLive, params, {}).then((responseData) => {
            let {Success, Data, ErrorMsg} = responseData;
            if(Success && Data){
                if (refresh) {
                        if (typeof (callback) == "function") callback(Data);
                } else {
                        this.setState({
                            UpdateTime: Data.T
                        });
                }
            }

        },(error)=>{
            if(error!=-2){
               this.showError(error);
            }
        }).catch((error) => {
            
            this.showError(error);
        });
    }

    //刷新盘口数据
    refreshData = (data) => {
        var that = this;
        this.timer = BackgroundTimer.setInterval(() => {
            that.fetchRefreshData(sportId = that.props.sportId, true, (data) => {
                that.CompareChange(data);
            });
        }, 30000);

    }
    //获取盘口变更
    CompareChange = (newdata) => {
        this.setState({
            changeList: HandleData.CompareChange(this.state.data, newdata),
            data: newdata,
        })
    }
    goMatch = (params) => {
        this.props.navigation.navigate("SportMatch", {matchId: params});
    }
    initBet = (betodd, betpos, couid, matchid, marketid) => {
        if (betodd == 0) {
            return;
        }
        let selectBetItem = "{0}-{1}-{2}-{3}".format(matchid, marketid, 0, betpos);
        //投注参数未确定
        var params = {
            betOdds: betodd,
            betPos: betpos,
            couid: couid,
            matchId: matchid,
            marketId: marketid
        }
        this.props.initBet(false, params);
    }
    //计算赔率变更0:无变更,1上升,2下降
    OddChange = (matchid, maketid, index, betpos) => {
        var key = "{0}-{1}-{2}-{3}".format(matchid, maketid, index, betpos);
        if (this.state.changeList.hasOwnProperty(key)){ 
            let flag = this.state.changeList[key];
            if (flag == 1) {
              return (<Image style={{marginTop:8,height:33,width:14}} source={require('../resource/icon_09.png')}/>);
            } else if (flag == 2) {
              return (<Image style={{marginTop:8,height:33,width:14}} source={require('../resource/icon_06.png')}/>);
        } else {
            return null;
        }};
       return null;
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
    FO = (odds) => {
        return HandleData.FormatOdds(odds);
    }
    GetLiveTime = (sportId, phase, livetime) => {
        return HandleData.ComputeLiveTime(1, phase, livetime);
    }
    HasOwnProperty = (object, key)=>{
                if (object && object[key] && object[key].length != null && object[key].length == 0) {
                    return false;
                }
                if (object && object.hasOwnProperty(key) && object[key] != null) {
                    return true;
                }
                return false;
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
        let {MH, LG} = this.state.data;
        return (
            <View style={styles.body}>
               <ScrollView>
                 {this.state.showLoading?(<View style={{flex:1,backgroundColor:"#fff",justifyContent:"center",marginTop:(height-148)*0.5}}>
                              <ActivityIndicator
                                    color="#3a67b3"
                                    style={[styles.centering, {height: 80}]}
                                    size="large"
                                />
                    </View>):
                    MH ? (
                        MH.map((match, index) => {
                            return (
                                <View style={styles.item} key={index}>

                                    <View style={styles.title}>
                                        <Text style={[styles.league]}>
                                            {LG[match.M[2]].LN}
                                        </Text>
                                        <Text style={[styles.letBall]}>
                                            全场让球
                                        </Text>
                                        <Text style={styles.bigBall}>
                                            全场大小
                                        </Text>
                                    </View>

                                    <View style={styles.detail}>

                                        <TouchableOpacity style={styles.team} onPress={() => {
                                            this.goMatch(match.MatchID)
                                        }}>
                                            <View style={styles.teamOne}>
                                                <View style={{flexDirection:"row"}}>
                                                    <Text style={{fontSize: 14, color: "#333"}}>
                                                        {match.M[4]}
                                                    </Text>
                                                     {
                                                           match.ML[4]>0?(<View style={{justifyContent:"center",alignItems:"center",height:14,marginTop:3,backgroundColor:"#d80204",borderRadius:2}}><Text style={{color:"#fff"}}>{match.ML[4]}</Text></View>):null 
                                                     }
                                                </View>
                                                    <Text style={{fontSize: 14, color: 'green',marginRight:12}}>
                                                        {match.ML[2]}
                                                    </Text>
                                                
                        
                                            </View>
                                            <View style={[styles.teamOne, {height: 20},]}>
                                                <Text style={{color: '#ff5b06'}}>
                                                    {this.GetLiveTime(this.state.sportId, match.ML[0], match.ML[1])}
                                                </Text>

                                                <Icon name="ios-arrow-forward" color="#cbcbcb" size={24}/>

                                            </View>
                                            <View style={styles.teamOne}>
                                                <View style={{flexDirection:"row"}}>
                                                        <Text style={{fontSize: 14, color: "#333"}}>
                                                            {match.M[6]}
                                                        </Text>
                                                        {
                                                           match.ML[5]>0?(<View style={{justifyContent:"center",alignItems:"center",height:14,marginTop:3,backgroundColor:"#d80204",borderRadius:2}}><Text style={{color:"#fff"}}>{match.ML[5]}</Text></View>):null 
                                                        }
                                                         
                                                </View>
                                                <Text style={{fontSize: 14, color: 'green',marginRight:12}}>
                                                    {match.ML[3]}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>


                                        <View style={[styles.detailLetBall]}>
                                            {
                                                this.HasOwnProperty(match.MK,1)?(
                                                    <TouchableOpacity  style={styles.topText} onPress={() => {
                                                        this.initBet(match.MK[1][0][1], 1, match.MK[1][0][0], match.MatchID, 1)
                                                    }}>
                                                        <Text style={{fontSize: 14,}}>
                                                            {this.HdpH(match.MK["1"][0][3])}
                                                        </Text>
                                                        <Text style={{fontSize: 14, color: '#ff5b06'}}>
                                                            {this.FO(match.MK["1"][0][1])}
                                                            {this.OddChange(match.MatchID,1,0,1)}
                                                        </Text>
                                                    
                                                    </TouchableOpacity>):null
                                            }
                                            {
                                                this.HasOwnProperty(match.MK,1)?(
                                                    <TouchableOpacity style={styles.botText} onPress={() => {
                                                        this.initBet(match.MK[1][0][2], 2, match.MK[1][0][0], match.MatchID, 1)
                                                    }}>
                                                        <Text style={{fontSize: 14,}}>
                                                            {this.HdpA(match.MK["1"][0][3])}
                                                        </Text>
                                                        <Text style={{fontSize: 14, color: '#ff5b06'}}>
                                                            {this.FO(match.MK["1"][0][2])}
                                                            {this.OddChange(match.MatchID,1,0,2)}
                                                        </Text>
                                                    
                                                    </TouchableOpacity>):null
                                            }
                                        </View>


                                        <View style={styles.detailBigBall}>
                                            {
                                                this.HasOwnProperty(match.MK,3)?(
                                                    <TouchableOpacity style={styles.topText} onPress={() => {
                                                        this.initBet(match.MK[3][0][1], 1, match.MK[3][0][0], match.MatchID, 3)
                                                    }}>
                                                        <Text>
                                                            大{this.Hdp(match.MK["3"][0][3])}
                                                        </Text>
                                                        <Text style={{color: '#ff5b06'}}>
                                                            {this.FO(match.MK["3"][0][1])}
                                                            {this.OddChange(match.MatchID,3,0,1)}
                                                        </Text>
                                                    </TouchableOpacity>):null
                                            }
                                            {
                                                this.HasOwnProperty(match.MK,3)?(
                                                    <TouchableOpacity style={styles.botText} onPress={() => {
                                                        this.initBet(match.MK[3][0][2], 2, match.MK[3][0][0], match.MatchID, 3)
                                                    }}>
                                                        <Text style={{textAlign: 'center'}}>
                                                            小{this.Hdp(match.MK["3"][0][3])}
                                                        </Text>
                                                        <Text style={{color: '#ff5b06'}}>
                                                            {this.FO(match.MK["3"][0][2])}
                                                            {this.OddChange(match.MatchID,3,0,2)}
                                                        </Text>
                                                    </TouchableOpacity>):null
                                            }
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    ) : (<View style={{alignItems: "center", marginTop: 200}}><Text>暂无数据</Text></View>)

                }

                </ScrollView>
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
    //...bindActionCreators(tabbarAction,dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Live);
const styles = StyleSheet.create({
    body: {
        flex:1,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#eee',
    },
    league: {
        flex: 4,
    },
    letBall: {
        flex: 3,
        textAlign: 'center',
    },
    bigBall: {
        flex: 3,
        textAlign: 'center',
    },
    detail: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    team: {
        flex: 4,
        paddingLeft: 10,
        paddingRight: 10,
    },
    teamOne: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 30,
        alignItems: "center"
    },
    teamTime: {
        flexDirection: 'row',
    },
    detailLetBall: {
        flex: 3,
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    detailBigBall: {
        flex: 3,
    },
    topText: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
    },
    botText: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
    },
    Color_333: {
        color: "#333",
    }
});
