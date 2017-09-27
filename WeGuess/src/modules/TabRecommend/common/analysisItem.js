/**
 * Created by Hsu. on 2017/8/10.
 */
import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
} from 'react-native';
import method from './method';
import MyButton from './myButton';
import {hostUrl} from "../../Config/apiUrlConfig";

const {width} = Dimensions.get('window');
export default class AnalysisItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {data,onCheck,onJump} = this.props;
        return (
            <View style={styles.alItemBox}>
                <View style={styles.alItemLeft}>
                    <View style={styles.ItemImage}>
                        <Image source={{uri:hostUrl+data.PictureUrl}} style={styles.analysisImage}/>
                    </View>
                    <View style={styles.alMatchInfo}>
                        <Text numberOfLines={1} style={styles.TitleStyle}>
                            {data.Title}
                        </Text>
                        <Text numberOfLines={1} style={styles.EndTimeStrStyle}>
                            {data.EndTimeStr}&nbsp;&lt;{data.ReadCount}人&gt;
                        </Text>
                        <Text numberOfLines={1} style={styles.matchTeamStyle}>
                            <Text>{JSON.parse(data.GuessMatch)[0].MatchInfo.Home}&nbsp;vs&nbsp;{JSON.parse(data.GuessMatch)[0].MatchInfo.Away}</Text>
                        </Text>
                    </View>
                </View>
                <View style={styles.alItemRight}>
                    {data.MatchStarted || data.HaveBought ?
                        <MyButton onPress={onJump} style={{backgroundColor:'#1eb900'}} />:
                        <View style={styles.btnAndText}>
                            <MyButton onPress={onCheck} btnText={method.numberFormat(data.Fee)+' 查看'} btnImage={true}/>
                            <View style={styles.awardInfo}>
                                <Text style={styles.defaultFont}>赠送&nbsp;</Text>
                                <Image source={require('../../Resources/bean.png')} style={styles.beanIcon}/>
                                <Text style={styles.defaultFont}>&nbsp;{method.numberFormat(data.FreeBean)}</Text>
                            </View>
                        </View>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    alItemBox:{
        padding:12,
        borderBottomWidth:1,
        borderColor:'#ddd',
        backgroundColor:'#fff',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    alItemLeft:{
        flexDirection:'row',
        width:width-24-100-12-66,
    },
    ItemImage:{
        borderColor:'#ddd',
        borderWidth:1,
    },
    analysisImage:{
        height:64,
        width:64
    },
    alMatchInfo:{
        justifyContent:'space-between',
        marginLeft:12,
    },
    TitleStyle:{
        fontSize:14,
        color:'#333',
    },
    EndTimeStrStyle:{
        color:'#999',
        fontSize:12,
    },
    matchTeamStyle:{
        color:'#999',
        fontSize:12,
    },
    alItemRight:{
        width:100,
        alignItems:'flex-end',
    },
    btnAndText:{
        height:64,
        justifyContent:'space-between',
        alignItems:'flex-end',
    },
    awardInfo:{
        flexDirection:'row',
    },
    beanIcon:{
        height:16,
        width:16
    },
    defaultFont:{
        fontSize:12,
    }
});