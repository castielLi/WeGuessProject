/**
 * Created by maple on 2017/6/7.
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
    Button,
    Modal,
    TouchableHighlight,
    Dimensions,
    TouchableOpacity,
    ListView,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import {
    connect
} from 'react-redux';
import HOCFactory from "../../../Core/HOC";

class Test extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            header: null //隐藏navigation
        }
    };

    constructor(props) {
        super(props);
    }

    onButtonPress=()=>{
        let options={
            Content:"消息"
        }
        this.props.showAlert(options);
    }


    render() {
        return (
            <View style={styles.container}>
                <Button onPress={this.onButtonPress} title="Alert"></Button>
            </View>
        );

    }
}


const mapStateToProps = state => ({
    loginStore: state.loginStore
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch({type: 'Logout'}),
});

export default HOCFactory(connect(mapStateToProps, mapDispatchToProps)(Test),["HocLoading","HocAlert"]);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    title: {
        color: "#3a66b3"
    },
    cell: {
        height: 116,
        padding: 12,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center'
    },
    img: {
        width: 92,
        height: 92,
        resizeMode: 'stretch'
    },
    winImg: {
        width: 90,
        height: 80,
        resizeMode: 'stretch',
        position: 'absolute',
        top: 0,
        right: 60,
        zIndex: -1
    },
    titBox: {
        flex: 1,
        marginLeft: 20
    },
    tit: {
        color: 'rgb(52, 52, 52)',
        fontSize: 16
    },
    rowIconBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    mall: {
        fontSize: 12,
        color: 'grey',
        marginBottom: 12
    },
    time: {
        fontSize: 12,
        color: 'grey',
        marginLeft: 5
    },
    rowIcon: {
        width: 16,
        height: 16,
        resizeMode: 'stretch',
    },
    rightIcon: {
        width: 22,
        height: 64,
        resizeMode: 'stretch',

    },
    topTab: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    topTabCellL: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    topTabCellC: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topTabCellR: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    customFont: {
        fontFamily: "CustomFont",
        fontSize: 14
    },
});