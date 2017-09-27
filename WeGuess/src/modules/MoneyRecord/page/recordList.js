/**
 * Created by ml23 on 2017/08/11.
 */

import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import {PullList} from 'react-native-pull';
import {getBeanType, getGoldType} from './recordType'

export default class RecordList extends Component {
    constructor(props) {
        super(props);
    }

    //行数据
    renderRow = (data, sectionID, rowID, highlightRow) => {
        let index = parseInt(rowID);

        return (
            <View style={[styles.RecordLi, {backgroundColor: index % 2 == 0 ? "#f7f7f7" : "#ffffff"}]} key>
                <Text style={{textAlign:'center',fontSize:14,width:160}}>{data.UpdateTime}</Text>
                <Text style={styles.RecordLiText}>
                    {this.transactionType(data.TransactionType, data.Changed)}
                </Text>
                <Text ref='Changed' style={[styles.RecordLiText, {
                    color: data.Changed < 0 ? '#d90000' : '#3a66b3'
                    , paddingRight: 10, textAlign: 'right'
                }]}>
                    {data.Changed}
                </Text>
            </View>
        )
    }


    //钻石、猜豆项目明细
    transactionType(data, money) {
        if (this.props.type == 0) {
            return getGoldType(data, money);
        } else {
            return getBeanType(data);
        }
    }

    onPullRelease = (resolve) => {
        this.props.onPullRelease(resolve, this.props.type);
    }
    onEndReached = () => {
        this.props.onEndReached();
    }

    render() {
        if (this.props.dataList && this.props.dataList.length > 0) {
            return (
                <PullList enableEmptySections={true}
                          style={{flex: 1}}
                          initialListSize={20}
                          pageSize={20}
                          onPullRelease={this.onPullRelease}
                          onEndReached={this.onEndReached}
                          dataSource={this.props.dataSource}
                          renderRow={this.renderRow}
                          onEndReachedThreshold={60}
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

const styles = StyleSheet.create({
    stateTop: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: '#3a66b3',
        alignItems: 'center',
    },
    stateTopLi: {
        color: '#fff',
        flex: 1,
        textAlign: 'center',
        fontSize: 16
    },
    RecordLi: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    RecordLiText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14
    }
})