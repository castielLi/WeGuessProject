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
  Alert,
  TouchableOpacity,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Calander from './calander'
import GameType from './gameType'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export default class DateBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGameType: this.props.showGameType,
      showCalander: this.props.showCalander,
      today: new Date(),
      currentTime: 0,
      dateList: [],
    }
    this.getDateList = this.getDateList.bind(this);
    this.goForwardDay = this.goForwardDay.bind(this);
  }
  getDateList(type) {
    let that = this;

    let arr = [],
      date;
    if (type == 0) { //赛果
      this.setState({
        currentTime: 6
      });
      for (let i = 0; i <= 6; i++) {
        date = new Date(new Date() - 24 * 60 * 60 * 1000 * i);
        arr.unshift({
          'week': date.getDay(),
          'day': date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
        })
      }
      that.setState({
        dateList: arr
      })

    } else { //赛程
      this.setState({
        currentTime: 0
      })
      for (let i = 0; i <= 6; i++) {
        date = new Date((new Date() - 0) + 24 * 60 * 60 * 1000 * i);
        arr.push({
          'week': date.getDay(),
          'day': date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
        })
      }
      that.setState({
        dateList: arr
      })

    }
  }
  changeGameType() {
    var newState = !this.state.showGameType;
    this.setState({
      showGameType: newState,
    });
    this.props.onchangeshowGameType(newState);
  }
  goForwardDay() {
    if (this.state.currentTime <= 0) {
      return;
    }
    this.setState({
      currentTime: this.state.currentTime - 1
    })

  }
  goAfterDay() {
    if (this.state.currentTime >= 6) {
      return;
    }
    this.setState({
      currentTime: this.state.currentTime + 1
    })

  }
  componentWillMount() {
    this.getDateList(0);
  }

  render() {
    const weekArr = ['(周日)', '(周一)', '(周二)', '(周三)', '(周四)', '(周五)', '(周六)'],
      week = weekArr[this.state.dateList[this.state.currentTime].week],
      day = this.state.dateList[this.state.currentTime].day;
    return (

      <View>
      <View style={styles.body}>
          <View style={{position:'relative',zIndex:0}}>
    <TouchableOpacity onPress={()=>{this.changeGameType()}}><Text>足球</Text></TouchableOpacity>
          </View>
          <View style={{flexDirection:'row'}}>
             <View>
                  <TouchableOpacity onPress={()=>{this.goForwardDay()}}><Text>《</Text></TouchableOpacity>
             </View>
             <View>
                 <Text style={{marginRight:10,marginLeft:10,}}>
                     {week+this.state.dateList[this.state.currentTime]['day']}{/*this.state.currentTime*/}
                 </Text>
             </View>
             <View>
                 <TouchableOpacity onPress = {()=>{this.goAfterDay()}}><Text>》</Text></TouchableOpacity>
             </View>
          </View>
          <View style = {{position:'relative'}}>
             <TouchableOpacity onPress={()=>{this.setState({showCalander:!this.state.showCalander})}}><Text><FontAwesome name="address-book" size={20} color="grey" /></Text></TouchableOpacity>
          </View>
       </View>
          <View style= {{borderTopWidth:1,borderColor:'#ccc'}}></View>
       </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 10,
    height: 50,
    alignItems: 'center',
    //    borderTopWidth:1,
    //    borderTopColor:'#ccc',
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
});