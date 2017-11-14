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
    Dimensions
} from 'react-native';
const {width} = Dimensions.get('window');

export default class AnalysisItem extends Component {

    constructor(props) {
        super(props);
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

    render() {
        let {itemData, dataToPredict} = this.props;
        return (
            <View style={styles.analysisItem}>
                <View>
                    <View>
                        <View style={styles.infoTitle}>
                            <Text style={styles.titleText}>推荐结果</Text>
                        </View>
                        <View style={styles.moduleStyle}>
                            {itemData.RecommendedResult.map((data, index) =>
                                <View key={index} style={styles.recommendResult}>
                                    <View>
                                        <Text style={styles.market}>{data.Name}</Text>
                                    </View>
                                    <View style={styles.resultBox}>
                                        <Text style={styles.resultLeft}>{data.Result}</Text>
                                        <Text style={styles.resultRight}>{data.Score}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                        <View style={styles.straight}/>
                    </View>
                    <View>
                        <View style={styles.infoTitle}>
                            <Text style={styles.titleText}>专家解盘</Text>
                        </View>
                        <View>
                            <Text style={[styles.moduleStyle, {
                                color: '#929292',
                                fontSize: 12,
                                marginTop: 10
                            }]}>{itemData.ExpertAnalysis}</Text>
                        </View>
                        <View style={styles.straight}/>
                    </View>
                    <View>
                        <View style={styles.infoTitle}>
                            <Text style={styles.titleText}>数据预测</Text>
                        </View>
                        <View>
                            <View style={styles.forecastBox}>
                                <View style={styles.forecastTitle}>
                                    <Text style={styles.forecastTitleText}>标盘</Text>
                                </View>
                                <View style={styles.forecastContent}>
                                    <View style={styles.binding}>
                                        <Text style={styles.forecastCase}>主胜</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_1X2.HomePro * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={styles.binding}>
                                        <Text style={styles.forecastCase}>和局</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_1X2.DrawPro * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={styles.binding}>
                                        <Text style={styles.forecastCase}>客胜</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_1X2.AwayPro * 100).toFixed(2)}%</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.forecastBox}>
                                <View style={styles.forecastTitle}>
                                    <Text style={styles.forecastTitleText}>亚盘</Text>
                                </View>
                                <View style={styles.forecastContent}>
                                    <View style={styles.binding}>
                                        <Text
                                            style={styles.forecastCase}>上盘 {dataToPredict.F_HDP.Hdp}</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_HDP.HomePro * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={styles.binding}>
                                        <Text style={styles.forecastCase}>走盘 -</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_HDP.DrawPro * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={styles.binding}>
                                        <Text
                                            style={styles.forecastCase}>下盘 {-dataToPredict.F_HDP.Hdp}</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_HDP.AwayPro * 100).toFixed(2)}%</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.forecastBox}>
                                <View style={styles.forecastTitle}>
                                    <Text style={styles.forecastTitleText}>大小</Text>
                                </View>
                                <View style={styles.forecastContent}>
                                    <View style={styles.binding}>
                                        <Text
                                            style={styles.forecastCase}>大 {this.ratio(dataToPredict.F_OU.Hdp)}</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_OU.HomePro * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={styles.binding}>
                                        <Text style={styles.forecastCase}>走盘 -</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_OU.DrawPro * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={styles.binding}>
                                        <Text
                                            style={styles.forecastCase}>小 {this.ratio(dataToPredict.F_OU.Hdp)}</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_OU.AwayPro * 100).toFixed(2)}%</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.forecastBox}>
                                <View style={styles.forecastTitle}>
                                    <Text style={styles.forecastTitleText}>进球</Text>
                                </View>
                                <View style={styles.forecastContent}>
                                    {this.goals(dataToPredict.F_TG)}
                                </View>
                            </View>
                            <View style={styles.forecastBox}>
                                <View style={styles.forecastTitle}>
                                    <Text style={styles.forecastTitleText}>进球</Text>
                                </View>
                                <View style={[styles.forecastContent,{flexWrap: 'wrap'}]}>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>1:0</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro10 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>0:0</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro00 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>0:1</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro01 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>2:0</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro20 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>1:1</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro11 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>0:2</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro02 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>2:1</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro21 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>2:2</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro22 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>1:2</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro12 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>3:0</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro30 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>3:3</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro33 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>0:3</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro03 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>3:1</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro31 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>4:4</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro44 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>1:3</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro13 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>3:2</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro32 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>主4球以上</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro50 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>2:3</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro23 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>4:0</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro40 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>客4球以上</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro05 * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={[styles.binding, styles.score]}>
                                        <Text style={styles.forecastCase}>0:4</Text>
                                        <Text
                                            style={styles.forecastOdds}>{(dataToPredict.F_CS.Pro04 * 100).toFixed(2)}%</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.straight, {marginHorizontal: 0}]}/>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    analysisItem:{
        backgroundColor: '#fff'
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
    recommendResult:{
        flexDirection: 'row',
        marginTop: 10},
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
    forecastContent:{
        flexDirection: 'row'
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
    }
});