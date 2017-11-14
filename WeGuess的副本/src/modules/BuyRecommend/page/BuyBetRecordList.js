/**
 * Created by ml23 on 2017/08/11.
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ListView,
    TouchableHighlight
} from 'react-native';
import {PullList} from 'react-native-pull';
import {GetBuyBetRecordType, GetBuyBetRecordColor} from './GetBuyBetRecordType';
import DisplayComponent from '../../.././Core/Component/index';

class BuyBetRecordList extends DisplayComponent {
    constructor(props) {
        super(props);
    }

    follow = (matchID, marketID, betPos) => {
        this.props.navigate("SportMatch", {matchId: matchID, marketId: marketID, betPos: betPos})
    }

    //行数据
    renderRow = (data, sectionID, rowID, highlightRow) => {
        return (
            <View style={styles.BetRecordLi}>
                <View style={{width: 50, alignItems: 'center'}}>
                    <View>
                        {
                            data.UserRankInfo.HeadPicture ? (
                                <Image source={{uri: data.UserRankInfo.HeadPicture}} style={styles.BetRecordLiImg}/>
                            ) : (
                                <Image source={{uri: 'http://m.weguess.cn/image/me/head.png'}}
                                       style={styles.BetRecordLiImg}/>
                            )
                        }
                    </View>
                    <Text style={[styles.fontS12, {color: '#f95101'}]}>{data.Bets.Match.LeagueName}</Text>
                    {
                        data.Bets.Bet.Result == 0 ? (
                            <View style={{alignItems: 'center'}}>
                                <Text style={[styles.fontS12, {color: '#999'}]}>
                                    {data.Bets.Match.MatchTime.slice(5, -12)}/
                                    {data.Bets.Match.MatchTime.slice(8, -9)}
                                </Text>
                                <Text style={[styles.fontS12, {color: '#999'}]}>
                                    {data.Bets.Match.MatchTime.slice(10, -3)}
                                </Text>
                            </View>
                        ) : (
                            <Text style={[styles.fontS12, {color: 'red'}]}>完赛</Text>
                        )
                    }
                </View>
                <View style={{marginLeft: 10, flex: 1}}>
                    <View>
                        <View style={{flexDirection: 'row', height: 30, alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: '#3a66b3', flex: 1}}>{data.UserRankInfo.Nickname}</Text>
                            {
                                data.Bets.IsEnd ? (
                                    <Text style={{fontSize: 14, color: this.BuyBetRecordColor(data.Bets.Bet.Result)}}>
                                        {this.BuyBetRecordResult(data.Bets.Bet.Result)}
                                    </Text>
                                ) : (
                                    <TouchableHighlight style={{
                                        borderRadius: 5,
                                        backgroundColor: '#3b66b4',
                                        width: 80,
                                        height: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }} onPress={() => {
                                        this.follow(data.Bets.Match.MatchID, data.Bets.Bet.MarketID, data.Bets.Bet.BetPos)
                                    }}>
                                        <Text style={{color: '#fff', fontSize: 12}}>跟单</Text>
                                    </TouchableHighlight>
                                )
                            }

                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{marginRight: 5, fontSize: 12}}>最高连红:<Text
                                style={{color: 'red'}}>{data.UserRankInfo.MaxSuccessiveWin}</Text></Text>
                            <Text style={{marginRight: 5, fontSize: 12}}>当前连红:<Text
                                style={{color: 'red'}}>{data.UserRankInfo.CurrentSuccessiveWin}</Text></Text>
                            <Text style={{marginRight: 5, fontSize: 12}}>近20场胜率:<Text
                                style={{color: 'red'}}>{data.UserRankInfo.Rate}</Text></Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.fontS12}>{data.Bets.Match.HomeName}</Text>
                        {
                            data.Bets.MatchResult != null ? (
                                <Text style={[styles.fontS12, {
                                    marginHorizontal: 5,
                                    color: 'red'
                                }]}>{data.Bets.MatchResult.HomeScore}:{data.Bets.MatchResult.AwayScore}</Text>
                            ) : (
                                <Text style={[styles.fontS12, {marginHorizontal: 5}]}>vs</Text>
                            )
                        }
                        <Text style={styles.fontS12}>{data.Bets.Match.AwayName}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.fontS12, {
                            color: '#3a66b3',
                            marginRight: 5
                        }]}>推荐:赛前·{data.Bets.Bet.MarketID % 2 == 1 ? "全场" : "半场"}{data.Bets.Bet.BetKind || ""}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.fontS12, {color: '#f95101'}]}>@</Text>
                            <Text style={[styles.fontS12, {
                                marginHorizontal: 5,
                                color: '#f95101'
                            }]}>{data.Bets.Bet.BetPosName}</Text>
                            <Text style={[styles.fontS12, {color: '#f95101'}]}>{data.Bets.Bet.BetHdp}</Text>
                        </View>
                        <Text
                            style={[styles.fontS12, {color: '#999', flex: 1, textAlign: 'right'}]}>{data.Bets.ReadCount}人</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.fontS12, {
                            color: '#333',
                            flex: 1
                        }]}><Text style={{color: '#999'}}>投注猜豆:</Text>{this.parseNum(data.Bets.Bet.BetValue)}</Text>
                        <Text style={[styles.fontS12, {
                            color: '#999',
                            flex: 1,
                            textAlign: 'right'
                        }]}>{data.Bets.PublishTime.replace(/-/g, "/")}</Text>
                    </View>
                </View>
            </View>
        )
    }


    //比赛结果
    BuyBetRecordResult(data) {
        return GetBuyBetRecordType(data);
    }

    //颜色
    BuyBetRecordColor(data) {
        return GetBuyBetRecordColor(data);
    }

    //数字千分位转换
    parseNum(num) {
        var list = new String(num).split('').reverse();
        for (var i = 0; i < list.length; i++) {
            if (i % 4 == 3) {
                list.splice(i, 0, ',');
            }
        }
        return list.reverse().join('');
    }

    onPullRelease = (resolve) => {
        this.props.getBuyBetRecord(true, resolve);

    }

    onEndReached = () => {
        this.props.getBuyBetRecord();
    }

    render() {
        if (this.props.data && this.props.data.length > 0) {
            return (
                <PullList
                    style={styles.container}
                    initialListSize={10}
                    pageSize={10}
                    onPullRelease={this.onPullRelease}
                    onEndReached={this.onEndReached}
                    dataSource={this.props.dataSource}
                    renderRow={this.renderRow}
                    onEndReachedThreshold={50}
                    enableEmptySections={true}
                />
            )
        } else {
            return (
                <Text style={{textAlign: 'center', color: '#999', marginTop: 20, fontSize: 16}}>无记录</Text>
            )
        }

    }
}

export default BuyBetRecordList;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    BetRecordLi: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row'
    },
    BetRecordLiImg: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5
    },
    fontS12: {
        fontSize: 12,
        marginTop: 5
    }
})