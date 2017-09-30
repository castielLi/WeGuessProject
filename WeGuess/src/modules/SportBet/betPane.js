/**
 * Created by apple on 2017/6/7.
 */

import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Button,
    Alert,
    TouchableOpacity,
    ListView,
    ScrollView ,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
    Platform,
    Keyboard,
} from 'react-native';
import ContainerComponent from '../../Core/Component/ContainerComponent';
import config from '../Utils/sportConfig';
import {numFormat} from '../Utils/money';
import HandleData from '../Utils/sportHandle';
let {height, width} = Dimensions.get('window')


const limitList = [100, 200, 500, 1000, 5000];
export default class SportBetList extends ContainerComponent {
    constructor(props) {
        super(props)
        this.state = {
            betMoney: '',
            text: '',
            isMix: false,
            keyboardSpace:0,
        }
        this.keyboardDidShowListener=null;
        this.keyboardDidHideListener=null;
    }

    autoFill = (value) => {
        this.setState({
            betMoney: value.toString()
        })
    }
    MarketName = (m) => {
        return config.MarketName[m.MarketID] || m.BetKind;
    }
    showHDP = (hdp, pos, market) => {
        return HandleData.showHDP(hdp, pos, market);
    }
    ReportDate = (date) => {
        return date.split("T")[0].replace(/-/g, "/");
    }
    //格式化猜豆数据
    Fmoney = (n) => {
        if (n == undefined) {
            return "undefined";
        }
        return n.toString().fmoney();
    }
    //预计返还
    totalBack = (betInfo) => {
        if (this.state.betMoney == "" || this.state.betMoney == null) {
            return 0;
        }
        var sum = 0;
        if (betInfo.TicketList != undefined) {
            sum = (parseFloat(betInfo.MixTotalOdds) * parseFloat(this.state.betMoney));
        } else {
            sum = (parseFloat(betInfo.Ticket.NewOdds) * parseFloat(this.state.betMoney));
        }
        return this.Fmoney(sum);
    }
    //提交投注
    SubmitBet = (betInfo) => {
        var params;
        if (this.state.betMoney == "" || isNaN(this.state.betMoney)) {
            this.state.betMoney = betInfo.Limit.MinBet;
            return;
        }
        if (this.state.betMoney < betInfo.Limit.MinBet) {
            this.state.betMoney = betInfo.Limit.MinBet;
            return;
        }
        if (this.state.betMoney > betInfo.Limit.MaxBet) {
            this.state.betMoney = betInfo.Limit.MaxBet;
            return;
        }
        if (this.props.isMix) { //混合过关投注
            if (betInfo.TicketList.length < 2) {
                return;
            }
            var arr = [];
            for (var i = 0; i < betInfo.TicketList.length; i++) {
                var item = betInfo.TicketList[i];
                var jsondata = {
                    CouID: item.CouID,
                    MatchID: item.MatchID,
                    MarketID: item.MarketID,
                    Odds: item.NewOdds,
                    BetPos: item.BetPos,
                    BetHdp: item.BetHdp
                }
                arr.push(jsondata);
                item = null;
                jsondata = null;
            }
            params = {
                BetValue: this.state.betMoney,
                MpID: config.MpIDs[arr.length - 2],
                MixInfo: JSON.stringify(arr)
            }
        } else { //一般投注
            params = {
                CouID: betInfo.Ticket.CouID,
                MatchID: betInfo.Ticket.MatchID,
                MarketID: betInfo.Ticket.MarketID,
                Odds: betInfo.Ticket.NewOdds,
                BetPos: betInfo.Ticket.BetPos,
                BetHdp: betInfo.Ticket.BetHdp,
                BetValue: this.state.betMoney,
                SportID: betInfo.Ticket.SportID,
                Stage: betInfo.Ticket.Stage,
            }
        }
        this.props.SubmitBet(params);
    }
    //移除比赛
    removeMatch=(index)=>{
         this.props.removeMatch(index);
    }
    keyboardShow=()=>{
      return Platform.OS === 'ios' ?Keyboard.addListener('keyboardWillShow',this.updateKeyboardSpace) : Keyboard.addListener('keyboardDidShow',this.updateKeyboardSpace);
    }
    keyboardHide =()=>{
      return Platform.OS === 'ios' ?
        Keyboard.addListener('keyboardWillHide',this.resetKeyboardSpace) : Keyboard.addListener('keyboardDidHide',this.resetKeyboardSpace);
    }
    updateKeyboardSpace=(e)=>{
        if(!e.endCoordinates){
        return;
        }
        let keyboardSpace = e.endCoordinates.height;//获取键盘高度
        this.setState({
            keyboardSpace: keyboardSpace
        })
   }
   resetKeyboardSpace=()=>{
        this.setState({
            keyboardSpace: 0
        })
   }
    componentWillUnmount() {
         this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentWillMount() {
        this.keyboardDidShowListener = this.keyboardShow();
        this.keyboardDidHideListener = this.keyboardHide();
    }

    calcHeight=()=>{
        if(this.props.isCommon){
            return this.state.keyboardSpace;
        }else if(Platform.OS=='ios'){
            if(this.state.keyboardSpace>0){
                return this.state.keyboardSpace -46;
            }else{
                return 0;
            }
        }else{
            return 0;
        }
    }
    render() {
        let {Limit, Ticket, TicketList} = this.props.betInfo;
        return (
            <TouchableWithoutFeedback onPress={()=>{this.props.closeBetPanel()}}>
            <View style={[styles.container,{bottom:this.calcHeight()}]}>
                <TouchableWithoutFeedback onPress={()=>{}}>
                <View style={[styles.body]}>
                    <View style={styles.btPaneTitle}>
                        <View style={styles.banlace}>
                            <Image source={require('./resource/icon_15.png')} style={styles.banlanceImg}></Image>
                            <Text style={{color: "#ff5b06"}}>{numFormat(this.props.balance)}</Text>
                        </View>
                        
                            <TouchableWithoutFeedback onPress={() => {
                                this.props.closeBetPanel()
                            }}>
                              <View style={{width:60,height:36,justifyContent:"center",alignItems:"flex-end"}}>
                                <Image source={require('./resource/icon_12.png')} style={styles.banlanceImg}></Image>
                              </View>
                            </TouchableWithoutFeedback>
                        
                    </View>
                    <View style={styles.btPaneTeam}>
                        <ScrollView>
                        {
                            TicketList != undefined ? (
                                TicketList.map((item, index) => {
                                    return (<View key={index}>
                                        
                                        <View style={styles.event}>
                                            <View style={styles.type}>
                                                <Text
                                                    style={{color: '#000'}}>{item.Stage == 3 ? "滚球" : "赛前"}·{this.MarketName(item)}:{item.BetTeam} {this.showHDP(item.Hdp, item.BetPos, item.MarketID)}</Text>
                                                <Text style={{color: '#ff5b06'}}>@ {item.NewOdds}</Text>
                                            </View>
                                            
                                                <TouchableWithoutFeedback onPress={()=>{this.removeMatch(index+"-"+item.MatchID)}}>
                                                    <View style={{width:60,height:28,justifyContent:"center",alignItems:"flex-end"}}>
                                                        <Image source={require('./resource/icon_37.png')}
                                                            style={styles.banlanceImg}></Image>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            
                                        </View>
                                        <View style={styles.team}>
                                            <Text style={{color: '#808080'}}>{item.HomeName} vs {item.AwayName}</Text>
                                            <Text
                                                style={{color: '#808080'}}>{item.LeagueName}@{this.ReportDate(item.ReportDate)}</Text>
                                        </View>
                                        
                                    </View>)
                                })

                            ) : (
                                <View>
                                    <View style={styles.event}>
                                        <Text
                                            style={{color: '#000'}}>{Ticket.Stage == 3 ? "滚球" : "赛前"}·{this.MarketName(Ticket)}:{Ticket.BetTeam} {this.showHDP(Ticket.Hdp, Ticket.BetPos, Ticket.MarketID)}</Text>
                                        <Text style={{color: '#ff5b06'}}>@ {Ticket.NewOdds}</Text>
                                    </View>
                                    <View style={styles.team}>
                                        <Text style={{color: '#808080'}}>{Ticket.HomeName} vs {Ticket.AwayName}</Text>
                                        <Text
                                            style={{color: '#808080'}}>{Ticket.LeagueName}@{this.ReportDate(Ticket.ReportDate)}</Text>
                                    </View>

                                </View>
                            )
                        }
                        </ScrollView>
                    </View>
                    <View style={styles.bet}>
                        <View style={styles.back}>
                            {
                                TicketList != undefined ? (
                                    <View style={{flexDirection: "row"}}><Text>{this.props.betInfo.TicketList.length}X1
                                        赔率 </Text><Text
                                        style={{color: "#ff5b06"}}>{this.props.betInfo.MixTotalOdds.toFixed(2)}</Text></View>) : (
                                    <View style={{flexDirection: "row"}}><Text>赔率 </Text><Text
                                        style={{color: "#ff5b06"}}>{Ticket.NewOdds}</Text></View>)
                            }
                            <View style={{flexDirection: "row"}}><Text>预计返豆</Text><Text
                                style={{color: "#ff5b06"}}> {this.totalBack(this.props.betInfo)}</Text></View>
                        </View>
                        <View style={styles.input}>
                            <View style={styles.textInputViewStyle}>
                                <TextInput
                                    ref={ (e) => this._input = e }
                                    style={styles.textInputStyle}
                                    underlineColorAndroid='transparent'
                                    //站位符
                                    placeholder="请输入猜豆数量"
                                    placeholderTextColor="#ccc"
                                    keyboardType="numeric"
                                    value={this.state.betMoney}
                                    onChangeText={(betMoney) => {
                                        if (!isNaN(betMoney)) {
                                            this.setState({betMoney})
                                        } else {
                                            let old = betMoney.substring(0, betMoney.length - 1);
                                            this.setState({old});
                                        }
                                    }}/>

                            </View>
                            <TouchableWithoutFeedback onPress={() => {
                                this.SubmitBet(this.props.betInfo)
                            }}>
                                <View style={styles.btn}>
                                    <Text style={{color: "#fff"}}>确定</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.limit}>
                            <TouchableOpacity style={styles.borderRad} onPress={() => {
                                this.autoFill(limitList[0])
                            }}>
                                <Text >{limitList[0]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.borderRad} onPress={() => {
                                this.autoFill(limitList[1])
                            }}>
                                <Text >{limitList[1]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.borderRad} onPress={() => {
                                this.autoFill(limitList[2])
                            }}>
                                <Text >{limitList[2]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.borderRad} onPress={() => {
                                this.autoFill(limitList[3])
                            }}>
                                <Text >{limitList[3]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.borderRad} onPress={() => {
                                this.autoFill(limitList[4])
                            }}>
                                <Text >{limitList[4]}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.max}>
                            <Text>最低投注:{Limit.MinBet}</Text>
                            <Text>最高投注:{Limit.MaxBet}</Text>
                        </View>
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </ View ></TouchableWithoutFeedback>
        )
            ;
    }
}
const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    banlace: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    banlanceImg: {
        justifyContent: 'center',
        width: 25,
        height: 15,
        resizeMode: 'contain',
        marginTop: 2,
        marginRight: 5,
    },
    body: {
        width: width,
        maxHeight: 500,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        paddingBottom: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    btPaneTitle: {
        height: 36,
        backgroundColor: '#e6e6e6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,


    },
    btPaneTeam: {
        maxHeight:300,
    },
    event: {
        flexDirection: 'row',
        height: 28,
        alignItems: 'center',
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 5,
        marginBottom: 5,

    },
    type: {
        flexDirection: 'row',
        height: 28,
        alignItems: 'center',
    },
    team: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 7,
    },
    bet: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    back: {
        height: 28,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        height: 40,
        flexDirection: 'row',
        flex: 1

    },
    textInputViewStyle: {
        //设置宽度减去30将其居中左右便有15的距离
        flex: 4,
        height: 35,
        //设置相对父控件居中
        justifyContent: 'center',
        alignItems: 'center',


    },
    //输入框样式
    textInputStyle: {
        //设置圆角程度
        borderRadius: 9,
        //设置边框的颜色
        borderColor: '#ccc',
        //设置边框的宽度
        borderWidth: 1,
        //内边距
        paddingLeft: 10,
        paddingRight: 10,
        //外边距
        marginLeft: 10,
        height: 40,
        color: '#333',
        textAlign: "center",
        textAlignVertical:"center",
        width: width / 4 * 3 - 20,
        //根据不同平台进行适配
        //marginTop: Platform.OS === 'ios' ? 4 : 8,
    },
    btn: {
        flex: 1,
        height: 35,
        backgroundColor: '#ff5b06',
        marginLeft: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    limit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
        alignItems: 'center',
    },
    borderRad: {
        borderWidth: 1,
        height: 26,
        justifyContent: "center",
        alignItems: "center",
        borderColor: '#ccc',
        borderRadius: 9,
        paddingLeft: 10,
        paddingRight: 10,
    },
    max: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
        paddingBottom: 12,
    },
});