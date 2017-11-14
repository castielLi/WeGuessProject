/**
 * Created by ml23 on 2017/08/11.
 */

const beanType = {
    "1": "前期余额",
    "2": "注册赠送",
    "3": "道具赠送",
    "4": "解盘赠送",
    "5": "参与活动",
    "6": "参与竞猜",
    "7": "绑定手机赠送",
    "8": "推广赠送",
    "9": "参与抽奖",
    "10": "活动取消",
    "11": "购买解盘赠送",
    "12": "查看玩家投注",
}

const goldType = {
    "1": "前期余额",
    "2": "充值",
    "3": "购买道具",
    "4": "购买参考资料",
    "-5": "查看玩家投注",
    "5": "玩家查看投注",
    "6": "购买解盘数据",
}
export function getBeanType(data) {
    return beanType[data];
}


export function getGoldType(data, money) {
    if (data == 5 && money < 0) {
        data = "-" + data;
        return goldType[data];
    } else {
        return goldType[data];
    }
}