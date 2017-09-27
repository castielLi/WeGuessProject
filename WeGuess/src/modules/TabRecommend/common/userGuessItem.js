/**
 * Created by Hsu. on 2017/8/11.
 */
import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
} from 'react-native';

import method from './method';
import MyButton from './myButton';

export default class UserGuessItem extends Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        onCheck: null,
    };

    sportResult(Result){
        switch (Result){
            case 0:
                Result =  '';
                break;
            case 1:
                Result = '赢';
                break;
            case 2:
                Result = '赢半';
                break;
            case 3:
                Result = '输';
                break;
            case 4:
                Result = '输半';
                break;
            case 5:
                Result = '取消';
                break;
            case 6:
                Result = '作废';
                break;
            case 7:
                Result = '走';
                break;
        }
        return Result;
    }

    getSportResult(res){
        if(1<=res && res<=2){
            return <Text style={styles.betResult1}>{this.sportResult(res)}</Text>
        }
        if(3<=res && res<=4){
            return <Text style={styles.betResult2}>{this.sportResult(res)}</Text>
        }
        if(5<=res && res<=7){
            return <Text style={styles.betResult3}>{this.sportResult(res)}</Text>
        }
    }

    getTeam(Item,onCheck,isSelf,onJump){
        if(Item.MatchResult)
        {
            return(
                <View style={[styles.spaceBetween,styles.interval]}>
                    <Text style={styles.fontColor_333}>
                        {Item.Match.HomeName}&nbsp;
                        <Text style={styles.score}>{Item.MatchResult.HomeScore}:{Item.MatchResult.AwayScore}</Text>
                        &nbsp;{Item.Match.AwayName}
                    </Text>
                    {
                        this.getSportResult(Item.Bet.Result)
                    }
                </View>
            )
        }else{
            return(
                <View style={[styles.spaceBetween,styles.interval]}>
                    <Text style={styles.fontColor_333}>{Item.Match.HomeName}&nbsp;vs&nbsp;{Item.Match.AwayName}</Text>
                    {isSelf ?
                        <View style={styles.isSelfStyle}>
                            <Text style={styles.fontColor_999}>
                                {Item.ReadCount}人&nbsp;&nbsp;&nbsp;收入&nbsp;
                            </Text>
                            <Image source={require('../../Resources/gold.png')} style={styles.btnIcon}/>
                            <Text style={styles.score}>&nbsp;{method.numberFormat(Item.ReadCount*Item.Fee)}</Text>
                        </View>
                        :
                        Item.IsEnd ? null :
                            Item.IsBuy ?
                                <MyButton onPress={onJump} style={styles.btnStyle} btnText={'跟单'}/>
                                :
                                <MyButton onPress={onCheck} style={styles.btnStyle} btnText={method.numberFormat(Item.Fee)+' 查看'} btnImage={true}/>
                    }

                </View>
            )
        }
    }

    render() {
        const {data,onCheck,isSelf,onJump} = this.props;

        return (
            <View style={styles.RankItemBox}>
                <Text style={styles.fontColor_999}>
                    {data.Match.LeagueName}&nbsp;@&nbsp;{method.timeFormat(data.Match.MatchTime,true)}
                </Text>

                {this.getTeam(data,onCheck,isSelf,onJump)}

                <View style={[styles.spaceBetween,styles.interval]}>
                    <Text style={styles.recommend}>推荐:赛前·全场{data.Bet.BetKind}
                        {data.Bet.BetKind ?
                            <Text style={styles.BetHdp}>&nbsp;@&nbsp;{data.Bet.BetPosName}&nbsp;{data.Bet.BetHdp}</Text>
                            : null
                        }
                    </Text>
                    {isSelf ?
                        data.IsEnd ?
                            <Text style={styles.fontColor_999}>{data.ReadCount}人</Text>
                            :
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                <Image source={require('../../Resources/gold.png')} style={styles.btnIcon}/>
                                <Text style={styles.lookText}>&nbsp;{data.Fee}&nbsp;查看</Text>
                            </View>
                        : <Text style={styles.fontColor_999}>{data.ReadCount}人</Text>
                    }
                </View>
                <View style={[styles.spaceBetween,styles.interval]}>
                    <Text style={styles.fontColor_999}>
                        投注猜豆:
                        <Text style={styles.fontColor_333}>{method.numberFormat(data.Bet.BetValue)}</Text>
                    </Text>
                    <Text style={styles.fontColor_999}>{method.timeFormat(data.PublishTime)}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    RankItemBox:{
        padding:12,
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#ddd',
    },
    fontColor_999:{
        color:'#999',
        fontSize:12

    },
    fontColor_333:{
        color:'#333',
        fontSize:12
    },
    interval:{
        marginTop:2,
    },
    score:{
        color:'#da0000',
        fontSize:12
    },
    recommend:{
        color:'#3a66b3',
        fontSize:12
    },
    BetHdp:{
        color:'#f95101',
        fontSize:12
    },
    spaceBetween:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    betResult1:{
        color:'#d90102',
        fontSize:14
    },
    betResult2:{
        color:'#018b3d',
        fontSize:14
    },
    betResult3:{
        color:'#3a66b3',
        fontSize:14
    },
    btnStyle:{
        position:'absolute',
        right:0,
        bottom:0
    },
    btnIcon:{
        height:14,
        width:14
    },
    lookText:{
        color:'#3a65b3',
        fontSize:12
    },
    isSelfStyle:{
        flexDirection:'row',
        alignItems:'center'
    }
});