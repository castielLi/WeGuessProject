/**
 * Created by apple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    TouchableHighlight,
    ListView,
    Image,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
var {height, width} = Dimensions.get('window')
import ContainerComponent from '../../Core/Component/ContainerComponent';
import {GetUnbalancedBets, GetBalancedBetDate} from "../Config/apiUrlConfig";
import config from '../Utils/sportConfig';
import HandleData from '../Utils/sportHandle';

export default class SportBetList extends ContainerComponent {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    closeuSucPanel=()=>{
      this.props.closeSucPanel();
    }
    publish=(BetId)=>{
        this.props.publish(BetId);
    }
    MarketName=(m)=>{
                return config.MarketName[m.MarketID] || m.MarketName;
    }
    showHDP=(hdp, pos, market)=>{
                if (market <= 2 && market >= 1) {
                    return (hdp < 0 ? "-" : "+") + HandleData.ComputeHDP(hdp);
                }
                if (market <= 4 && market >= 3) {
                    return HandleData.ComputeHDP(hdp);
                }
                return "";
    }
   render() {

       let {BetID,SubBets,BetValue,BackAmount} = this.props.betResult;
       let match = SubBets[0]; 
        return (
            <View style={styles.container}>
                  <View style={styles.panel}>
                      <View style={styles.suceess}><Text style={{flex:20,textAlign:'center'}}>投注成功</Text><TouchableHighlight style={{flex:1}} onPress={()=>{this.closeuSucPanel()}}><Text>X</Text></TouchableHighlight></View>
                      {
                          SubBets.map((match,index)=>{
                              return (
                                   <View style={styles.detail} key={index}>
                                        <View style={styles.league}><Text>{match.Stage==3?"滚球":"赛前"}.{MarketName(match)}:{match.BetPosName} {showHDP(match.Hdp,match.BetPos,match.MarketID)}</Text></View>
                                        <View style={styles.team}><Text>{match.HomeName} vs {match.AwayName}</Text><Text>{match.LeagueName}@{match.ReportDate}</Text></View>
                                        <View style={styles.bet}><Text>投注猜豆:{Fmoney(BetValue)}</Text><Text>预计返还:{Fmoney(BackAmount)}</Text></View>
                                    </View>
                              )
                          })
                      }
                      
                      <View style={styles.btn}>
                          <View style={styles.cancle}><TouchableHighlight onPress={()=>{this.closeuSucPanel()}}><Text>取消</Text></TouchableHighlight></View>
                          <View style={styles.confirm}><TouchableHighlight onPress={()=>{this.publish(BetID)}}><Text style={{color:"#ff5b06"}}>立即发布</Text></TouchableHighlight></View>
                      </View>
                  </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:width,
        height:height,
        position:'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent:'center',
        paddingLeft:30,
        paddingRight:30,
    },
    panel:{
       borderWidth:1,
       borderColor:"rgba(0,0,0,0.5)",
       overflow:'hidden',
       borderRadius:10 ,
       backgroundColor:"#fff",
    },
    suceess:{
        height:35,
        flexDirection:'row',
        backgroundColor:"#ccc",
        alignItems:'center',
    },
    detail:{
        borderTopWidth:1,
        borderTopColor:"#fff",
        paddingLeft:10,
        paddingRight:10,
    },
    league:{
        height:30,
        justifyContent:'center',
    },
    team:{
        flexDirection:"row",
        justifyContent:"space-between",
        height:30,
    },
    bet:{
        flexDirection:"row",
        justifyContent:"space-between",
        height:30,
        alignItems:"center",
    },
    btn:{
         flexDirection:"row",
         alignItems:"center",
         height:35,
         borderTopWidth:1,
         borderTopColor:"#ccc",
    },
    cancle:{
         borderRightWidth:1,
         borderRightColor:"#ccc",
         flex:1,
         justifyContent:"center",
         height:30,
         alignItems:'center'
    },
    confirm:{
         flex:1,
         justifyContent:"center",
         height:30,
         alignItems:'center',
         
    },
});