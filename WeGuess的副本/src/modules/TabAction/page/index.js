import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';
import {
    connect
} from 'react-redux';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {GetSearchActionUrl} from '../../Config/apiUrlConfig.js';
import {StatusBar} from "../../Component/BackButton";
import PullListView from "../../Component/PullListView";
import RowItem from "./RowItem";

class TabAction extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        return {
            header: null //隐藏navigation
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            canLoad: false,
            data: [],
            pageIndex: 1,
            pageSize: 10,
        }
    }

    componentDidMount() {
        if (this.props.loginStore.hasToken) {
            this.onPullRelease(() => {
            });
        }
    }

    //打开APP获取token需要时间，所以选择在获取到token后，TabAction页面才去请求数据。reducer中loginStore.hasToken变化触发shouldComponentUpdate
    shouldComponentUpdate(nextProps, nextState) {
        if (!this.props.loginStore.hasToken && nextProps.loginStore.hasToken) {
            this.onPullRelease(() => {
            });
        }
        //登录或退出后刷新活动列表
        if (this.props.loginStore.isLoggedIn !== nextProps.loginStore.isLoggedIn) {
            this.onPullRelease(() => {
            });
        }
        return true
    }


    onPullRelease = (resolve) => {
        this.getBuyAnalysis(resolve, true);
    }

    onEndReached = (resolve) => {
        this.getBuyAnalysis(resolve);
    }

    getBuyAnalysis = (resolve, isRefresh) => {
        let {pageIndex, pageSize} = this.state;
        let params = {
            PageIndex: isRefresh ? 1 : pageIndex,
            PageSize: pageSize
        }
        let that = this;
        this.networking.get(GetSearchActionUrl, params, {}).then((responense) => {
            let {Result, Data} = responense;
            if (Result == 1) {
                let rowsData = Data ? Data : [];
                let length = rowsData.length;

                if (isRefresh) {
                    that.setState({data: [].concat(rowsData), canLoad: true});
                } else {
                    that.setState({data: that.state.data.concat(rowsData), canLoad: true});
                }
                if (length < pageSize) {
                    resolve(true);
                } else {
                    resolve();
                    that.setState({pageIndex: this.state.pageIndex + 1})
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

    onPress = (type, ID, status, code) => {
        this.props.navigation.navigate('ActionDetail', {
            type,
            ActionID: ID,
            status,
            headerTitle: code,
            refresh: () => {
                this.onPullRelease(() => {
                })
            }
        });
    }

    renderRow = (rowData) => {
        if (rowData.Status != 1) {
            return (
                <RowItem data={rowData} onPress={this.onPress}/>
            )
        } else {
            return (
                <View style={{height: 0}}></View>
            )
        }
    }

    render() {
        let Alert = this.Alert;
        if (this.state.canLoad) {
            return (
                <View style={styles.container}>
                    <StatusBar/>
                    <PullListView renderRow={this.renderRow}
                                  data={this.state.data}
                                  onPullRelease={this.onPullRelease}
                                  onEndReached={this.onEndReached}/>
                    <Alert ref={(refAlert) => {
                        this.alert = refAlert
                    }}></Alert>
                </View>
            )
        }
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator
                size="large" color="#3a66b3"/>
                <Alert ref={(refAlert) => {
                    this.alert = refAlert
                }}></Alert></View>
        )

    }
}

const mapStateToProps = state => ({
    loginStore: state.loginStore,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TabAction);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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

})

