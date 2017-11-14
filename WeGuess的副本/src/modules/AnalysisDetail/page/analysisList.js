/**
 * Created by ml23 on 2017/08/15.
 */

import React, {
    Component
} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import AnalysisItem from './analysisItem';
const {width} = Dimensions.get('window');

export default class AnalysisList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            analysisShow: [this.props.alwaysShow]
        }
    }

    ratio(number) {
        const str = number.toString().replace(/\d+\.(\d*)/, "$1");//获取小数
        if (str.length === 1) {
            return number;
        }
        else {
            let rat = ((number * 2 + 0.5) / 2 - 0.5) + '/' + ((number * 2 + 0.5) / 2);
            return rat;
        }
    }

    goals(Obj) {
        let data = [];
        for (let key in Obj) {
            data.push(
                <View key={key} style={styles.binding}>
                    {key.substr(-1, 1) === '0' ?
                        <Text style={styles.forecastCase}>{key.substr(-2, 1)}+</Text> :
                        <Text style={styles.forecastCase}>{key.substr(-2, 1)}~{key.substr(-1, 1)}</Text>
                    }
                    <Text style={styles.forecastOdds}>{(Obj[key] * 100).toFixed(2)}%</Text>
                </View>
            )
        }
        return data;
    }


    analysisIsShow(index) {
        if (!this.props.alwaysShow) {
            const {analysisShow} = this.state;
            analysisShow[index] = !analysisShow[index];
            this.setState({
                analysisShow
            })
        }
    }

    render() {
        let {analysisShow} = this.state;
        let {alwaysShow, item} = this.props;
        const {GuessMatch, EndTimeStr} = item;
        let GuessMatchList = JSON.parse(GuessMatch);
        let bgColor= this.props.bgColor;
        return (
            <View style={{backgroundColor: '#fff'}}>
                {
                    GuessMatchList.map((itemData, index) => {
                        let dataToPredict = JSON.parse(itemData.DataToPredict);
                        return (
                            <View key={index}>
                                <TouchableOpacity activeOpacity={1}
                                                  onPress={() => this.analysisIsShow(index)}>
                                    <View style={[styles.headerStyle,bgColor?{backgroundColor:bgColor}:null]}>
                                        <View style={styles.headerLeft}>
                                            <Text numberOfLines={1} style={styles.league}>{itemData.MatchInfo.League}</Text>
                                            <Text style={styles.timer}>{EndTimeStr}</Text>
                                        </View>
                                        <View style={styles.headerRight}>
                                            <Text numberOfLines={1} style={styles.teamHome}>{itemData.MatchInfo.Home}</Text>
                                            <Text style={styles.VS}>vs</Text>
                                            <Text numberOfLines={1} style={styles.teamAway}>{itemData.MatchInfo.Away}</Text>
                                        </View>
                                        {alwaysShow ? null :
                                            analysisShow[index] ? <Icon name={'ios-arrow-up'} size={12}
                                                                        style={styles.arrowIcon}/> :
                                                <Icon name={'ios-arrow-down'} size={12}
                                                      style={styles.arrowIcon}/>
                                        }
                                    </View>
                                </TouchableOpacity>
                                {analysisShow[index] ?
                                    <AnalysisItem itemData={itemData} dataToPredict={dataToPredict}/> : null}
                            </View>
                        )
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        flexDirection: 'row',
        backgroundColor: '#edeff2',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    league: {
        fontSize: 12,
        color: '#333',
        width:50,

    },
    timer: {
        fontSize: 12,
        color: '#9d9e9e',
    },
    headerRight: {
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 10,
        alignItems: 'center',
    },
    teamHome: {
        fontSize: 14,
        color: '#333',
        textAlign: 'left',
        flex: 1
    },
    VS:{
        color: '#9d9e9e',
        fontSize: 12,
        textAlign: 'center'},
    teamAway: {
        fontSize: 14,
        color: '#333',
        textAlign: 'right',
        flex: 1
    },
    infoTitle: {
        borderLeftWidth: 3,
        borderColor: '#3a66b3',
        paddingLeft: 10,
        marginLeft: 7,
        marginTop: 15,
    },
    titleText: {
        fontSize: 14,
        color: '#333',
    },
    moduleStyle: {
        marginHorizontal: 20,
    },
    market: {
        fontSize: 12,
        paddingVertical: 8,
        width: 80,
        backgroundColor: '#3a66b3',
        color: '#fff',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        textAlign: 'center',
    },
    resultBox: {
        flex: 1,
        marginLeft: 5,
        paddingVertical: 6,
        paddingHorizontal: 8,
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderColor: '#ccc',
        borderWidth: 1,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        alignItems: 'center',
    },
    resultLeft: {
        fontSize: 14,
        color: '#333',
    },
    resultRight: {
        fontSize: 14,
        color: '#f9a174',
        marginLeft: 20,
    },
    straight: {
        borderColor: '#ccc',
        borderBottomWidth: 1,
        marginTop: 10,
        marginHorizontal: 17,
    },
    forecastBox: {
        borderColor: '#3a66b3',
        marginHorizontal: 20,
        marginTop: 20,
        borderWidth: 1,
        borderTopRightRadius: 6,
        borderTopLeftRadius: 6,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    forecastTitle: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        paddingVertical: 10,
        backgroundColor: '#3a66b3',
        justifyContent: 'center',
    },
    forecastTitleText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
    binding: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderColor: '#3a66b3',
        borderLeftWidth: 1,
        borderBottomWidth: 1,
    },
    score: {
        flexBasis: (width - 44) / 3,
        borderColor: '#3a66b3',
        borderBottomWidth: 1,
    },
    forecastCase: {
        color: '#898989',
        fontSize: 12,
    },
    forecastOdds: {
        color: '#333',
        fontSize: 12,
    },
    footer: {
        margin: 20,
    },
    annotation: {
        fontSize: 12,
        color: '#9d9e9e',
    },
    arrowIcon: {
        height: 12,
        width: 12,
        marginLeft: 10
    }
});