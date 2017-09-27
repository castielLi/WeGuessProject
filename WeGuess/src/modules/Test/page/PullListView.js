/**
 * Created by maple on 2017/08/29.
 */

'use strict';
import React, {
    Component
} from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    ListView,
    StyleSheet
} from 'react-native';
import {PullList} from 'react-native-pull';

export default class PullListView extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                return r1 !== r2;
            }
        });
        this.datas = props.data.slice(0);
        this.state = {
            style: props.style ? props.style : {},
            noMoreData: false,
            dataSource: ds.cloneWithRows(this.datas),
            pullState: 0
        }
        this.isLoading = false;
        this.noMoreData = false;
        this.defaultParams = {
            pullingText: '下拉刷新',
            pullOkText: '释放刷新',
            pullReleaseText: '刷新数据中',
            headerColor: props.headerColor ? props.headerColor : "#eeeeee",
            loadingColor: props.headerColor ? props.headerColor : "#3a66b3",
        }
    }

    componentWillReceiveProps(newProps) {
        this.datas = newProps.data.slice(0);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.datas),
        });
    }

    //下拉过程回调
    onPulling = () => {
        if (typeof this.props.onPulling === "function") {
            this.props.onPulling();
        }
    }

    //下拉到成功回调
    onPullOk = () => {
        if (typeof this.props.onPullOk === "function") {
            this.props.onPullOk();
        }
    }

    //下拉释放回调
    // 回调参数：resolve方法,执行resolve();关闭下拉loading状态
    onPullRelease = (resolve) => {
        if (this.isLoading) {
            return
        }
        this.isLoading = true;
        if (typeof this.props.onPullRelease === "function") {
            this.setState({noMoreData: false});
            this.props.onPullRelease((isNoMore) => {
                if (isNoMore) {
                    this.setState({noMoreData: true});
                }

                resolve();
                this.isLoading = false;
            });
        }
    }

    //上拉加载更多
    onEndReached = () => {
        if (this.isLoading || this.state.noMoreData) {
            return
        }
        this.isLoading = true;
        if (typeof this.props.onEndReached === "function") {
            this.props.onEndReached((isNoMore) => {
                this.isLoading = false;

                this.setState({noMoreData: isNoMore});
            });
        }
    }

    //渲染Header效果
    renderHeader = () => {
        return (
            <View style={[styles.headerBorder, {backgroundColor: this.defaultParams.headerColor}]}>
            </View>
        )
    }

    //渲染Footer头部效果
    renderFooter = () => {
        return (
            this.state.noMoreData ? null : <View>
                <ActivityIndicator size="small" color={this.defaultParams.loadingColor}/>
            </View>

        )
    }

    render() {
        return (
            <PullList style={[styles.container, this.state.style]}
                      onPullRelease={this.onPullRelease}
                      enableEmptySections={true}
                      topIndicatorRender={this.topIndicatorRender}
                      pageSize={5}
                      initialListSize={5}
                      onEndReachedThreshold={20}
                      onEndReached={this.onEndReached}
                      renderHeader={this.renderHeader}
                      renderFooter={this.renderFooter}
                      dataSource={this.state.dataSource}
                      renderRow={this.props.renderRow}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerBorder: {
        backgroundColor: "#eeeeee",
        flex: 1,
        height: 1,
    }
});