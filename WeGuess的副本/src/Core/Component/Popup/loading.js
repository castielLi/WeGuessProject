/**
 * Created by maple on 2017/7/11.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Modal,
    InteractionManager
} from 'react-native';

var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;

export default class Loading extends Component {

    constructor(props, context) {

        super(props, context);

        this.state = {
            modalVisible: false
        };
    }

    show(callback) {
        this.setState({
            modalVisible: true,
        }, () => {
            if (typeof callback === "function") {
                callback()
            }
        });
    };

    hide(callback) {
        this.setState({
            modalVisible: false,
        }, () => {
            if (typeof callback === "function") {
                callback();
            }
        });
    };

    render() {
        let {modalVisible} = this.state;
        if (modalVisible) {
            return (
                <View>
                    <Modal
                        animationType={"none"}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                        }}
                    >
                        <View style={[styles.container, {width: ScreenWidth}]}>
                            <View style={styles.loading}>
                                <Image source={require("./resource/loading.gif")} style={styles.image}></Image>
                            </View>
                        </View>
                    </Modal>
                </View>
            );
        } else {
            return <View style={styles.hidden}/>;
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loading: {
        backgroundColor: 'white',
        height: 128,
        width: 128,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: "#e5e5e5",
        borderWidth: 1,
        borderRadius: 16,
    },
    image: {
        height: 80,
        width: 80,
    },
    hidden: {
        position: 'absolute',
        height: 0,
        width: 0,
        top: 0,
        left: 0,
    }
});