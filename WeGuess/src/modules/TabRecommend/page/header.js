/**
 * Created by ml23 on 2017/08/10.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {buttonList, help, more, selectIndex} = this.props.params;
        return (
            <View style={styles.headerView}>
                <View style={{flexDirection: 'row'}}>
                    {buttonList.map((item, index) => {
                        return (<View key={index} style={styles.title}>
                            {index > 0 ? (<View style={styles.line}/>) : (<View style={styles.noline}/>)}
                            <TouchableOpacity activeOpacity={1} onPress={() => item.onPress(index)}>
                                <Text
                                    style={[selectIndex === index ? styles.select : styles.noSelect]}>{item.name}</Text>
                            </TouchableOpacity>
                        </View>)
                    })
                    }
                </View>
                <View style={styles.moreView}>
                    <TouchableWithoutFeedback onPress={() => help()}>
                        <View style={styles.viewForText}>
                        <Image source={require('../../Resources/help.png')}
                               style={styles.helpIcon}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => more()} style={{flexDirection: 'row'}}>
                        <View style={styles.viewForText}>
                            <Text style={styles.more}>更多</Text>
                            <Icon name="ios-arrow-forward" color="#828282" size={24}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    moreView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewForText: {
        flexDirection: 'row',
        height: 44,
        alignItems:'center',
        justifyContent: 'center',
        paddingHorizontal:5
    },
    more: {
        paddingRight: 8,
    },
    headerView: {
        height: 44,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 8
    },
    select: {
        fontSize: 14,
        color: '#3a65b3',
        padding: 10,
    },
    noSelect: {
        fontSize: 14,
        color: '#9e9e9e',
        padding: 10,
    },
    line: {
        height: 20,
        width: 0,
        borderColor: "#cccccc",
        borderLeftWidth: 1
    },
    noline: {
        width: 0
    },
    title:{
        flexDirection: 'row',
        alignItems:'center'
    },
    helpIcon:{
        height: 20,
        width: 20,
        marginRight: 8
    }
});