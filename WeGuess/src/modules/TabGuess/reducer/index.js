/**
 * Created by apple on 2017/6/7.
 */

import * as TYPES from './actionTypes';

const initialState = {
    type: 1,
};

export default function guessStore(state = initialState, action) {
    switch (action.type) {
        case TYPES.GUESS_TYPE:
            return {
                ...state,
                type: action.payload,
            };
        default:
            return state;
    }
}

