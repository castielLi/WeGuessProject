/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React, {
    Component
} from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    ListView,
} from 'react-native';
import {BackButton, BlankButton} from "../../Component/BackButton";
import ContainerComponent from '../../.././Core/Component/ContainerComponent';

import ListViewPull from '../../TabRecommend/common/listViewPull';
import RankItem from '../../TabRecommend/common/rankItem';
import {GetPublishRankUrl} from '../../Config/apiUrlConfig';

class Rank extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: "更多",
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

    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        const {state, setParams} = this.props.navigation;
        const {params} = state;
        this.state = {
            DataSource: ds,
            isLoading: 0,//0：隐藏foot  1：已加载完成   2 ：加载中
            pageIndex: 1,
            type: params.type,
            isInit: true
        };
        this.data = [];
    }

    componentWillMount() {
        let that = this;
        this.fetchData(true).then(() => {
            this.setState({isInit: false});
        }, (error) => {
            this.setState({isInit: false});
        }).catch(function (error) {
            this.setState({isInit: false});
        });
    }

    fetchData = (isRefresh) => {
        let pageIndex = 1;
        if (isRefresh) {
            this.setState({pageIndex: 1});
        } else {
            this.setState({isLoading: 2});
            pageIndex = this.state.pageIndex;
        }
        let params = {
            PageIndex: pageIndex,
            PageSize: 10,
            Type: this.state.type
        };
        let that = this;

        return new Promise((resolve, reject) => {
            this.networking.get(GetPublishRankUrl, params, {}).then((responseData) => {
                let {Result, Data} = responseData;
                if (Result === 1) {
                    if (isRefresh) {
                        that.data = [];
                    }
                    // 拼接数据
                    that.data = that.data.concat(Data);
                    if (Data.length < 10) {
                        that.setState({isLoading: 1});
                    }
                    else {
                        that.setState({isLoading: 0});
                    }
                    that.setState({
                        pageIndex: that.state.pageIndex + 1,
                        DataSource: that.state.DataSource.cloneWithRows(that.data)
                    });
                    resolve();
                } else {
                    that.showError(Result);
                    reject(Result);
                }
            },(error)=>{this.showError(error)}).catch((error) => {
                that.showError(error);
                console.log(error);
                throw error;
            })
        })
    }


    renderRow(Item, sectionId, ItemId, highlightRow) {
        const {navigate} = this.props.navigation;
        return (
            <RankItem
                key={ItemId}
                data={Item}
                onCheck={() => navigate('UserRank', {OpenID: Item.OpenID})}
                index={ItemId}
            />
        )
    }

    onRefresh(resolve) {
        let that = this;
        this.fetchData(true).then(() => {
            if (typeof resolve === "function") {
                resolve()
            }
        }, (error) => {
            if (typeof resolve === "function") {
                resolve()
            }
        }).catch(function (error) {
            if (typeof resolve === "function") {
                resolve()
            }
        });
    }

    onLoadMore() {
        if (this.state.isLoading !== 0 || this.state.pageIndex > 5) {
            return;
        }
        this.fetchData();
    }

    render() {
        let Alert = this.Alert;
        return (
            <View style={styles.container}>
                {this.data.length > 0 ? (
                    <ListViewPull
                        pageSize={10}
                        initialListSize={10}
                        onPullRelease={this.onRefresh.bind(this)}
                        onEndReached={this.onLoadMore.bind(this)}
                        dataSource={this.state.DataSource}
                        renderRow={this.renderRow.bind(this)}
                        style={{backgroundColor: '#fff', flex: 1}}
                        isLoading={this.state.isLoading}
                    />
                ) : (

                    <View style={styles.nodata}>
                        {this.state.isInit ? (<ActivityIndicator size="large" color="#3a66b3"/>) : (<Text>暂无新数据</Text>)}
                    </View
                    >)}

                <Alert ref={(refAlert) => {
                    this.alert = refAlert
                }}/>
            </View>
        );

    }
}

export default Rank;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    nodata: {
        marginTop: 50,
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center'
    }
});