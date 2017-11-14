import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
var ScreenWidth = Dimensions.get('window').width;

export default function renderRow(type, rowData, sectionID, rowID) {
    if (type === 1) {
        return (
            /*如果rowID是奇数,改变背景色*/
            <View style={[styles.row, rowID % 2 === 1 ? {backgroundColor: '#e6e6e6'} : {}]}>
                <View style={styles.rowItem}>
                    <Image style={styles.winHead}
                           source={rowData.MemberPic ? {uri: rowData.MemberPic} : require('../../Resources/head.png')}/>
                    <Text style={styles.winName}>{rowData.Nickname}</Text>
                </View>
                <View style={[styles.rowItem, styles.center]}>
                    <Text style={styles.WinLose}>{rowData.WinLose}</Text>
                </View>
            </View>
        )
    }
    return (
        /*如果rowID是奇数,改变背景色*/
        <View style={[styles.row, rowID % 2 === 1 ? {backgroundColor: '#e6e6e6'} : {}]}>
            <View style={styles.rowItem}>
                <Image style={styles.winHead}
                       source={rowData[0].MemberPic ? {uri: rowData[0].MemberPic} : require('../../Resources/head.png')}/>
                <Text style={styles.winName}>{rowData[0].Nickname}</Text>
            </View>
            {rowData[1] && (
                <View style={styles.rowItem}>
                    <Image style={styles.winHead}
                           source={rowData[1].MemberPic ? {uri: rowData[1].MemberPic} : require('../../Resources/head.png')}/>
                    <Text style={styles.winName}>{rowData[1].Nickname}</Text>
                </View>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 42,
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    rowItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden'
    },
    winHead: {
        height: 24,
        width: 24,
        resizeMode: 'stretch',
        marginLeft: 24
    },
    winName: {
        color: '#343434',
        fontSize: 12,
        marginLeft: 15,
        width: ScreenWidth / 2 - 63
    },
    WinLose: {
        color: '#343434',
        fontSize: 12,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})