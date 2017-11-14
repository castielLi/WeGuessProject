import React, { PureComponent } from 'react';
import { View, Text ,StyleSheet} from 'react-native';
import {numFormat} from '../../Utils/money';
export default class MoneyTipsComponent extends PureComponent {
    render(){
        const {status,entryFee} = this.props;
         if(status === 3){
            return(
                <View>
                    <Text style={styles.tips}>注：请以上中奖用户添加“众猜体育客服”微信号领取现金红包。</Text>
                    <Text style={styles.tips}>微信号：zctykf </Text>
                </View>
                )
        }else if(status === 4){
            return(
                    <Text style={styles.tips}>由于该期抢红包活动参与人数不足，视为无效活动，退还参与玩家报名猜豆。</Text>
                )
        }
        else{
            return(
                    <Text style={styles.tips}>{'参与抢红包将扣除您'+numFormat(entryFee)+'猜豆。'}</Text>
                )
        }
    }
}

const styles = StyleSheet.create({
    tips:{
        fontSize:12,
        color:'#d90000',
        marginTop:10,
        marginLeft:10
    },
})