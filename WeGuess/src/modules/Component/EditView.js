import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
} from 'react-native';

export default class EditView extends Component {

    render() {
        return (
            <View style={styles.itemInput}>
                <Text style={styles.inputLabel}>{this.props.label}</Text>
                <TextInput style={styles.inputText}
                           placeholder={this.props.name}
                           underlineColorAndroid="transparent"
                           onChangeText={this.props.onChangeText}
                           secureTextEntry={this.props.secureTextEntry}
                           value={this.props.value}
                           placeholderTextColor='#b3b3b3'
                           editable={this.props.editable}
                />
                <Text style={styles.yzm} onPress={this.props.onPress}
                      disabled={this.props.disabled}>{this.props.getyzm}</Text>
                <Text style={styles.bindPhone} onPress={this.props.onPress}
                      disabled={this.props.disabled}>{this.props.bindPhone}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    itemInput: {
        borderWidth: 1,
        borderColor: '#e6e6e6',
        borderRadius: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        height: 45,
        marginTop: 16
    },
    inputLabel: {
        color: '#333',
        fontSize: 14,
        width: 60
    },
    inputText: {
        fontSize: 12,
        color: '#333333',
        flex: 1,
        padding:8,
    },
    yzm: {
        color: '#3b67b2',
        fontSize: 12,
        paddingLeft: 10
    },
    bindPhone: {
        color: '#3b67b2',
        fontSize: 12,
        paddingLeft: 10
    }
});