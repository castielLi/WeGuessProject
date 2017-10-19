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
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    View,
    ScrollView,
    Dimensions,
    Platform,
    ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux';
import {GetOddsByMix} from '../../Config/apiUrlConfig';
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import HandleData from '../../Utils/sportHandle';
import config from '../../Utils/sportConfig';
import Screen from '../method/index';
import tools from '../../Utils/sportTool';
import BetPanel from '../../SportBet/betPane';
import Icon from 'react-native-vector-icons/Ionicons';
import ExtendText from '../../Component/ExtendText';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
class Mix extends ContainerComponent {

    // 初始化模拟数据
    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                return r1 !== r2;
            }
        });
        this.mixData = [];//分页数据
        this.allData = [];//全部数据
        this.dataLen = 30;
        this.state = {
            sportId: 1,//运动种类
            updateTime: "",//请求时间
            LG: [],//联赛列表
            dataSource: ds,
            betList: [],
            selectBetitem: "",
            selected: [],
            isShowBet: false,
            listViewData: [],
            hideBetMsg: this.props.hideBetMsg,

        }
        this.selectMatchIndex={};

        this.fetchData = this.fetchData.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if(newProps.removeIndex !== this.props.removeIndex){
            let index = newProps.removeIndex.split("-")[0],
                matchId = newProps.removeIndex.split("-")[1];
       
            let {betList,selected} = this.state;
            betList.splice(index,1);
            selected.splice(index,1);

            this.setState({
                betList:betList,
                selected:selected,
            })
            let listIndex = this.selectMatchIndex[matchId];
            if(listIndex!=null&&listIndex!=undefined){
            this.mixChangeShow(listIndex, false);
            }
        }
        if (newProps.hideBetMsg) {
            this.setState({
                betList: [],
                selected: [],
            })
        }

        if (newProps.sportId !== this.props.sportId) {
             this.fetchData(newProps.sportId);
        }

    }

    showBetpanel = () => {
        this.setState({
            isShowBet: true,
            betList: [],
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
    ChangeShow = (id) => {

        let arr = this.state.listViewData;
        arr[id].show = !arr[id].show;
        this.setState({
            listViewData: arr
        })


    }

    bgColor = (matchId, marketId, k, j) => {
        let betItem = matchId + "-" + marketId + "-" + k + "-" + j;
        return this.state.selected.indexOf(betItem) >= 0;
    }
    //点击选择比赛
    assmbleBet = (betodd, betpos, couid, matchid, marketid, index) => {
        let arrBet = this.state.betList;
        let arrSelect = this.state.selected;
        let selectBetItem = matchid + "-" + marketid + "-0-" + betpos;
        if (betodd == 0) {
            return;
        }
        var length = arrBet.length;
        //重复点击消除
        var idx = arrSelect.indexOf(selectBetItem);
        if (idx >= 0) {
            for (var j = length - 1; j >= 0; j--) {
                if (arrBet[j].matchId == matchid) {
                    arrBet.splice(j, 1);
                    arrSelect.splice(j, 1);
                    this.selectMatchIndex[matchid] = null;
                }
            }

            this.setState({
                betList: arrBet,
                selected: arrSelect
            });
            this.mixChangeShow(index, false);

            return;
        }

        if (length >= 10) { //最多投注10局
            this.showAlert("提示", "最多选择10场比赛,请取消一些选择后再试");
            return;
        }


        var params = {
            betOdds: betodd,
            betPos: betpos,
            couid: couid,
            matchId: matchid,
            marketId: marketid,
        }

        for (var i = length - 1; i >= 0; i--) {
            if (arrBet[i].matchId == params.matchId) {
                arrBet[i] = params;
                arrSelect[i] = selectBetItem;
                this.setState({
                    betList: arrBet,
                    selected: arrSelect
                });
                this.mixChangeShow(index, false);
                return;
            }
        }
        arrBet.push(params);
        arrSelect.push(selectBetItem);
        this.setState({
            betList: arrBet,
            selected: arrSelect
        })
        this.mixChangeShow(index, false);
        this.selectMatchIndex[matchid] = index;
    }
    IsSelected = (sid) => {
        return this.state.selected.indexOf(sid) >= 0;
    }

    //点击按钮打开投注界面
    initBet = () => {
        if (this.state.betList == null || this.state.betList.length < 2) {
            this.showAlert("提示", "不能少于两场比赛");
            return;
        }
        var params = {
            mixBets: encodeURI(JSON.stringify(this.state.betList)),
            mpId: config.MpIDs[this.state.betList.length - 2]
        }
        this.props.initBet(true, params)
    }

    fetchData(sportId=this.props.sportId) {
         this.setState({
                showLoading:true
            })
        let params = {
            SportId: sportId,
            UpdateTime: this.state.updateTime,
            isMix: true,
        }
        this.networking.get(GetOddsByMix, params).then((responseData) => {
             this.setState({
                showLoading:false
            })
            if (responseData.Data.MH == null) {
                this.setState({
                    listViewData:[],
                })
                return;
            } else {
                let data = responseData.Data, mh = data.MH, arr = [],length=mh.length;
                for (let i = 0; i < length; i++) {
                    Object.assign(mh[i], {show: false});
                }
                this.allData = mh;
                this.mixData = this.mixData.concat(this.allData.splice(0,30));

                this.setState({
                    listViewData: [...mh],
                    LG: data.LG,
                    updateTime: data.T,
                    dataSource: this.state.dataSource.cloneWithRows(this.mixData)
                })
            }
        }, (error) => {
            this.setState({
                showLoading:false,
            })
            this.showError(error);
        }).catch((error) => {
            this.setState({
                showLoading:false,
            })
            this.showError(0);
        });
    }
    loadMOre = ()=>{
        if(this.allData.length > 0){
                if(this.allData.length<=30){
                            this.mixData = this.mixData.concat(this.allData.splice(0,this.allData.length));
                }else{
                            this.mixData = this.mixData.concat(this.allData.splice(0,30));
                }
        }else{
            return;
        }
        this.setState({	
            dataSource: this.state.dataSource.cloneWithRows(this.mixData)
        });
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
            <View style={styles.body}>
                 {this.state.showLoading?(<View style={{flex:1,backgroundColor:"#fff",justifyContent:"center"}}>
                              <ActivityIndicator
                                    color="#3a67b3"
                                    style={[styles.centering, {height: 80}]}
                                    size="large"
                                />
                    </View>):
                    this.state.listViewData.length>0?(
                         
                            <ListView
                                onEndReachedThreshold = {6}
                                onEndReached = {()=>{this.loadMOre()}}
                                initialListSize = {10}
                                pageSize = {1}
                                extraData={this.state}
                                dataSource={this.state.dataSource}
                                renderRow={this.renderRow.bind(this)}
                            />
                    
                    ):(<View style={{alignItems:"center",paddingTop:200,borderTopColor:"#ccc",borderTopWidth:1}}><Text>暂无数据</Text></View>)
                }
               
                {
                    this.state.betList.length >= 1 ?
                        (
                            <TouchableOpacity style={styles.count} onPress={() => {
                                this.initBet()
                            }}>
                                <Text>投注单 </Text><View style={styles.num}><Text
                                style={{color: "#fff", fontWeight: '500'}}>{this.state.betList.length}</Text></View>
                            </TouchableOpacity>
                        ) : null
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

    mixChangeShow = (index, open = true) => {
        let mixData = this.mixData.slice(0);
        var newData = {};
        for (var i in mixData[index]) {
            newData[i] = mixData[index][i];
        }
        if (open) {
            newData.show = !newData.show;
        }
        mixData[index] = newData;
        this.mixData = mixData;
        this.setState({	
            dataSource: this.state.dataSource.cloneWithRows(this.mixData)
        });
    }
    renderRow = (rowData, sectionID, rowID) => {
        rowID = parseInt(rowID);
        return (
            <View style={styles.listItem} key={rowID}>
                <TouchableWithoutFeedback onPress={() => {
                    this.mixChangeShow(rowID)
                }}>
                    <View style={styles.itemTitle}>
                        <Text style={[styles.league,{width:50}]}>{this.state.LG[rowData.M[2]].LN}</Text>
                        <Text numberOfLines={1} style={[styles.time, {color: "grey",flex:1,textAlign:"center"}]}>{this.MatchDate(rowData.M[7])}</Text>
                        <Text numberOfLines={1} style={[styles.homeName, {color: "#333",textAlign:"right",flex:1,fontSize:14}]}>{rowData.M[4]}</Text>
                        <Text style={[styles.vs,{width:40,textAlign:"center",fontSize:10}]}>VS</Text>
                        <Text numberOfLines={1} style={[styles.awayName, {color: "#333",flex:1,fontSize:14}]}>{rowData.M[6]}</Text>
                        {
                            rowData.show ? (<Icon name="ios-arrow-forward" color="#cbcbcb" size={24}/>) :
                                <Icon name="ios-arrow-down" color="#cbcbcb" size={24}/>

                        }

                    </View>
                </TouchableWithoutFeedback>
                {

                    rowData.show ?
                        (<View style={styles.itembody}>
                            <View>
                                <View style={styles.title}><Text style={{color: '#000',}}>全场赛果: <Text
                                    style={{color: '#808080'}}>猜90分钟内比赛结果(含伤停补时)</Text></Text></View>
                                <View style={styles.detail}>


                                    <View
                                        style={[styles.detailOneView, this.bgColor(rowData.MatchID, 5, 0, 1) ? styles.selectBg : styles.noSelectBg]}>
                                        <TouchableOpacity style={styles.detailOne} onPress={() => {
                                            this.assmbleBet(rowData.MK['5'][0][1], 1, rowData.MK['5'][0][0], rowData.MatchID, 5, rowID)
                                        }}>
                                            {/*<Text numberOfLines={1} style={[{flex:1},this.bgColor(rowData.MatchID, 5, 0, 1) ? styles.selectBgWhite : styles.noSelectBgBlack]}>{rowData.M[4]}</Text>*/}
                                            <ExtendText txt={rowData.M[4]} sty={[this.bgColor(rowData.MatchID, 5, 0, 1) ? styles.selectBgWhite : styles.noSelectBgBlack]}/>
                                            <Text style={[{flex:1,textAlign:"right"},this.bgColor(rowData.MatchID, 5, 0, 1) ? styles.selectBgWhite : styles.noSelecBgOrange]}>{this.FO(rowData.MK["5"][0][1])}</Text>
                                        </TouchableOpacity>
                                    </View>


                                    <View
                                        style={[styles.detailOneView, this.bgColor(rowData.MatchID, 5, 0, 3) ? styles.selectBg : styles.noSelectBg]}>
                                        <TouchableOpacity onPress={() => {
                                            this.assmbleBet(rowData.MK['5'][0][3], 3, rowData.MK['5'][0][0], rowData.MatchID, 5, rowID)
                                        }} style={[styles.detailOne, {borderRightWidth: 1, borderLeftWidth: 1}]}>
                                            <Text numberOfLines={1} style={[{flex:1},this.bgColor(rowData.MatchID, 5, 0, 3) ? styles.selectBgWhite : styles.noSelectBgBlack]}>和局</Text>
                                            <Text style={[{flex:1,textAlign:"right"},this.bgColor(rowData.MatchID, 5, 0, 3) ? styles.selectBgWhite : styles.noSelecBgOrange]}>{this.FO(rowData.MK["5"][0][3])}</Text>
                                        </TouchableOpacity>
                                    </View>


                                    <View
                                        style={[styles.detailOneView, this.bgColor(rowData.MatchID, 5, 0, 2) ? styles.selectBg : styles.noSelectBg]}>
                                        <TouchableOpacity onPress={() => {
                                            this.assmbleBet(rowData.MK['5'][0][2], 2, rowData.MK['5'][0][0], rowData.MatchID, 5, rowID)
                                        }} style={styles.detailOne}>
                                            {/*<Text numberOfLines={1} style={[{flex:1},this.bgColor(rowData.MatchID, 5, 0, 2) ? styles.selectBgWhite : styles.noSelectBgBlack]}>{rowData.M[6]}</Text>*/}
                                            <ExtendText txt={rowData.M[6]} sty={[this.bgColor(rowData.MatchID, 5, 0, 2) ? styles.selectBgWhite : styles.noSelectBgBlack]}/>
                                            <Text style={[{flex:1,textAlign:"right"},this.bgColor(rowData.MatchID, 5, 0, 2) ? styles.selectBgWhite : styles.noSelecBgOrange]}>{this.FO(rowData.MK["5"][0][2])}</Text>
                                        </TouchableOpacity>
                                    </View>


                                </View>

                                <View style={styles.title}><Text style={{color: '#000',}}>全场让球: <Text
                                    style={{color: '#808080'}}>猜90分钟内比赛结果(含伤停补时)</Text></Text></View>
                                <View style={styles.detail}>

                                    <View
                                        style={[styles.detailOneView, this.bgColor(rowData.MatchID, 1, 0, 1) ? styles.selectBg : styles.noSelectBg]}>
                                        <TouchableOpacity onPress={() => {
                                            this.assmbleBet(rowData.MK['1'][0][1], 1, rowData.MK['1'][0][0], rowData.MatchID, 1, rowID)
                                        }} style={styles.detailOne}>
                                            <View style={{flexDirection:"row"}}>
                                                  {/*<Text numberOfLines={1} style={[this.bgColor(rowData.MatchID, 1, 0, 1) ? styles.selectBgWhite : styles.noSelectBgBlack]}>{rowData.M[4]} {this.HdpH(rowData.MK["1"][0][3])}</Text>*/}
                                                  <ExtendText txt={rowData.M[4]} sty={[this.bgColor(rowData.MatchID, 1, 0, 1) ? styles.selectBgWhite : styles.noSelectBgBlack]}/>
                                                  <Text numberOfLines={1} style={[this.bgColor(rowData.MatchID, 1, 0, 1) ? styles.selectBgWhite : styles.noSelectBgBlack]}> {this.HdpH(rowData.MK["1"][0][3])}</Text>
                                            </View>
                                            <Text style={[{flex:1,textAlign:"right"},this.bgColor(rowData.MatchID, 1, 0, 1) ? styles.selectBgWhite : styles.noSelecBgOrange]}>{this.FO(rowData.MK["1"][0][1])}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View
                                        style={[styles.detailOneView, this.bgColor(rowData.MatchID, 1, 0, 2) ? styles.selectBg : styles.noSelectBg]}>
                                        <TouchableOpacity onPress={() => {
                                            this.assmbleBet(rowData.MK['1'][0][2], 2, rowData.MK['1'][0][0], rowData.MatchID, 1, rowID)
                                        }} style={[{borderLeftWidth: 1}, styles.detailOne]}>
                                        
                                                 <View style={{flexDirection:"row"}}>
                                                         {/*<Text numberOfLines={1} style={[{flex:3},this.bgColor(rowData.MatchID, 1, 0, 2) ? styles.selectBgWhite : styles.noSelectBgBlack]}>{rowData.M[6]} {this.HdpA(rowData.MK["1"][0][3])}</Text>*/}
                                                         <ExtendText txt={rowData.M[6]} sty={[this.bgColor(rowData.MatchID, 1, 0, 2) ? styles.selectBgWhite : styles.noSelectBgBlack]}/>
                                                         <Text numberOfLines={1} style={[this.bgColor(rowData.MatchID, 1, 0, 2) ? styles.selectBgWhite : styles.noSelectBgBlack]}> {this.HdpA(rowData.MK["1"][0][3])}</Text>
                                                 </View>
                                                 
  
                               
                                            
                                            <Text style={[{flex:1,textAlign:"right"},this.bgColor(rowData.MatchID, 1, 0, 2) ? styles.selectBgWhite : styles.noSelecBgOrange]}>{this.FO(rowData.MK["1"][0][2])}</Text>
                                        </TouchableOpacity>
                                    </View>


                                </View>

                                <View style={styles.title}><Text style={{color: '#000',}}>全场大小: <Text
                                    style={{color: '#808080'}}>猜90分钟内比赛结果(含伤停补时)</Text></Text></View>
                                <View style={[styles.detail,]}>

                                    <View
                                        style={[styles.detailOneView, this.bgColor(rowData.MatchID, 3, 0, 1) ? styles.selectBg : styles.noSelectBg]}>
                                        <TouchableOpacity onPress={() => {
                                            this.assmbleBet(rowData.MK['3'][0][1], 1, rowData.MK['3'][0][0], rowData.MatchID, 3, rowID)
                                        }} style={styles.detailOne}>
                                            <Text style={[this.bgColor(rowData.MatchID, 3, 0, 1) ? styles.selectBgWhite : styles.noSelectBgBlack]}>大 {this.Hdp(rowData.MK["3"][0][3])}</Text>
                                            <Text style={[this.bgColor(rowData.MatchID, 3, 0, 1) ? styles.selectBgWhite : styles.noSelecBgOrange]}>{this.FO(rowData.MK["3"][0][1])}</Text>
                                        </TouchableOpacity>
                                    </View>


                                    <View
                                        style={[styles.detailOneView, this.bgColor(rowData.MatchID, 3, 0, 2) ? styles.selectBg : styles.noSelectBg]}>
                                        <TouchableOpacity onPress={() => {
                                            this.assmbleBet(rowData.MK['3'][0][2], 2, rowData.MK['3'][0][0], rowData.MatchID, 3, rowID)
                                        }} style={[{borderLeftWidth: 1}, styles.detailOne]}>
                                            <Text style={[this.bgColor(rowData.MatchID, 3, 0, 2) ? styles.selectBgWhite : styles.noSelectBgBlack]}>小 {this.Hdp(rowData.MK["3"][0][3])}</Text>
                                            <Text style={[this.bgColor(rowData.MatchID, 3, 0, 2) ? styles.selectBgWhite : styles.noSelecBgOrange]}>{this.FO(rowData.MK["3"][0][2])}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>) : null
                }
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


export default connect(mapStateToProps, mapDispatchToProps)(Mix);
const styles = StyleSheet.create({
    body: {
        flex:1,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    itemTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 42,
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#e2e3e7',
        borderBottomWidth: 1,
        borderBottomColor: "#ccc"

    },
    title: {
        backgroundColor: "#f2f2f2",
        height: 35,
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',

    },
    league: {
        color: "#000",
        fontSize:12,
    },
    time:{

    },
    detail: {
        flexDirection: 'row',
        height: 40,
    },
    detailOneView: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    detailOne: {
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
        alignItems: 'center',
        borderColor: '#ccc',
        borderBottomWidth: 1,
    },
    count: {
        width: 100,
        height: 42,
        paddingBottom: 5,
        position: 'absolute',
        bottom:Platform.OS=='ios'?-8:-4,
        left: 0.5 * (Screen.ScreenWidth - 100),
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "#fff",
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10
    },
    num: {
        width: 20,
        height: 20,
        backgroundColor: "#3a66b3",
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectBg: {
        backgroundColor: "#3a66b3"
    },
    noSelectBg: {
        backgroundColor: "#ffffff"
    },
    selectBgWhite:{
        color:"#ffffff"
    },
    noSelectBgBlack:{
        color:"#000000"
    },
    noSelecBgOrange:{
        color:"#ff5b06"
    },
});
