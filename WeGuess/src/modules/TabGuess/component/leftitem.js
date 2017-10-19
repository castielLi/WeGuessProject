/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Image,
    Dimensions,
    ScrollView
} from 'react-native';
let {width, height} = Dimensions.get('window');

export default class LeftItem extends Component {

    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: "0",
            data: ['1', '2', '3'],
        }
        this.pressRow = this.pressRow.bind(this);

    }

    pressRow = (index) => {
        this.props.changeIndex(index);
        this.setState({
            selectIndex: index,
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {
                        this.props.data.map((rowData, rowID) => {
                            return this.renderRow(rowData, rowID)
                        })
                    }
                </ScrollView>
            </View>
        );
    }

    renderRow = (rowData, rowID) => {
        return (
            <TouchableOpacity key={rowID} onPress={() => {
                this.pressRow(rowID)
            }}>
                {//kind 为1表示按时间显示 为2表示按联赛显示
                    this.props.kind === '1' ? (
                        <View
                            style={[styles.leftView, this.state.selectIndex == rowID ? styles.selectView : styles.noSelectView]}>
                            <Text
                                style={[this.state.selectIndex == rowID ? styles.select : styles.noSelect,{fontSize:13}]}>{rowData.RD}</Text>
                            <Text
                                style={[this.state.selectIndex == rowID ? styles.select : styles.noSelect,{fontSize:13}]}>{rowData.WK}({rowData.MList.length})</Text>
                        </View>
                    ) : (
                        <View
                            style={[styles.teamNum, this.state.selectIndex == rowID ? styles.selectView : styles.noSelectView]}>
                            <Text style={[this.state.selectIndex == rowID ? styles.select : styles.noSelect]}>{rowData.LN}({rowData.MList.length})</Text>
                        </View>
                    )
                }

            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#ccc'
    },
    balance: {
        width: 50,
        flexDirection: 'row',
    },
    rank: {
        width: 50,
        marginLeft: 100,
        alignItems: 'center',
    },
    list: {
        width: 50,
        alignItems: 'center',
    },
    imgStyle: {
        width: 100,
        height: 30,
    },
    teamNum: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: '#f3f3f3',
    },
    leftView: {
        backgroundColor: '#f3f3f3',
        height: 66,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: "center",
        justifyContent: "center"
    },
    selectView: {
        backgroundColor: '#ffffff',
        width: width / 4 + 1,
    },
    noSelectView: {
        backgroundColor: '#f3f3f3'
    },
    select: {
        height: 20,
        color: "#ff5b06"
    },
    noSelect: {
        height: 20,
        color: "grey"
    }
});
