import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
export default class LoginButton extends Component {
    render() {
        return (
            <TouchableOpacity style={styles.loginArea} onPress={this.props.onPress}>
                <Text style={styles.login}>
                    {this.props.name}
                </Text>
            </TouchableOpacity>
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