/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    Button,
    Modal,
    TouchableHighlight,
    Dimensions,
    TouchableOpacity,
    ListView,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import {
    connect
} from 'react-redux';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import PullListView from './PullListView';
let {width, height} = Dimensions.get('window');
import Icon from "react-native-vector-icons/Ionicons";
import AnalysisItem from '../../AnalysisDetail/page/analysisItem';
import AnalysisList from '../../AnalysisDetail/page/analysisList';
import {GetBuyBetRecordUrl, GetBoughtAnalysisUrl, GetSearchActionUrl} from '../../Config/apiUrlConfig';
import {numFormat} from '../../Utils/money';
import {timeFormat} from '../../Utils/time';
import {BackButton, BlankButton} from "../../Component/BackButton";

class Test extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        // return {
        //     headerTitle: "测试",
        //     headerLeft: (
        //         <BackButton onPress={() => {
        //             navigation.goBack();
        //         }}/>
        //     ),
        //     headerRight: (
        //         <BlankButton/>
        //     ),
        // };

        return {
            header: null //隐藏navigation
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            cancelText: "取消",
            okText: "确定11",

            pageIndexAnalysis: 1,
            pageSizeAnalysis: 20,
            noMorDataAnalysis: false,
            isLoadingAnalysis: false,
            dataSourceAnalysis: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            dataAnalysis: []
        };
        this.dataAnalysis = [];
    }

    _title() {
        return (
            <View>
                <Text></Text>
            </View>
        )
    }

    _cancel = () => {
        console.log("cancel");
    }

    _ok = () => {
        console.log("ok");
    }

    onButtonPress = () => {
        //调用showAlert
        this.showAlert("提示", "用户未登录，是否立即登录？", this._ok, this._cancel, this.state.okText);
    }

    onButtonPressAlertError = () => {
        //调用showAlert
        this.showError(5, this._ok);
    }

    onButtonPressCheckLogin = () => {
        //调用showAlert
        if (this.props.loginStore.isLoggedIn) {
            console.log("login");
        } else {
            console.log("no login");
            this.showLogin();
        }

    }
    onButtonPressWebView = () => {
        this.showWebView("http://m.weguess.cn/#/tab/userargreement", "游戏规则");
    }


    onButtonPressLoading = () => {
        this.showLoading();
        let that = this;
        setTimeout(() => {
            that.hideLoading();
        }, 2000)
    }

    componentDidMount() {
    }

    onPullRelease = (resolve) => {
        this.getBuyAnalysis(resolve, true);
    }

    onEndReached = (resolve) => {
        this.getBuyAnalysis(resolve);
    }

    getBuyAnalysis = (resolve, isRefresh) => {
        let {pageIndexAnalysis, pageSizeAnalysis} = this.state;
        let params = {
            PageIndex: isRefresh ? 1 : pageIndexAnalysis,
            PageSize: pageSizeAnalysis
        }
        let that = this;
        this.networking.get(GetSearchActionUrl, params, {}).then((responense) => {
            let {Result, Data} = responense;
            if (Result == 1) {
                let rowsData = Data ? Data : [];
                let length = rowsData.length;

                for (var i = 0; i < length; i++) {
                    rowsData[i].show = false;
                }

                if (isRefresh) {
                    that.setState({dataAnalysis: [].concat(rowsData)});
                } else {
                    that.setState({dataAnalysis: that.state.dataAnalysis.concat(rowsData)});
                }
                if (length < pageSizeAnalysis) {
                    resolve(true);
                } else {
                    resolve();
                    this.setState({pageIndexAnalysis: this.state.pageIndexAnalysis + 1})
                }
            } else {
                that.showError(Result);
            }
        }, (error) => {
            this.showError(error);
            resolve();
        }).catch((error) => {
            this.showError(error);
            resolve();
        })
    }

    onPress() {

    }


    _renderOrderImage(order) {
        if (order == 1) {
            return (
                <Image style={styles.rightIcon} source={require('../resources/joinnow.png')}/>)
        } else if (order == 2) {
            return (
                <Image style={styles.rightIcon} source={require('../resources/join.png')}/>)
        } else if (order == 3) {
            return (
                <Image style={styles.rightIcon} source={require('../resources/full.png')}/>)
        } else if (order == 4) {
            return (
                <Image style={styles.rightIcon} source={require('../resources/cancel.png')}/>)
        } else if (order == 5) {
            return (
                <Image style={styles.rightIcon} source={require('../resources/over.png')}/>)
        } else {
            return (
                <Image style={styles.rightIcon} source={require('../resources/end.png')}/>)
        }
    }

    _renderRowImage(type) {
        if (type === 1) {
            return (
                <Image style={styles.img} source={require('../resources/action1.png')}/>)
        } else if (type === 2) {
            return (
                <Image style={styles.img} source={require('../resources/action2.png')}/>)
        } else {
            return (
                <Image style={styles.img} source={require('../resources/action3.png')}/>)
        }
    }

    renderRow = (rowData, sectionId, rowId) => {
        if (rowData.Status != 1) {
            return (
                <TouchableWithoutFeedback
                    onPress={this.onPress.bind(this, rowData.Type, rowData.ID, rowData.Status, rowData.Code)}>
                    <View style={styles.cell}>
                        {
                            (rowData.Type !== 1 && rowData.IsWin) ? (
                                <Image style={styles.winImg} source={require('../resources/win.png')}/>
                            ) : null
                        }
                        {
                            rowData.Pictures[0] ? (
                                <Image style={styles.img} source={{uri: rowData.Pictures[0]}}/>) : (
                                this._renderRowImage(rowData.Type))
                        }
                        <View style={styles.titBox}>
                            <Text
                                style={[styles.tit, {color: (rowData.Type === 3 ? rowData.Color.trim() : 'rgb(52, 52, 52)')}]}>{rowData.Code}</Text>
                            <View>
                                <Text style={styles.mall}>{rowData.Remark}</Text>
                                <View style={styles.rowIconBox}>
                                    {rowData.Type === 2 ? null :
                                        <Image style={styles.rowIcon} source={require('../resources/person.png')}/>}
                                    <Text
                                        style={styles.time}>{rowData.Type === 2 && rowData.SingleBetCount[0] ? (rowData.SingleBetCount[0].Option + ":" + numFormat(rowData.SingleBetCount[0].BetCount * rowData.EntryFee) + "  " + rowData.SingleBetCount[1].Option + ":" + numFormat(rowData.SingleBetCount[1].BetCount * rowData.EntryFee) + "  " + rowData.SingleBetCount[2].Option + ":" + numFormat(rowData.SingleBetCount[2].BetCount * rowData.EntryFee)) : (rowData.Type === 3 && rowData.Type !== 1 ? (rowData.BetCount + "/" + rowData.MaxPlayers + "人") : (rowData.BetCount + "人"))}</Text>
                                </View>
                                <View style={styles.rowIconBox}>
                                    <Image style={styles.rowIcon} source={require('../resources/endtime.png')}/>
                                    <Text style={styles.time}>{timeFormat(rowData.EndTime, "yyyy年MM月dd日hh:mm截止")}</Text>
                                </View>
                            </View>
                        </View>
                        {this._renderOrderImage(rowData.Order)}
                    </View>
                </TouchableWithoutFeedback>
            )
        } else {
            return (
                <View style={{height: 0}}></View>
            )
        }
    }


    analysisIsShow = (index) => {
        let {dataAnalysis} = this.state;
        var newData = {};
        for (var i in dataAnalysis[index]) {
            newData[i] = dataAnalysis[index][i];
        }
        newData.show = !newData.show;
        dataAnalysis[index] = newData;
        this.setState({dataAnalysis: dataAnalysis});
    }

    render() {
        //this.Alert赋值
        let Alert = this.Alert;
        let Loading = this.Loading;
        let WebView = this.WebView;
        return (
            <View style={styles.container}>
                <Button onPress={this.onButtonPress} title="Alert"></Button>
                <Button onPress={this.onButtonPressAlertError} title="AlertError"></Button>
                <Button onPress={this.onButtonPressCheckLogin} title="CheckLogin"></Button>
                <Button onPress={this.onButtonPressLoading} title="Loading"></Button>
                <Button onPress={this.onButtonPressWebView} title="WebView"></Button>
                <Text style={styles.customFont}>苹方中粗 Apple</Text>
                <Text style={{fontSize:14}}>系统默认 Apple</Text>
                <Alert ref={(refAlert) => {
                    this.alert = refAlert
                }}></Alert>
                <Loading ref={(refLoading) => {
                    this.loading = refLoading
                }}></Loading>
                <WebView ref={(refWebView) => {
                    this.webview = refWebView
                }}></WebView>
            </View>
        );

    }
}


