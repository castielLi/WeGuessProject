import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
export default class LoginButton extends Component {
    render() {
        return (
            <TouchableWithoutFeedback  onPress={this.props.onPress}>
                <View style={styles.loginArea}>
	                <Text style={styles.login}>
	                    {this.props.name}
	                </Text>
                </View>               
            </TouchableWithoutFeedback>
        );
    }
}
const styles = StyleSheet.create({
    loginArea: {
        backgroundColor: '#3a66b3',
        borderRadius: 8,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    login: {
        color: 'white',
        fontSize: 16
    },

});