/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import {
    connect
} from 'react-redux';
import {bindActionCreators} from 'redux';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {
    GetSearchActionUrlByActionIDUrl,
    GetWinnerListUrl,
    PostActionBetUrl,
    WebViewUrl
} from '../../Config/apiUrlConfig.js';
import Detail from './actiondetail';
import {BackButton, HelpButton} from "../../Component/BackButton";
import * as Actions from '../../TokenManager/reducer/action';

class ActionDetail extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        const {params} = state;
        return {
            headerTitle: params.headerTitle,
            headerLeft: (
                <BackButton onPress={() => {
                    //返回前如果提交了答案，则刷新活动列表
                    if (params.isSubmit) {
                        params.refresh();
                    }
                    navigation.goBack();
                }}/>
            ),
            headerRight: (
                <HelpButton onPress={() => {
                    params.help(WebViewUrl.actionHelp.url + params.type, WebViewUrl.actionHelp.title)
                }}/>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            //有中奖名单
            hasWinner: false,
            winnersData: [{WinLose: 0}],
            isHiddenFooter: true,
            pageIndex: 1,
            hasMorePageIndex: true,
            //问题回答完没有
            hasAnswerAllQuestion: false,
            //是否显示问题没回答完的提示
            showAnswerAllQuestionTips: false,
            //提交问题数据
            answerData: [],
            //按钮状态
            order: '',
            //提交后详情页参加人数与豆子数是否改变
            isChangePageNumber: false
        }
        //loadMore节流,
        this.isLock = false;
        this.loadMore = this.loadMore.bind(this);
        this.submit = this.submit.bind(this);
        this.addAnswerData = this.addAnswerData.bind(this);
        this.checkedBean = this.checkedBean.bind(this);
        this.postAnswer = this.postAnswer.bind(this);
        this.goLogin = this.goLogin.bind(this);

    }

    componentWillMount() {

        this.props.navigation.setParams({
            help: this.help,
            isSubmit: false
        })

    }

    help = (url, title) => {
        this.showWebView(url, title);
    }

    goLogin() {
        this.props.navigation.navigate("Login")
    }

    //添加数据方法
    addAnswerData(data, bool) {
        this.state.answerData = JSON.stringify(data);
        this.state.hasAnswerAllQuestion = bool;
        bool && this.setState({
            showAnswerAllQuestionTips: false
        })
    }

    //检查豆子够不够
    checkedBean() {
        if (this.state.data.Action.EntryFee > this.props.loginStore.bean) {
            this.showAlert("提示", "余额错误：余额不足", null, null)
        } else {
            this.postAnswer();
        }
    }

    //点击提交
    submit = (data) => {
        if (!this.props.loginStore.isLoggedIn) {////如果未登录
            this.showLogin(this.goLogin);//去登录
        } else {
            if (!this.state.hasAnswerAllQuestion) {//如果没有答完问题
                this.setState({
                    showAnswerAllQuestionTips: true
                })

                return;
            }
            if (this.state.data.Action.Type !== 1) {//如果不是五串一

                this.showAlert("提示", "参加该次活动需扣除您" + this.state.data.Action.EntryFee + "猜豆，是否继续", this.checkedBean, () => {
                    return
                }, '是', '否')//检查豆子够不够
            } else {
                this.postAnswer();
            }
        }
    }

    //提交请求
    postAnswer() {
        this.showLoading();
        const {Action} = this.state.data;
        let params = {
            ActionID: Action.ID,
            ActionType: Action.Type,
            Answers: this.state.answerData,
            Bean: Action.EntryFee
        }
        this.networking.post(PostActionBetUrl, params, {}).then((responseData) => {
            let {Result, Data} = responseData;

            if (Result === 1) {
                this.hideLoading();
                this.setState({
                    //按钮变化
                    order: 2,
                    //人数和豆子变化
                    isChangePageNumber: true
                })
                //改变提交状态，导航栏会用到
                this.props.navigation.setParams({
                    isSubmit: true
                })
                //
                this.props.getMemberInfo();
                //
            } else {
                this.hideLoading();
                this.showError(Result);
            }

        }, (error) => {
            this.showError(error)
        }).catch((error) => {
            this.hideLoading();
            this.showError(error);
        })
    }


    render() {
        const {data, winnersData, hasWinner, isHiddenFooter, showAnswerAllQuestionTips, order, isChangePageNumber} = this.state;
        let WebView = this.WebView;
        let Alert = this.Alert;
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                {data ? (
                    <Detail Data={data} winners={winnersData} hasWinner={hasWinner} isHiddenFooter={isHiddenFooter}
                            submit={this.submit} loadMore={this.loadMore}
                            showAnswerAllQuestionTips={showAnswerAllQuestionTips} addAnswerData={this.addAnswerData}
                            order={order} isChangePageNumber={isChangePageNumber}></Detail>) : (
                    <View style={styles.ai}>
                        <ActivityIndicator size="large" color="#3a66b3"/>
                    </View>)
                }
                <WebView ref={(refWebView) => {
                    this.webview = refWebView
                }}></WebView>
                <Alert ref={(refAlert) => {
                    this.alert = refAlert;
                }}></Alert>
                <Loading ref={(refLoading) => {
                    this.loading = refLoading;
                }}></Loading>
            </View>
        )
    }

    componentDidMount() {
        const {state, setParams} = this.props.navigation;
        const {params} = state;

        this.networking.post(GetSearchActionUrlByActionIDUrl, {ActionID: params.ActionID}, {}).then((responseData) => {
            const {Result, Data} = responseData;
            if (Result != 1) {
                this.showError(Result);
            } else {
                this.setState({
                    data: Data
                })

            }
        }, (error) => {
            this.showError(error)
        }).catch((error) => {

            this.showError(error)

        })
        //如果活动已经结束，则应该渲染有中奖者列表
        if (params.status === 3) {
            this.networking.post(GetWinnerListUrl, {
                "ActionID": params.ActionID,
                "PageIndex": 1,
                "PageSize": 20
            }, {}).then((responseData) => {
                //const {Result,Data} = responseData;
                if (responseData.Result != 1) {
                    this.showError(responseData.Result);
                } else {
                    if (responseData.Data < 20) {
                        this.setState({
                            hasMorePageIndex: false
                        })
                    }
                    this.setState({
                        winnersData: responseData.Data,
                        hasWinner: true,
                    })
                }
            })
        }
    }

    loadMore() {
        if (this.isLock) return;
        this.isLock = true;
        if (this.state.data.Action.Status === 3 && this.state.pageIndex && this.state.hasMorePageIndex) {
            var nowPageIndex = this.state.pageIndex + 1;
            this.setState({
                isHiddenFooter: false,
            })
            let params = {
                "ActionID": this.props.navigation.state.params.ActionID,
                "PageIndex": nowPageIndex,
                "PageSize": 20
            };

            this.networking.post(GetWinnerListUrl, params, {}).then((responseData) => {
                this.isLock = false;
                const {Result, Data} = responseData;
                if (Result != 1) {
                    this.showError(Result);
                } else {
                    if (Data.length < 20) {
                        this.setState({
                            hasMorePageIndex: false
                        })
                    }
                    var arr = this.state.winnersData;
                    arr.push.apply(arr, Data)
                    this.setState({
                        winnersData: arr,
                        isHiddenFooter: true,
                        pageIndex: nowPageIndex
                    })

                }
            })
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    ai: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const mapStateToProps = state => ({
    loginStore: state.loginStore
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(ActionDetail);