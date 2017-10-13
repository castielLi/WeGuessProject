/**
 * Created by maple on 2017/7/10.
 */


import * as TYPES from './actionTypes';
import NetWorking from '../../../Core/WGNetworking/Network';
import {GetMemberInfoUrl} from '../../Config/apiUrlConfig';
let netWorking = NetWorking.getInstance();

export function loginIn(payload) {
    return {
        type: TYPES.LOGIN_IN,
        payload: payload
    };
}

export function loginOut() {
    return {
        type: TYPES.LOGIN_OUT
    };
}

export function clearMemberInfo() {
    return {
        type: TYPES.CLEAR_MEMBERINFO,
        payload: {
            nickname: null,  //用户名称
            account: null,  //用户账号
            bean: 0,   //猜豆
            gold: 0,  //钻石
            headImageUrl: null,  //用户头像
        }
    };
}

export function hasToken() {
    return {type: TYPES.HAS_TOKEN}
}

export function startIOSPay(payload) {
    return {
        type: TYPES.SET_STARTIOSPAY,
        payload: payload
    };
}

export function setMemberInfo(payload) {
    return {
        type: TYPES.SET_MEMBERINFO,
        payload: payload
    };
}

export function getMemberInfo() {
    return (dispatch, getState) => {
        try {
            netWorking.get(GetMemberInfoUrl, null, {}).then((response) => {
                let {Result, Data} = response
                if (Result == 1 && Data) {
                    let payload = {
                        nickname: Data.Nickname,  //用户名称
                        account: Data.Account,  //用户账号
                        bean: parseInt(Data.Bean),   //猜豆
                        gold: parseInt(Data.Gold),  //钻石
                        headImageUrl: Data.HeadImageUrl,  //用户头像
                    }
                    dispatch(setMemberInfo(payload))
                }
            }, (error) => {

            });
        } catch (error) {

        }
    }
}
