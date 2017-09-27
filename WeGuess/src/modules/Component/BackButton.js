/**
 * Created by ml23 on 2017/08/15.
 */

'use strict';
import React, {
    Component
} from 'react';
import {
    Text,
    Image,
    TouchableWithoutFeedback,
    View,
    Platform,
    StyleSheet
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

export class BackButton extends Component {

    constructor(props) {
        super(props);
    }

    onPress = () => {
        this.props.onPress();
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.onPress}>
                <View style={{width: 43, height: 40, alignItems: "center", justifyContent: "center"}}>
                    <Text>
                        <Icon name="ios-arrow-back" size={30} color="#3a66b3"/>
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}


export class BlankButton extends Component {
    constructor(props) {
        super(props);
    }

    onPress = () => {
        this.props.onPress();
    }

    render() {
        return (
            <TouchableWithoutFeedback>
                <View style={{width: 50, height: 40, alignItems: "center", justifyContent: "center"}}>
                    <Text>
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}


export class HelpButton extends Component {
    constructor(props) {
        super(props);
    }

    onPress = () => {
        this.props.onPress();
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.onPress}>
                <View style={{width: 50, height: 40, alignItems: "center", justifyContent: "center"}}>
                    <Image source={require("../Resources/help.png")}
                           resizeMode="contain"
                           style={{
                               width: this.props.width ? this.props.width : 24,
                               height: this.props.height ? this.props.height : 24,
                           }}/>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

export class StatusBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.statusBar}></View>
        )
    }
}

let styles = StyleSheet.create({
    statusBar: {
        height: (Platform.OS === 'ios') ? 20 : 0,
        backgroundColor: 'rgba(255, 255, 255, 1.0)',
        borderBottomWidth: 1,
        borderBottomColor: "#cccccc"
    }
})