/**
 * Created by apple on 2017/6/7.
 */

'use strict';
import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    TouchableHighlight,
    ListView,
    Image,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import ContainerComponent from '../../Core/Component/ContainerComponent';
import {GetUnbalancedBets, GetBalancedBetDate} from "../Config/apiUrlConfig";
var {height, width} = Dimensions.get('window')

export default class SportBetList extends ContainerComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }

    closeFailPanel = () => {
        this.props.closeFailPanel();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.panel}>
                    <View style={styles.suceess}><Text style={{
                        flex: 20,
                        textAlign: 'center',
                        color: "#3a66b3",
                        fontSize: 14
                    }}>投注失败</Text>
                        <TouchableHighlight style={{flex: 1}} onPress={() => {
                            this.closeuSucPanel()
                        }}><Text>X</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.detail}>
                        <Text>{this.props.errorMsg}</Text>
                    </View>
                    <View style={styles.btn}>
                        <View style={styles.cancle}>
                            <TouchableHighlight onPress={() => { this.closeFailPanel() }}>
                                <Text style={{color: "#3a66b3", fontSize: 14}}>参与活动</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.confirm}>
                            <Text style={{color: "#3a66b3", fontSize: 14}}>立即充值</Text>
                        </View>
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
        paddingLeft: 100,
        paddingRight: 100,
    },
    panel: {
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.5)",
        overflow: 'hidden',
        borderRadius: 10,
        backgroundColor: "#fff",
    },
    suceess: {
        height: 35,
        flexDirection: 'row',
        backgroundColor: "#ccc",
        alignItems: 'center',
    },
    detail: {
        borderTopWidth: 1,
        borderTopColor: "#fff",
        paddingLeft: 10,
        paddingRight: 10,
        height: 80,
        justifyContent: "center",
        alignItems: "center"
    },
    league: {
        height: 30,
        justifyContent: 'center',
    },
    team: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 30,
    },
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