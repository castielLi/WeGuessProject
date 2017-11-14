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
} from 'react-native';

import GameType from './gameType'
export default class HeaderTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showGameType: this.props.showGameType,
        };
    }

    //头部tab切换
    _press(statusId) {
        this.props.callback(statusId);
    }

    _gameType = () => {
        let newShowType = !this.state.showGameType;
        this.setState({
            showGameType: newShowType,
        });
        this.props.changeShowType(newShowType);

    }

    render() {
        const type = { //头部tab切换 按时间 按联赛 滚球 串关
            time: '1',
            league: '2',
            live: '3',
            mix: '4',
        }
        return (
            <View style={styles.gamecontainer}>
                <View style={[styles.balance]}>
                    <TouchableOpacity onPress={() => {
                        this._gameType()
                    }}>
                        <View style={styles.buttonImg}>
                            {
                                this.props.ballType == 0 ? (<Image source={require('../resource/icon_57.png')}
                                                                   style={styles.ballIcon}></Image>) :
                                    (this.props.ballType == 1 ? (<Image source={require('../resource/icon_75.png')}
                                                                        style={styles.ballIcon}></Image>) :
                                        (<Image source={require('../resource/icon_68.png')}
                                                style={styles.ballIcon}></Image>))
                            }
                            {
                                !this.state.showGameType ? (<Image source={require('../resource/icon_18.png')}
                                                                   style={styles.downButton}></Image>) : (
                                    <Image source={require('../resource/icon_20.png')}
                                           style={styles.downButton}></Image>)
                            }
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.balance,]}>
                    <TouchableOpacity onPress={() => {
                        this._press(type.time)
                    }}><Text style={{color: '#808080',}}>按日期</Text></TouchableOpacity>
                </View>
                <View style={[styles.balance,]}>
                    <TouchableOpacity onPress={() => {
                        this._press(type.league)
                    }}><Text style={{color: '#808080',}}>按比赛</Text></TouchableOpacity>
                </View>
                <View style={[styles.balance,]}>
                    <TouchableOpacity onPress={() => {
                        this._press(type.live)
                    }}><Text style={{color: '#808080'}}>滚球</Text></TouchableOpacity>
                </View>
                <View style={[styles.balance,]}>
                    <TouchableOpacity onPress={() => {
                        this._press(type.mix)
                    }}><Text style={{color: '#808080'}}>串关</Text></TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    gamecontainer: {
        flexDirection: 'row',
        height: 40,
        //justifyContent: 'space-between',
        // alignItems: 'center',
        //borderTopWidth:1,
        //borderTopColor:'#ccc',
        //borderBottomWidth:1,
        //borderBottomColor:'#ccc',
    },
    balance: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    rank: {
        width: 50,
        marginLeft: 100,
        alignItems: 'center',
    },
    list: {
        width: 50,
        alignItems: 'center',
    },
    ballIcon: {
        width: 30,
        height: 25,
        resizeMode: 'contain',
    },
    downButton: {
        width: 15,
        height: 10,
        resizeMode: 'stretch',
    },
    buttonImg: {
        width: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});