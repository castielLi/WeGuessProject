/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
    Component
} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    TouchableOpacity,
} from 'react-native';
import {numFormat} from '../../Utils/money';
import {connect} from "react-redux";

class HeaderComponent extends Component {

    constructor(props) {
        super(props);
    }

    goMatch = () => {
        this.props.navigation.navigate("SportMatch", {ID: 4317, betPos: 1, marketId: 5});
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.banlace}>
                    <Image source={require('../resource/icon_15.png')} style={styles.banlanceImg}></Image>
                    <Text style={{color: "#ff5b06"}}>{numFormat(this.props.loginStore.bean)}</Text>
                </View>
                <View style={styles.ranVList}>
                    <TouchableOpacity onPress={() => {
                            this.props.goRank()
                        }}>
                    <View style={styles.rank}>
                        
                            <Image source={require('../resource/icon_80.png')} style={styles.ImageIcon}></Image>
                       
                    </View>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={() => {
                            this.props.goBetList()
                        }}>
                    <View style={styles.list}>
                        <Image source={require('../resource/icon_65.png')}
                                  style={styles.ImageIcon}></Image>
                    </View>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    loginStore: state.loginStore
});
const mapDispatchToProps = dispatch => ({
    // ...bindActionCreators(Actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingLeft: 20,
        paddingRight: 15,
    },
    ranVList: {
        flexDirection: 'row'
    },
    banlace: {

        flexDirection: 'row',
        alignItems: 'center',
    },
    ImageIcon: {
        height: 25,
        width: 25,
        resizeMode: 'contain',
    },
    banlanceImg: {
        justifyContent: 'center',
        width: 25,
        height: 15,
        resizeMode: 'contain',
        marginTop: 2,
        marginRight: 5,
    },
    rank: {
        width: 50,

        marginLeft:0,
        alignItems: 'center',

    },
    list: {
        width: 50,

        alignItems: 'center',

    },
    imgStyle: {
        width: 30,
        height: 25,
    }
});