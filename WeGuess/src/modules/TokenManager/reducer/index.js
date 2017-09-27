/**
 * Created by maple on 2017/6/7.
 */

import * as TYPES from './actionTypes';

const initialState = {
    isLoggedIn: false,
    openID: "",
    hasToken:false,
    nickname: '',  //用户名称
    account: '',  //用户账号
    bean: '',   //猜豆
    gold: '',  //钻石
    headImageUrl: '',  //用户头像
};

export default function loginStore(state = initialState, action) {
    switch (action.type) {
        case TYPES.LOGIN_IN:
            return {
                ...state,
                isLoggedIn: true,
                openID:action.payload
            };

        case TYPES.LOGIN_OUT:
            return {
                ...state,
                isLoggedIn: false,
                openID:""
            };

        case TYPES.SET_MEMBERINFO:
            return Object.assign({},state,action.payload);

        case TYPES.CLEAR_MEMBERINFO:
            return Object.assign({},state,action.payload);

        case TYPES.HAS_TOKEN:
            return {
                ...state,
                hasToken: true,
            };
        default:
            return state;
    }

}