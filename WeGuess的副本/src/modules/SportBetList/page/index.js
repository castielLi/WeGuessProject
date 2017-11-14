/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    ListView,
    ScrollView,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {GetUnbalancedBets, GetBalancedBetDate, GetBalancedBets, PublishBet} from "../../Config/apiUrlConfig";
import TabView from '../../Component/TabView';
import config from '../../Utils/sportConfig'
import {BackButton, BlankButton} from "../../Component/BackButton";
import Icon from "react-native-vector-icons/Ionicons";
import HandleData from '../../Utils/sportHandle'
var {height} = Dimensions.get('window')

let BetColor = {
    "已接受": "rgb(17,96,162)",
    "等待": "rgb(17,96,162)",
    "拒绝": "#808080",
    "取消": "#333333",
    "赢": "#d90000",
    "赢半": "#d90000",
    "输": "#1eb900",
    "输半": "#1eb900",
    "走盘": "#3a66b3"
}

export default class SportBetList extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: "投注记录",
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
        super(props)
        this.state = {
            type: 0,
            dataSourceList: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            dataSourceDate: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            dataSourceDateList: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            dataListLength: 0,
            dataDateLength: 0,
            dataDateListLength: 0,
            betData: null,
            publishList: null,
            showLoading:false,
        }
        this.tabList = ["未结算", "已结算"];
    }

    //获取未结算数据
    getBetList = () => {
        let that = this;
        this.networking.get(GetUnbalancedBets, null, {}).then((responseData) => {
           this.setState({
               showLoading:false
           })
            let {Success, Data, ErrorMsg} = responseData;
            if (Success) {
                this.setState({
                    dataSourceList: this.state.dataSourceList.cloneWithRows(Data),
                    dataListLength: Data.length
                });
                this.dataListLength = Data.length;
            } else {
                this.showAlert("提示", ErrorMsg);
            }
        }, (error) => {
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

    //获取已结算数据
    getBetDate = (date) => {
       // this.showLoading();
        let params = {
            repDate: date
        }
        this.networking.get(GetBalancedBets, params, {}).then((responseData) => {
            let {Success, Data, ErrorMsg} = responseData;
            if (Success) {
                this.setState({
                    dataSourceDate: this.state.dataSourceDate.cloneWithRows(Data),
                    dataDateLength: Data.length
                });
            } else {
                this.showAlert("提示", ErrorMsg);
            }
            this.setState({
               showLoading:false
           })
        }, (error) => {
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

    //获取已结算日期数据
    getBetDateList = () => {
        //this.showLoading();
        let that = this;
        this.networking.get(GetBalancedBetDate, null, {}).then((responseData) => {
            that.hideLoading();
            let {Success, Data, ErrorMsg} = responseData;
            if (Success) {
                this.setState({
                    dataSourceDateList: this.state.dataSourceDateList.cloneWithRows(Data),
                    dataDateListLength: Data.length
                });
            } else {
                this.showAlert("提示", ErrorMsg);
            }
            this.setState({
               showLoading:false
           })
        }, (error) => {
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

    componentDidMount() {
        this.setState({
            showLoading:true
        })
        this.getBetList();
    }

    changeType = (index) => {
        this.setState({type: index, betData: null,showLoading:true});
        if (index == 0) {
            this.getBetList();
        } else {
            this.getBetDateList();  
        }
    }
    ShowHdp = (hdp, pos, market) => {
        return HandleData.showHDP(hdp, pos, market);
    }
    betMsg = (Item) => {
        let Team = Item.BetTeam;
        if (Item.BetTeam == "主") {
            return Item.HomeName;
        }
        else if (Item.BetTeam == "客") {
            return Item.AwayName;
        }
        let Hdp = this.ShowHdp(Item.HDP, Item.BetPos, Item.MarketID);//
        return (
            <Text style={[styles.blue]}>{Team} {Hdp}@{Item.Odds}</Text>
        )
    }
    conPublish = (data) => {
        let {BetDate, Items, BetID} = data;
        this.showAlert("确认发布", (
            <View style={styles.detail}>
                <ScrollView>
                {
                    Items.map((item, index) => {
                        return (
                            <View style={[styles.wraper,index%2==1?styles.bgColor_eaeaea:null]} key={index}>
                                <View style={styles.date}>
                                    <Text>{BetDate.split(" ")[0].split('/')[1] + "/" + BetDate.split(" ")[0].split('/')[2]}</Text>
                                    <Text>{BetDate.split(" ")[1].split(':')[0] + ":" + BetDate.split(" ")[1].split(':')[1]}</Text>
                                </View>
                                <View style={styles.team}><Text style={{color: "#000"}}>{item.HomeName}</Text></View>
                                <View><Text>VS</Text></View>
                                <View><Text style={{color: "#000"}}>{item.AwayName}</Text></View>
                            </View>
                        )
                    })
                }
                </ScrollView>

                <View style={{alignItems: "center", height: 30, justifyContent: "center"}}><Text
                    style={{color: "#ff5b06"}}>立即发布该场比赛推荐</Text></View>
            </View>), () => {
            this.publish(BetID)
        }, () => {
        }, "立即发布", "取消", "#ff5b06");
    }

    publish = (BetID) => {
        let that = this;
        this.showLoading();
        this.setState({
            betSuccess: false,
        })
        var params = {BetID: BetID}     //请求唯一参数注单ID
        this.networking.post(PublishBet, params, {}).then((data) => {
            that.hideLoading();
            var msg = data.Result;
            if (msg == 1) {
                that.showAlert("提示", "发布成功");
                return
            } else {
                var text = config.PublishMsg[msg];

                that.showAlert("提示", text);

            }
        },(error)=>{that.hideLoading();that.showError(error)}).catch((error) => {
            that.showAlert("提示", "发布失败" + error);
            that.hideLoading();

        })
    }
    renderRow = (rowData, sectionID, rowID) => {
        return (
            <View style={styles.row}>
                <View style={styles.matchMsg}>
                    <View style={[styles.rowView, styles.timeView]}>
                        <View>
                            <Text style={[styles.small, styles.grey]}>ID:{rowData.BetID}</Text>
                        </View>
                        <View style={[styles.rowView, styles.justEnd]}>

                            {(this.state.type == 0 && rowData.Items[0].BetKind.indexOf('半场') == -1) ? (
                                <TouchableWithoutFeedback onPress={() => {
                                    this.conPublish(rowData)
                                }}><Image style={styles.publish}
                                          source={require("../resources/publish.png")}/></TouchableWithoutFeedback>) : null}

                            <Text style={[styles.small, styles.grey]}>{rowData.BetDate}</Text>
                        </View>
                    </View>
                    {rowData.Items.map((Item, index) => {
                        return (
                            <View style={[index > 0 ? styles.borderTop : null]} key={index}>
                                <View style={[styles.rowView]}>
                                    <View>
                                        <Text style={[styles.blue]}>{Item.Stage == 3 ? "滚球" : "赛前"}.全场赛果</Text>
                                        {this.betMsg(Item)}
                                    </View>
                                    <View>
                                        <Text
                                            style={[{color: BetColor[rowData.BetStatus] ? BetColor[rowData.BetStatus] : "black"}]}>{rowData.BetStatus}</Text>
                                    </View>
                                </View>
                                <View style={[styles.rowView, styles.league]}>
                                    <Text
                                        style={[styles.small, styles.black]}>{Item.HomeName + "<vs>" + Item.AwayName}</Text>
                                    <Text
                                        style={[styles.small, styles.black]}>{Item.LeagueName + String.fromCharCode(8203) + "@" + Item.ReportDate}</Text>
                                </View>
                            </View>
                        )
                    })}
                </View>
                <View style={[styles.rowView, styles.betInfo]}>
                    <Text style={[styles.small, styles.grey]}>投注猜豆:{rowData.BetValue}</Text>
                    <Text
                        style={[styles.small, styles.grey]}>{rowData.MpName ? rowData.MpName + "@" + rowData.BetOdds.toFixed(2) : ""}</Text>
                    <Text
                        style={[styles.small, styles.grey]}>{this.state.type == 0 ? "预计返还:" + parseInt(rowData.AllWin + rowData.AllLose) : "返还:" + parseInt(rowData.BackValue)}</Text>
                </View>
            </View>
        )
    }

    changeGetBetList = (date) => {
        this.setState({betData: date,showLoading:true});
        this.getBetDate(date);
    }

    renderRowData = (rowData, sectionID, rowID) => {
        return (
            <TouchableWithoutFeedback onPress={() => this.changeGetBetList(rowData.Date)}>
                <View style={styles.dateRow}>
                    <View style={styles.dateView}>
                        <Text style={[styles.grey, styles.small]}>{rowData.Date}</Text>
                    </View>
                    <View style={[styles.countView, styles.rowView]}>
                        <Text
                            style={[rowData.Count > 0 ? styles.red : styles.green, styles.small, styles.marginRight,]}>{rowData.Count}</Text>
                        <Icon name="ios-arrow-forward" color="#828282" size={24}/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    _renderList = () => {
        if (this.state.type == 0) {
            if (this.state.dataListLength > 0) {
                return (
                    <ListView dataSource={this.state.dataSourceList}
                              renderRow={this.renderRow}
                              style={styles.paddTop}
                              enableEmptySections={true}
                    />)
            } else {
                return (
                    <Text style={styles.nodata}>暂无数据</Text>
                )
            }
        } else {
            if (this.state.betData == null) {
                if (this.state.dataDateListLength > 0) {
                    return (
                        <ListView dataSource={this.state.dataSourceDateList}
                                  renderRow={this.renderRowData}
                                  enableEmptySections={true}
                        />)
                } else {
                    return (
                        <Text style={styles.nodata}>暂无数据</Text>
                    )
                }
            } else {
                if (this.state.dataDateLength > 0) {
                    return (
                        <ListView dataSource={this.state.dataSourceDate}
                                  style={styles.paddTop}
                                  renderRow={this.renderRow}
                                  enableEmptySections={true}
                        />)
                } else {
                    return (
                        <Text style={styles.nodata}>暂无数据</Text>
                    )
                }
            }
        }

    }

    render() {
        let Alert = this.Alert;
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <TabView tabList={this.tabList} onPress={this.changeType}></TabView>
                {this.state.showLoading?(<View style={{backgroundColor:"#fff",justifyContent:"center",flex:1}}>
                              <ActivityIndicator
                                    color="#3a67b3"
                                    style={[styles.centering, {height: 80}]}
                                    size="large"
                                />
                    </View>):<View style={styles.betView}>
                    {this._renderList()}
                </View>}
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
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    justEnd: {
        justifyContent: 'flex-end'
    },
    betView: {
        height: height - 112,
    },
    paddTop: {
        paddingTop: 6,
        paddingBottom: 6,
    },
    timeView: {
        marginTop: 4,
        marginBottom: 4
    },
    publish: {
        width: 16,
        height: 16,
        marginRight: 4,
    },
    row: {
        marginBottom: 6,
        marginLeft: 6,
        marginRight: 6,
        borderColor: "#cccccc",
        borderWidth: 1
    },
    matchMsg: {
        backgroundColor: '#ffffff',
        paddingLeft: 6,
        paddingRight: 6,
    },
    small: {
        fontSize: 12
    },
    betInfo: {
        paddingLeft: 6,
        paddingRight: 6,
        backgroundColor: '#f2f2f2',
        height: 36
    },
    red: {
        color: "red"
    },

    green: {
        color: "#1eb900"
    },
    blue: {
        color: "#3a66b3"
    },
    grey: {
        color: "grey"
    },
    black: {
        color: "black"
    },
    league: {
        marginBottom: 4
    },
    borderTop: {
        borderColor: "#ccc",
        borderTopWidth: 1
    },
    nodata: {
        flex: 1,
        textAlign: "center",
        paddingTop: 50
    },
    dateRow: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#ffffff",
        paddingLeft: 16,
        paddingRight: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#cccccc"
    },
    dateView: {
        flex: 1,
    },
    countView: {
        justifyContent: 'flex-end'
    },
    marginRight: {
        marginRight: 8
    },
    detail: {
       maxHeight:300,
    },
    wraper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
        paddingLeft: 30,
        paddingRight: 30,
    },
    bgColor_eaeaea:{
        backgroundColor:"#eaeaea"
    }

});