const mapStateToProps = state => ({
    loginStore: state.loginStore
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch({type: 'Logout'}),
});

export default connect(mapStateToProps, mapDispatchToProps)(Test);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    title: {
        color: "#3a66b3"
    },
    cell: {
        height: 116,
        padding: 12,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center'
    },
    img: {
        width: 92,
        height: 92,
        resizeMode: 'stretch'
    },
    winImg: {
        width: 90,
        height: 80,
        resizeMode: 'stretch',
        position: 'absolute',
        top: 0,
        right: 60,
        zIndex: -1
    },
    titBox: {
        flex: 1,
        marginLeft: 20
    },
    tit: {
        color: 'rgb(52, 52, 52)',
        fontSize: 16
    },
    rowIconBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    mall: {
        fontSize: 12,
        color: 'grey',
        marginBottom: 12
    },
    time: {
        fontSize: 12,
        color: 'grey',
        marginLeft: 5
    },
    rowIcon: {
        width: 16,
        height: 16,
        resizeMode: 'stretch',
    },
    rightIcon: {
        width: 22,
        height: 64,
        resizeMode: 'stretch',

    },
    topTab: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    topTabCellL: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    topTabCellC: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topTabCellR: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    customFont: {
        fontFamily: "CustomFont",
        fontSize: 14
    },
});