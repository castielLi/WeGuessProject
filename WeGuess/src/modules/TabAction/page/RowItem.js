/**
 * Created by maple on 2017/08/29.
 */

'use strict';
import React, {
    PureComponent
} from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    Image,
    StyleSheet
} from 'react-native';
import {numFormat} from '../../Utils/money';
import {timeFormat} from '../../Utils/time';

export default class RowItem extends PureComponent {
    constructor(props) {
        super(props);
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

    onPress = (type, ID, status, code) => {
        this.props.onPress(type, ID, status, code);
    }

    render() {
        let rowData = this.props.data;
        return (
            <TouchableWithoutFeedback
                onPress={() => this.onPress(rowData.Type, rowData.ID, rowData.Status, rowData.Code)}>
                <View style={styles.cell}>
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
                    {
                        (rowData.Type !== 1 && rowData.IsWin) ? (
                            <Image style={styles.winImg} source={require('../resources/win.png')}/>
                        ) : null
                    }
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

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
        zIndex: 99
    },
    titBox: {
        flex: 1,
        marginLeft: 12
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
    }
});