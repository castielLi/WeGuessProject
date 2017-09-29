/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    View,
    StyleSheet,
    ListView
} from 'react-native';
import {
    connect
} from 'react-redux';
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import {BackButton, BlankButton} from "../../Component/BackButton";
import TabView from '../../Component/TabView';
import BoughtAnalysisList from './BoughtAnalysisList';
import BuyBetRecordList from './BuyBetRecordList'
import {GetBuyBetRecordUrl, GetBoughtAnalysisUrl} from '../../Config/apiUrlConfig';

class BuyRecommend extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: "购买推荐",
            headerLeft: (
                <BackButton onPress={() => {
                    navigation.goBack();
                }}/>
            ),
            headerRight: (
                <BlankButton/>
            ),
        };
    };

    componentDidMount() {
        this.getBuyAnalysis(true);
    }

    constructor(props) {
        super(props);
        this.state = {
            type: 0,
            pageIndex: 1,
            pageSize: 10,
            noMorData: false,
            isLoading: false,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),

            pageIndexAnalysis: 1,
            pageSizeAnalysis: 20,
            noMorDataAnalysis: false,
            isLoadingAnalysis: false,
            dataSourceAnalysis: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            dataAnalysis: []
        }
        this.dataRecord = [];
        this.dataAnalysis = [];
        this.tabList = ["众猜解盘", "达人推荐"];
    }

    getBuyBetRecord = (isRefresh, resolve) => {
        let {isLoading, pageIndex, pageSize, noMorData} = this.state;
        if (isLoading || (!isRefresh && noMorData)) {
            return;
        }
        try {
            this.setState({
                isLoading: true
            })
            let index = 1;
            if (isRefresh) {
                this.setState({
                    noMorData: false
                })
            } else {
                index = pageIndex + 1;
            }
            let params = {
                PageIndex: index,
                PageSize: pageSize
            }
            let that = this;
            this.networking.get(GetBuyBetRecordUrl, params, {}).then((responense) => {
                let {Result, Data} = responense;
                if (Result == 1) {
                    let rowsData = Data ? Data : [];
                    if (isRefresh) {
                        that.dataRecord = [];
                    }
                    that.dataRecord = that.dataRecord.concat(rowsData);

                    let length = rowsData.length;
                    if (length < pageSize) {
                        this.setState({
                            noMorData: true,
                            dataSource: that.state.dataSource.cloneWithRows(that.dataRecord),
                        })
                    } else {
                        this.setState({
                            dataSource: that.state.dataSource.cloneWithRows(that.dataRecord),
                            PageIndex: index
                        })
                    }
                } else {
                    that.showError(Result);
                }
                that.setState({isLoading: false});
                if (typeof resolve == "function") {
                    resolve();
                }
            }, (error) => {

                this.setState({isLoading: false})
                this.showError(error);
                if (typeof resolve == "function") {
                    resolve();
                }
            }).catch((error) => {

                this.setState({isLoading: false})
                this.showError(error);
                if (typeof resolve == "function") {
                    resolve();
                }
            })
        }
        catch (error) {

            this.setState({
                isLoading: false
            })
            if (typeof resolve == "function") {
                resolve();
            }
        }

    }

    getBuyAnalysis = (isRefresh, resolve) => {
        let that = this;
        let {isLoadingAnalysis, pageIndexAnalysis, pageSizeAnalysis, noMorDataAnalysis} = that.state;
        if (isLoadingAnalysis || (!isRefresh && noMorDataAnalysis)) {
            return;
        }
        try {
            that.setState({
                isLoadingAnalysis: true
            }, () => {
                let index = 1;
                if (isRefresh) {
                    that.setState({noMorDataAnalysis: false})
                } else {
                    index = pageIndexAnalysis + 1;
                }
                let params = {
                    PageIndex: index,
                    PageSize: pageSizeAnalysis
                }
                that.networking.get(GetBoughtAnalysisUrl, params, {}).then((responense) => {
                    let {Result, Data} = responense;
                    if (Result == 1) {
                        let rowsData = Data ? Data : [];
                        let length = rowsData.length;
                        if (length < pageSizeAnalysis) {
                            that.setState({noMorDataAnalysis: true})
                        } else {
                            that.setState({PageIndexAnalysis: index})
                        }

                        for (var i = 0; i < length; i++) {
                            rowsData[i].show = false;
                        }
                        if (isRefresh) {
                            that.setState({dataAnalysis: [].concat(rowsData)}, () => {
                                that.setState({isLoadingAnalysis: false}, () => {
                                    if (typeof resolve == "function") {
                                        resolve();
                                    }
                                })
                            });
                        } else {
                            that.setState({dataAnalysis: that.state.dataAnalysis.concat(rowsData)}, () => {
                                that.setState({isLoadingAnalysis: false}, () => {
                                    if (typeof resolve == "function") {
                                        resolve();
                                    }
                                })
                            });
                        }

                    } else {
                        that.showError(Result, null, () => {
                            that.setState({isLoadingAnalysis: false}, () => {
                                if (typeof resolve == "function") {
                                    resolve();
                                }
                            })
                        });
                    }
                }, (error) => {

                    that.setState({
                        isLoadingAnalysis: false
                    }, () => {
                        that.showError(error, null, () => {
                            if (typeof resolve == "function") {
                                resolve();
                            }
                        });
                    })

                }).catch((error) => {

                    that.setState({
                        isLoadingAnalysis: false
                    }, () => {
                        that.showError(error, null, () => {
                            if (typeof resolve == "function") {
                                resolve();
                            }
                        });
                    })

                })
            })


        }
        catch (error) {

            this.setState({
                isLoadingAnalysis: false
            })
            if (typeof resolve == "function") {
                resolve();
            }
        }
    }

    changeType = (index) => {
        this.setState({type: index});
        if (index === 0) {
            this.getBuyAnalysis(true);
        } else {
            this.getBuyBetRecord(true);
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
        let Alert = this.Alert;
        return (
            <View style={{flex: 1}}>
                <TabView tabList={this.tabList} onPress={this.changeType}></TabView>
                <View style={{height: 1}}>

                </View>
                {
                    this.state.type == 0 ?
                        (<BoughtAnalysisList getBuyAnalysis={this.getBuyAnalysis}
                                             dataSource={this.state.dataSourceAnalysis}
                                             data={this.state.dataAnalysis}
                                             analysisIsShow={this.analysisIsShow}/> ) :
                        (<BuyBetRecordList navigate={this.props.navigation.navigate}
                                           getBuyBetRecord={this.getBuyBetRecord} dataSource={this.state.dataSource}
                                           data={this.dataRecord}/> )
                }
                <Alert ref={(refAlert) => {
                    this.alert = refAlert
                }}></Alert>
            </View>
        )
    }
}

const styles = StyleSheet.create({})

const mapStateToProps = state => ({
    loginStore: state.loginStore
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BuyRecommend);