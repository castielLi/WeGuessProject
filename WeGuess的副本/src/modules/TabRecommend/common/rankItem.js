/**
 * Created by Hsu. on 2017/8/10.
 */

import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

export default class RankItem extends Component {
    constructor(props) {
        super(props);
        this.Opacity = null;
    }

    static defaultProps = {
        onCheck: null,
    };

    render() {
        const {data, onCheck, index} = this.props;
        if (onCheck) {
            this.Opacity = .5;
        } else {
            this.Opacity = 1;
        }
        if (data) {
            return (
                <View style={styles.outlineBox}>
                    <TouchableWithoutFeedback activeOpacity={this.Opacity} onPress={onCheck}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.userImageView}>
	                            { data.HeadPicture ? <Image source={{uri: data.HeadPicture}} style={styles.picture}/> :
	                                <Image source={require('../../Resources/head.png')} style={styles.picture}/> }
	                            {index !== undefined ?
	                                <View
	                                    style={[styles.badge, {backgroundColor: index == 0 ? '#FF3030' : index == 1 ? '#FF7F24' : index == 2 ? '#FFB90F' : '#666'}]}>
	                                    <Text
	                                        style={[styles.badgeText, {right: index > 8 ? 2 : 4}]}>{parseInt(index) + 1}</Text>
	                                </View>
	                                :
	                                null
	                            }
	                        </View>
	                        <View style={styles.infoBox}>
	                            <Text style={styles.userName}>{data.Nickname}</Text>
	                            <Text style={styles.fontColor_333}>
	                                最高连红:<Text style={styles.winText}>{data.MaxSuccessiveWin}&nbsp;&nbsp;</Text>
	                                当前连红:<Text style={styles.winText}>{data.CurrentSuccessiveWin}&nbsp;&nbsp;</Text>
	                                近20场胜率:<Text style={styles.winText}>{data.Rate}</Text>
	                            </Text>
	                            <View style={styles.winBox}>
	                                <Text style={styles.fontColor_333}>近10中{data.WinCount}</Text>
	                                <View style={styles.resultBlock}>
	                                    {data.WinLose.map((isWin, index) => {
	                                        if (isWin === 'W') {
	                                            return <View key={index} style={styles.winBlock}>
	                                                <Text style={styles.isWinText}>{isWin}</Text></View>
	                                        }
	                                        else {
	                                            return <View key={index} style={styles.defeatBlock}>
	                                                <Text style={styles.isWinText}>{isWin}</Text></View>
	                                        }
	                                    })}
	                                </View>
	                            </View>
	                        </View>
                        </View>                       
                    </TouchableWithoutFeedback>
                </View>
            );
        } else {
            return (
                <View>
                    <View style={[styles.outlineBox, {flexDirection: 'row'}]}>
                        <View>
                            <Image source={require('../../Resources/head.png')} style={styles.picture}/>
                        </View>
                        <View style={{marginLeft: 12, justifyContent: 'center'}}>
                            <Text style={styles.fontColor_333}>
                                最高连红:<Text style={styles.winText}/>
                                当前连红:<Text style={styles.winText}/>
                                近20场胜率:<Text style={styles.winText}/>
                            </Text>
                            <View style={[styles.winBox, {marginTop: 10}]}>
                                <Text style={styles.fontColor_333}>近10中</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.noMore}>
                        <Text style={styles.noMoreText}>无发布的注单</Text>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    outlineBox: {
        padding: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#ddd'
    },
    userImageView: {
        height: 64,
        width: 64,
        overflow: 'hidden'
    },
    picture: {
        height: 64,
        width: 64
    },
    infoBox: {
        marginLeft: 12,
        justifyContent: 'space-between'
    },
    userName: {
        color: '#3a66b3',
        fontSize: 14
    },
    winText: {
        color: '#da0000'
    },
    fontColor_333: {
        color: '#333',
        fontSize: 12,
    },
    winBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    resultBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20
    },
    winBlock: {
        marginLeft: 2,
        height: 12,
        width: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d90000'
    },
    defeatBlock: {
        marginLeft: 2,
        height: 12,
        width: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#009944'
    },
    isWinText: {
        fontSize: 10,
        color: '#fff',
        lineHeight: 12
    },
    badge: {
        width: 34,
        height: 34,
        justifyContent: 'center',
        position: 'absolute',
        top: -17,
        left: -17,
        transform: [{rotate: '45deg'}]
    },
    badgeText: {
        position: 'absolute',
        fontSize: 10,
        transform: [{rotate: '-45deg'}],
        color: '#fff',
    },
    noMore: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    noMoreText: {
        fontSize: 14,
    }
});