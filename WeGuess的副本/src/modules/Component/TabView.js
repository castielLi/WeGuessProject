/**
 * Created by ml23 on 2017/08/15.
 */

'use strict';
import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';

export default class TabView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabList: this.props.tabList,
            index: this.props.index ? this.props.index : 0,
            styleUl:this.props.styleFather,
            styleTopRow:this.props.styleChild
        }
    }

    onPress = (index) => {
        this.setState({index: index});
        this.props.onPress(index);
    }

    render() {
        return (
            <View style={[styles.topUl,this.state.styleUl]}>
                {
                    this.state.tabList.map((item, index) => {
                        return (
                            <TouchableWithoutFeedback onPress={() => this.onPress(index)} key={index}>
                                <View style={[styles.topRow,this.state.styleTopRow,this.state.index === index ? styles.select : styles.noSelect,]}>
                                    <Text
                                        style={[styles.topLi, this.state.index === index ? styles.selectColor : styles.noSelectColor]}>{item}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topUl: {
        height: 44,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderBottomColor: "#eeeeee",
        borderBottomWidth: 1
    },
    topRow: {
        height: 44,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 2,
        borderTopColor: "#fff",
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
    },
    topLi: {
        color: '#b2b2b2',
        fontSize: 15,
    },
    selectColor: {
        color: '#3a66b3',
    },
    select: {
        borderBottomColor: '#3a66b3',
        borderBottomWidth: 2
    },
    noSelectColor: {
        color: '#b2b2b2',
    },
    noSelect: {
        borderBottomWidth: 0,
        borderBottomColor: '#fff',
    }
})