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
  Alert,
  TouchableOpacity,
  ScrollView,
  ListView,
  Text,
  View
} from 'react-native';
import {
  connect
} from 'react-redux';
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import HTTPBase from '../network/http.js';
import Networking from '../../../Core/WGNetworking/Network.js';
import {
  GetProcessLeague
} from "../../Config/apiUrlConfig";
import GameType from './gameType';
var Dimensions = require('Dimensions');
var ScreenHeight = Dimensions.get('window').height;


class LeagueProcess extends ContainerComponent {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      today: '',
      dataSource: new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
      })
    }
  }
  showCalander = () => {

  }
  SelectMatch=(mid)=>{
        this.props.SelectMatch(mid)
  }
 
  render() {
    return (
      
      <View style={styles.body}>
             {
                    this.props.dataSource.rowIdentities.length>0&&this.props.dataSource.rowIdentities[0].length>0?(
                        <View style={styles.wraper}>
                                <ListView
                                    initialListSize = {10}
                                    pageSize = {1}
                                    dataSource={this.props.dataSource}
                                    renderRow={this.renderRow.bind(this)}
                                />
                        </View>):(<View style={{alignItems:"center",marginTop:200}}><Text>暂无数据</Text></View>)
                }
        </View>
    );
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity onPress={()=>{this.SelectMatch(rowData.MID)}}>
               <View style={[styles.item,{backgroundColor:rowID%2==0?"#ededed":"#f7f7f7"}]}>
                          <View style={styles.league}>
                              <Text numberOfLines={1} style={{flex:1,textAlign:'center',paddingTop:10,color:'#4c4c4c'}}>{rowData.LN}</Text>
                              <Text style={{flex:1,textAlign:'center',color:'#808080'}}>{rowData.MD.split(" ")[1]}</Text>
                          </View>
                          <View style={styles.team}>
                            <Text numberOfLines={1} style={{textAlign:'right',flex:3,color:'#000',fontSize:14}}>{rowData.HN}</Text>
                            <Text style={{flex:1,textAlign:'center',fontSize:12}}>VS</Text>
                            <Text numberOfLines={1} style={{textAlign:'left',flex:3,color:'#000',fontSize:14}}>{rowData.AN}</Text>
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


export default connect(mapStateToProps, mapDispatchToProps)(LeagueProcess);

const styles = StyleSheet.create({
  body: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  wraper: {
    height: ScreenHeight - 154
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