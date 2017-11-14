/**
 * Created by ml23 on 2017/08/28.
 */
/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions
} from 'react-native';
import DisplayComponent from '../../Core/Component';
import {BackButton, BlankButton} from "../Component/BackButton";

class GuessRule extends DisplayComponent {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: "竞猜规则",
            headerLeft: (
                <BackButton onPress={() => {
                    navigation.goBack();
                }}/>
            ),
            headerRight: (
                <BlankButton/>
            ),
        };
    };

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <ScrollView style={styles.pm}>
                <Text style={styles.bt}>竞猜规则</Text>
                <Text style={styles.jl}>1. 系统仅使用“猜豆”进行竞猜和派奖；</Text>
                <Text style={styles.jl}>2. 用户可对足球、篮球等赛事的赛前盘、滚球盘、串关进行竞猜；</Text>
                <Text style={styles.jl}></Text>
                <Text class="bt">可提供的竞猜玩法</Text>
                <Text style={styles.jc}>（1） 足球（90分钟赛果含伤停补时，不含加时赛）</Text>
                <Text style={styles.jc}>
                    胜负平：<Text style={styles.jl}>预测比赛结果，竞猜提供主胜、客胜、平局为投注选项。</Text>
                </Text>
                <Text style={styles.jc}>
                    亚洲盘：<Text style={styles.jl}>预测比赛结果，竞猜提供让球后，主胜、主负为投注选项。</Text></Text>
                <Text style={styles.jc}>
                    大小球：<Text style={styles.jl}>预测比赛结果，竞猜提供赛事总进球数大于或小于指定总进球的分界线为投注选项。</Text>
                </Text>
                <Text style={styles.jc}>
                    比分：<Text style={styles.jl}>预测本场比赛确切比分。</Text></Text>
                <Text style={styles.jc}>
                    半全场：<Text style={styles.jl}>预测主队上半场赛果与全场赛果的组合结果。</Text>
                </Text>
                <Text style={styles.jc}>
                    两队都进球：<Text style={styles.jl}>预测主队与客队是否都有进球。</Text>
                </Text>
                <Text style={styles.jc}>
                    球队准确进球：<Text style={styles.jl}>预测主队或客队的准确进球数。</Text>
                </Text>
                <Text style={styles.jc}>
                    总进球奇偶数：<Text style={styles.jl}>预测比赛总进球数为奇数或是偶数。</Text>
                </Text>
                <Text style={styles.jc}>（2） 篮球（篮球赛果包含加时赛）</Text>
                <Text style={styles.jc}>
                    胜负：<Text style={styles.jl}>预测比赛结果，竞猜提供主胜、客胜为投注选项。</Text>
                </Text>
                <Text style={styles.jc}>
                    让分胜负：<Text style={styles.jl}>预测比赛结果，竞猜提供让分后，主胜、主负为投注选项。</Text>
                </Text>
                <Text style={styles.jc}>
                    大小分：<Text style={styles.jl}>预测比赛结果，竞猜提供赛事总分数大于或小于指定总分数的分界线为投注选项。</Text></Text>
                <Text style={styles.jc}>
                    总分奇偶数：<Text style={styles.jl}>预测赛事的总比分是单数或双数。</Text>
                </Text>
                <Text style={styles.jl}>3.串关竞猜每笔最多可选择10场赛事，最大奖励限额10,000,000猜豆。</Text>
                <Text style={styles.jl}> 4.中奖猜豆数依据用户竞猜时的盘口和赔率为准，中奖猜豆=竞猜时赔率×所投猜豆数量，串关获得奖励不超过串关最大奖励限额；</Text>
                <Text style={styles.jl}>5.系统提供的赛事日期是指比赛开始时间在当日中午12：00到次日中午12：00之间。</Text>
                <Text style={styles.jl}>6. 无效比赛的判定：</Text>
                <Text style={styles.jl}>（1）在某个比赛场次开放竞猜后，如果其比赛时间推迟且超过原定时间24小时或无法获知具体推迟时间或取消比赛，则认定该比赛场次为无效场次。若比赛时间推迟未超过24小时，则该场比赛仍为有效比赛。</Text>
                <Text style={styles.jl}>（2）如果某个比赛场次在比赛进行中因故中断，且自中断时刻起24小时内未继续完成比赛或无法获知具体补赛时间或取消补赛，则认定该比赛场次为无效场次。若在24小时内继续完成比赛，则该场比赛仍为有效比赛。</Text>
                <Text style={styles.jl}>（3）在某个比赛场次开放竞猜后，如果参赛双方中有一方与原定参赛队伍不同，则认定该比赛场次为无效场次。</Text>
                <Text style={styles.jl}>7. 无效比赛的处理</Text>
                <Text style={styles.jl}>（1）由于比赛取消、延期等原因，导致某场比赛被认定为无效场次，则用户参与该场比赛单关竞猜的猜豆将全部退还；</Text>
                <Text style={styles.jl}>（2）用户串关竞猜方案中包含上述原因的无效比赛，则该竞猜赔率恢复为1计算，若方案中所有比赛都无效则退还猜豆，举例说明：若原方案3串1过关，其中一场被认定无效后，计算获奖猜豆时该比赛为1计算，总赔率=1（无效比赛竞猜赔率）*比赛2竞猜赔率*比赛3竞猜赔率</Text>
                <Text style={styles.jl}>8. 赛果认定</Text>
                <Text style={styles.jl}>赛事结束后，比赛结果均以系统第一次提供的结果为准，系统不再进行赛果更改，同时也不对比和接受用户提供的任何第三方赛果。</Text>
                <Text style={[styles.jl, styles.red2]}>免责声明</Text>
                <Text style={[styles.jl, styles.red]}>在法律许可范围内，保留众猜体育的最终解释权。如有任何问题，请联系在线客服QQ，或咨询客服热线。</Text>
            </ScrollView>
        )

    }
}

export default GuessRule;

const styles = StyleSheet.create({
        pm: {
            padding: 10,
            backgroundColor: "#efeff4",
        },
        bt: {
            fontSize: 18,
            color: "#333",
            lineHeight: 36
        },
        jl: {
            fontWeight: "400",
            fontSize: 14,
            color: "rgb(77, 77, 77)",
            lineHeight: 30
        },
        jc: {
            fontWeight: "700",
            fontSize: 14,
            color: "rgb(77, 77, 77)",
            lineHeight: 30
        },
        red: {
            fontWeight: "400",
            color: "rgb(217, 0, 0)",
            marginBottom: 20
        },
        red2: {
            fontWeight: "400",
            color: "rgb(217, 0, 0)",
            textAlign:"center"
        }

    })
;