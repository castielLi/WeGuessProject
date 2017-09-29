import React, {
    Component
} from 'react';

import {
    AppRegistry,
    Image,
    Text,
    View,
    TouchableHighlight,
    Dimensions,
    StyleSheet,
    Alert,
} from 'react-native';
import HandleData from '../../Utils/sportHandle'
export default class Header extends Component {
     constructor(props) {
       super(props);
       }
    
    LiveTime=(SID,PH,LT)=>{
        return HandleData.ComputeLiveTime(SID, PH, LT);
    }
    render() {
        let {SID, LN, HN, AN, Stage, PH, LT, MD, HC, AC, HS, AS} = this.props.headerData;
        let {isLive} = this.props;

        return (
            <View style={styles.header}>
                <Image source={require('../resource/placebg.png')} style={styles.headerImg}>
                    <View style={styles.headerTitle}>
                        <Text style={[styles.headerTitleText,{backgroundColor:"transparent"}]}>{LN}</Text>
                        <TouchableHighlight underlayColor='#3a66b3' style={styles.headerButton}
                                            onPress={() => (this.props.navigate("GuessRule"))}>
                            <Text style={styles.headerTitleText}>游戏规则</Text>
                        </TouchableHighlight>
                    </View>
                    <Text style={[styles.headerData,{backgroundColor:"transparent"}]}>
                        {
                            Stage==3?this.LiveTime(SID, PH, LT):MD
                        }
                    </Text>
                    <View style={styles.headerTeam}>
                        <View style={[styles.headerTeamOne,{backgroundColor:"transparent"}]}><Text style={styles.headerTitleText}>{HN}</Text></View>
                        <View style={[styles.headerVS,{backgroundColor:"transparent"}]}>
                            {
                                Stage==3?<Text style={[styles.headerTitleText,{paddingLeft:10,paddingRight:10,borderRadius:5,borderWidth:1,borderColor:"#ffffff",color:"#2cbf16",fontSize:20}]}>{HS } : {AS}</Text>:<Text style={styles.headerTitleText}>VS</Text>
                            }
                        </View>
                        <View style={[styles.headerTeamTwo,{backgroundColor:"transparent"}]}><Text style={styles.headerTitleText}>{AN}</Text></View>
                    </View>
                </Image>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerImg: {
        height: 130,
        width: Dimensions.get('window').width,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    headerTitle: {
        flexDirection: 'row',
        marginTop: 24,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,

    },
    headerTitleText: {
        color: 'white',
        fontSize: 18,
    },
    headerButton: {
        position: 'absolute',
        alignItems: 'center',
        backgroundColor: '#3a55b3',
        height: 30,
        width: 90,
        justifyContent: 'center',
        borderRadius: 10,
        right: 15,
    },
    headerData: {
        color: '#ff5b06',
        fontSize: 16,
        marginBottom: 5,
    },
    headerTeam: {
        justifyContent: 'center',
        height: 30,
        alignItems: 'center',
        flexDirection: 'row'
    },
    headerVS: {
        width: 80,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',

    },
    headerTeamOne: {
        height: 30,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTeamTwo: {
        height: 30,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});