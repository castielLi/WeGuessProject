/**
 * Created by apple on 2017/7/10.
 */

import * as TYPES from './actionTypes'

export function disLeagueResult(payload) {
    return {
        type: TYPES.LEAGUERESULT,
        payload: payload
    }
}
