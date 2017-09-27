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
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import Screen from '../method/index'; 
export default class GameType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sportId: this.props.sportId,
      showGameType: this.props.showGameType,

    };
  }



  _changeGameType = () => {
    let newGameType = !this.state.showGameType;
    this.setState({
      showGameType: newGameType
    })
    this.props.changeGameType(newGameType)
  }

  changeType = (ballTypeNum) => {
    let newBallType = ballTypeNum;
    this.setState({
      sportId: newBallType,
    })

    this.props.changeBallType(newBallType);
    return this._changeGameType();
  }
  render() {
    return (
      <View style={styles.container}>
          {
            this.state.sportId == 1?(
            <View>              
              <View style={[styles.banlace,{borderColor:'#ccc',borderBottomWidth:1}]}>
                  <TouchableOpacity onPress={()=>{this.changeType(2)}} style = {styles.ballButton}>
                      <Image source ={require('../resource/icon_78.png')} style = {styles.imageIcon}></Image>
                  </TouchableOpacity>
              </View>
              <View style={styles.banlace}>
                  <TouchableOpacity onPress={()=>{this.changeType(3)}} style = {styles.ballButton}>
                      <Image source ={require('../resource/icon_70.png')} style = {styles.imageIcon}></Image>
                  </TouchableOpacity>
              </View>
            </View>)
              :
            (this.state.sportId == 2?
            (<View>
                <View style={[styles.banlace,{borderColor:'#ccc',borderBottomWidth:1}]}>
                    <TouchableOpacity onPress={()=>{this.changeType(1)}} style = {styles.ballButton}>
                        <Image source ={require('../resource/icon_59.png')} style = {styles.imageIcon}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.banlace}>
                    <TouchableOpacity onPress={()=>{this.changeType(3)}} style = {styles.ballButton}>
                        <Image source ={require('../resource/icon_70.png')} style = {styles.imageIcon}></Image>
                    </TouchableOpacity>
                </View>
              </View>)
              :
              (<View>
                  <View style={[styles.banlace,{borderColor:'#ccc',borderBottomWidth:1}]}>
                      <TouchableOpacity onPress={()=>{this.changeType(1)}} style = {styles.ballButton}>
                          <Image source ={require('../resource/icon_59.png')} style = {styles.imageIcon}></Image>
                      </TouchableOpacity>
                  </View>
                <View style={styles.banlace}>
                    <TouchableOpacity onPress={()=>{this.changeType(2)}} style = {styles.ballButton}>
                        <Image source ={require('../resource/icon_78.png')} style = {styles.imageIcon}></Image>
                    </TouchableOpacity>
                </View>
              </View>)
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: (Platform.OS === 'ios')?101:81,
    left: 0.1 * Screen.ScreenWidth-35,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  banlace: {
    height: 40,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: {
    width: 26,
    height: 20,
    resizeMode: 'contain',
  },
  ballButton: {
    justifyContent: 'center',
    width: 80,
    flex: 1,
    alignItems: 'center',
  },
});