/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
} from 'react-native';

import {
    connect
} from 'react-redux';
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import {BackButton, BlankButton} from "../../Component/BackButton";
import AnalysisList from './analysisList';
import {GetGuessAnalysisByNoUrl} from "../../Config/apiUrlConfig";


const {width} = Dimensions.get('window');

class AnalysisDetail extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        const {state, setParams} = navigation;
        const {params} = state;
        return {
            headerTitle: "解盘详情",
            headerLeft: (
                <BackButton onPress={() => {
                    params.callback();
                    navigation.goBack();
                }}/>
            ),
            headerRight: (
                <BlankButton/>
            ),
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            guessInfo: null,
            alwaysShow: false,
        };
    }

    componentWillMount() {
        const {params} = this.props.navigation.state;
        this.networking.get(GetGuessAnalysisByNoUrl, {analysisNo: params.AnalysisNo}, {})
            .then((responseData) => {
                let {Result, Data} = responseData;
                if (Result == 1) {
                    let GuessMatchLength = JSON.parse(Data.GuessMatch).length;
                    if (GuessMatchLength == 1) {
                        this.setState({alwaysShow: true})
                    }
                } else {
                    this.showError(Result);
                }
                this.setState({
                    guessInfo: Data
                });
            })
            .done();
    }


    render() {
        const {guessInfo} = this.state;
        if (!guessInfo) {
            return <View/>;
        }

        return (
            <ScrollView style={styles.analysisDetail}>
                <AnalysisList item={guessInfo} alwaysShow={this.state.alwaysShow}/>
                <View style={styles.footer}>
                    <Text style={styles.annotation}>*以上资料数据仅供浏览、参考之用，并不作为竞猜和彩票投注的依据。</Text>
                </View>
            </ScrollView>
        )
    }
}


const mapStateToProps = state => ({
    loginStore: state.loginStore
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch({type: 'Logout'}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisDetail);

const styles = StyleSheet.create({
    analysisDetail:{
        backgroundColor: '#fff',
        flex: 1
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
    }
});