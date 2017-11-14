/**
 * Created by maple on 2017/08/11.
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ListView,
    Dimensions
} from 'react-native';
import {PullList} from 'react-native-pull';
import DisplayComponent from '../../.././Core/Component/index';
import Icon from "react-native-vector-icons/Ionicons";
import AnalysisItem from '../../AnalysisDetail/page/analysisItem';
import AnalysisList from '../../AnalysisDetail/page/analysisList';
const {width} = Dimensions.get('window');

class BoughtAnalysisList extends DisplayComponent {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                return r1 !== r2;
            }
        });
        this.datas = props.data.slice(0);
        this.state = {
            analysisShow: [],
            dataSource: ds.cloneWithRows(this.datas),
        }
    }

    componentWillReceiveProps(newProps) {

        this.datas = newProps.data.slice(0);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.datas),
        });
    }


    onPullRelease = (resolve) => {
        this.props.getBuyAnalysis(true, resolve);
    }

    onEndReached = () => {
        this.props.getBuyAnalysis();
    }


    analysisIsShow = (index) => {
        const {analysisShow} = this.state;
        analysisShow[index] = !analysisShow[index];
        this.setState({
            analysisShow,
            isChange: !this.state.isChange
        })
    }

    renderRow = (rowData, sectionId, rowId) => {
        let index = parseInt(rowId);
        const {GuessMatch, EndTimeStr} = rowData;
        let GuessMatchList = JSON.parse(GuessMatch);
        if (GuessMatchList.length == 1) {
            let itemData = GuessMatchList[0];
            let dataToPredict = JSON.parse(itemData.DataToPredict);
            return (
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => this.props.analysisIsShow(index)}>
                        <View style={styles.headerStyle}>
                            <View style={styles.headerLeft}>
                                <Text style={styles.league}>{itemData.MatchInfo.League}</Text>
                                <Text style={styles.timer}>{EndTimeStr}</Text>
                            </View>
                            <View style={styles.headerRight}>
                                <Text style={styles.teamHome}>{itemData.MatchInfo.Home}</Text>
                                <Text
                                    style={{color: '#9d9e9e', fontSize: 12, textAlign: 'center'}}>vs</Text>
                                <Text style={styles.teamAway}>{itemData.MatchInfo.Away}</Text>
                            </View>
                            {
                                rowData.show ?
                                    (<Icon name={'ios-arrow-up'} size={12} style={styles.arrowIcon}/>) :
                                    (<Icon name={'ios-arrow-down'} size={12} style={styles.arrowIcon}/>)
                            }
                        </View>
                    </TouchableWithoutFeedback>
                    {
                        rowData.show ? (
                            <AnalysisItem itemData={itemData} dataToPredict={dataToPredict}/>
                        ) : null
                    }
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => this.props.analysisIsShow(index)}>
                        <View style={styles.headerStyle}>
                            <View style={styles.headerLeft}>
                                <Text style={styles.teamHome}>{rowData.Title}</Text>
                            </View>
                            {
                                rowData.show ?
                                    (<Icon name={'ios-arrow-up'} size={12} style={styles.arrowIcon}/> ) :
                                    (<Icon name={'ios-arrow-down'} size={12} style={styles.arrowIcon}/>)
                            }
                        </View>
                    </TouchableWithoutFeedback>
                    {
                        rowData.show ? (
                            <AnalysisList item={rowData} bgColor="#e4ecf9"/>
                        ) : null
                    }
                </View>
            )
        }


    }
    renderFooter=()=>{
        return (
            <Text style={styles.tip}>*以上资料数据仅供浏览、参考之用，并不作为竞猜和彩票投注的依据。</Text>
        )
    }

    render() {
        if (this.props.data && this.props.data.length > 0) {
            return (
                <PullList enableEmptySections={true}
                          style={{flex: 1}}
                          initialListSize={10}
                          pageSize={10}
                          onPullRelease={this.onPullRelease}
                          onEndReached={this.onEndReached}
                          dataSource={this.state.dataSource}
                          renderRow={this.renderRow}
                          onEndReachedThreshold={60}
                          renderFooter={this.renderFooter}
                >
                </PullList>
            )
        } else {
            return (
                <Text style={{textAlign: 'center', color: '#999', marginTop: 20, fontSize: 16}}>无记录</Text>
            )
        }
    }
}

export default BoughtAnalysisList;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bgColor: {
        backgroundColor: "#edeff2"
    },
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
        flex: 1,
        alignItems: 'center',
    },

    league: {
        fontSize: 12,
        color: '#333'
    },
    timer: {
        fontSize: 12,
        color: '#9d9e9e',
    },
    headerRight: {
        flexDirection: 'row',
        flex: 2,
        marginHorizontal: 10,
        alignItems: 'center',
    },
    teamHome: {
        fontSize: 14,
        color: '#333',
        textAlign: 'left',
        flex: 1
    },
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
    },
    tip: {
        fontSize: 12,
        paddingLeft: 4,
        paddingRight: 4,
        color: '#999',
        textAlign: "left"
    }
});
