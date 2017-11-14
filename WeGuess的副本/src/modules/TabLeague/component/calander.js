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
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Screen from './utils';
export default class Calander extends Component {

  // 初始化模拟数据
  constructor(props) {
    super(props);
    this.state = {
      currentTime: this.props.currentTime,
      dateList: this.props.dateList,
      showCalander: this.props.showCalander,

    }
  }
  changeDate = (TimeIndex) => {
    let newState = TimeIndex;
    this.setState({
      currentTime: newState
    });
    this.props.changeCurrentTime(newState);
    return (setTimeout(this.changeShow), 1000);
  }

  changeShow = () => {
    let newState = !this.state.showCalander;
    this.setState({
      showCalander: newState
    });
    this.props.changeCalander(newState);
  }
  componentDidMount() {}
  render() {
    var _scrollView = ScrollView;
    const date = this.state.dateList;
    return (

      <TouchableOpacity underlayColor='#9d9d9d' style={styles.body} onPress = {()=>{this.changeShow()}}>
           <View style = {styles.scroll}>
            <ScrollView showsVerticalScrollIndicator = {false} ref={ref=>this.scrollView = ref}
              onContentSizeChange = {(contentWidth,contentHeight)=>{
                this.scrollView.scrollTo({y:this.state.currentTime*50-50})
              }}
            >
                <TouchableOpacity style = {this.state.currentTime===0?styles.dateFocusButton:styles.dateButton} onPress={()=>{this.changeDate(0)}}>
                    <Text style={this.state.currentTime ===0?styles.dateFocusText:styles.dateText}>{this.state.dateList[0].day}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {this.state.currentTime===1?styles.dateFocusButton:styles.dateButton} onPress={()=>{this.changeDate(1)}}>
                    <Text style={this.state.currentTime ===1?styles.dateFocusText:styles.dateText}>{this.state.dateList[1].day}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {this.state.currentTime===2?styles.dateFocusButton:styles.dateButton} onPress={()=>{this.changeDate(2)}}>
                    <Text style={this.state.currentTime ===2?styles.dateFocusText:styles.dateText}>{this.state.dateList[2].day}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {this.state.currentTime===3?styles.dateFocusButton:styles.dateButton} onPress={()=>{this.changeDate(3)}}>
                    <Text style={this.state.currentTime ===3?styles.dateFocusText:styles.dateText}>{this.state.dateList[3].day}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {this.state.currentTime===4?styles.dateFocusButton:styles.dateButton} onPress={()=>{this.changeDate(4)}}>
                    <Text style={this.state.currentTime ===4?styles.dateFocusText:styles.dateText}>{this.state.dateList[4].day}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {this.state.currentTime===5?styles.dateFocusButton:styles.dateButton} onPress={()=>{this.changeDate(5)}}>
                    <Text style={this.state.currentTime ===5?styles.dateFocusText:styles.dateText}>{this.state.dateList[5].day}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {this.state.currentTime===6?styles.dateFocusButton:styles.dateButton} onPress={()=>{this.changeDate(6)}}>
                    <Text style={this.state.currentTime ===6?styles.dateFocusText:styles.dateText}>{this.state.dateList[6].day}</Text>
                </TouchableOpacity>
            </ScrollView>
           </View>
       </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    width: Screen.ScreenWidth,
    height: Screen.ScreenHeight,
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    width: Screen.ScreenWidth / 1.5,
    height: Screen.ScreenWidth / 2.5,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 6,
  },
  dateButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Screen.ScreenWidth / 1.5,
    height: 50,
  },
  dateFocusButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Screen.ScreenWidth / 1.5,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dateFocusText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '400',
  },
  dateText: {
    fontSize: 16,
    color: 'grey',
  },
});