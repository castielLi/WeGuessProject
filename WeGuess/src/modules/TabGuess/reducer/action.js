/**
 * Created by apple on 2017/7/10.
 */

import * as TYPES from './actionTypes'

export function guessTypeTime(flag){
    return {
        type: TYPES.GUESS_TYPE,
        payload:flag,
    };

}
