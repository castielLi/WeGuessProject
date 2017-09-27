/**
 * Created by apple on 2017/6/7.
 */

import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Button,
    TouchableHighlight,
    Dimensions
} from 'react-native';
import ContainerComponent from '../../Core/Component/ContainerComponent';
import config from '../Utils/sportConfig'
import HandleData from '../Utils/sportHandle'
let {height, width} = Dimensions.get('window')
export default class SportBetList extends ContainerComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }

    getMonth = () => {

    }
    closePublishPanel = () => {
        this.props.closeuPublishPanel();
    }
    publish = (BetID) => {
        this.props.publish(BetID);
    }

    render() {

        let {BetDate, Items, BetID} = this.props.publishList;
        return (
            <View style={styles.container}>
                <View style={styles.panel}>

                    <View style={styles.detail}>
                        {
                            Items.map((item, index) => {
                                return (
                                    <View style={styles.wraper} key={index}>
                                        <View style={styles.date}>
                                            <Text>{BetDate.split(" ")[0].split('/')[1] + "/" + BetDate.split(" ")[0].split('/')[2]}</Text>
                                            <Text>{BetDate.split(" ")[1].split(':')[0] + ":" + BetDate.split(" ")[1].split(':')[1]}</Text>
                                        </View>
                                        <View style={styles.team}><Text
                                            style={{color: "#000"}}>{item.HomeName}</Text></View>
                                        <View><Text>VS</Text></View>
                                        <View><Text style={{color: "#000"}}>{item.AwayName}</Text></View>
                                    </View>
                                )
                            })
                        }

                        <View style={{alignItems: "center", height: 30, justifyContent: "center"}}><Text
                            style={{color: "#ff5b06"}}>立即发布该场比赛推荐</Text></View>
                    </View>
                    <View style={styles.btn}>
                        <View style={styles.cancle}><TouchableHighlight onPress={() => {
                            this.closePublishPanel()
                        }}><Text>取消</Text></TouchableHighlight></View>
                        <View style={styles.confirm}><TouchableHighlight onPress={() => {
                            this.publish(BetID)
                        }}><Text style={{color: "#ff5b06"}}>确定</Text></TouchableHighlight></View>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        paddingLeft: 30,
        paddingRight: 30,
    },
    panel: {

        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.5)",
        overflow: 'hidden',
        borderRadius: 10,
        backgroundColor: "#fff",
    },
    detail: {
        paddingLeft: 30,
        paddingRight: 30,
    },
    wraper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 40,
    },
    team: {},
    bet: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 30,
        alignItems: "center",
    },
    btn: {
        flexDirection: "row",
        alignItems: "center",
        height: 35,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
    cancle: {
        borderRightWidth: 1,
        borderRightColor: "#ccc",
        flex: 1,
        justifyContent: "center",
        height: 30,
        alignItems: 'center'
    },
    confirm: {
        flex: 1,
        justifyContent: "center",
        height: 30,
        alignItems: 'center',

    },
});