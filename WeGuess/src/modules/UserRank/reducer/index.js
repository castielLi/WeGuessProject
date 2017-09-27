/**
 * Created by maple on 2017/6/7.
 */

import * as TYPES from './actionTypes';

const initialState = {
    isLoggedIn: false,
    openID: ""
};

export default function loginStore(state = initialState, action) {
    switch (action.type) {
        case TYPES.LOGGED_IN:
            return {
                ...state,
                isLoggedIn: true,
                openID: action.payload
            };

        case TYPES.LOGGED_OUT:
            return {
                ...state,
                isLoggedIn: false,
                openID: ""
            };
        case TYPES.LOGGED_ERROR:
            return {
                ...state,
                isLoggedIn: false
            }

        default:
            return state;
    }

}