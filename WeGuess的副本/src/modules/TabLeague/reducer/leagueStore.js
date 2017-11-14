/**
 * Created by apple on 2017/6/7.
 */
import {fromJS} from 'immutable';
import * as TYPES from './actionTypes';

const initialState = {
    data: [],
};

export default function leagueResult(state = initialState, action) {
    switch (action.type) {
        case TYPES.LEAGUERESULT:
            return fromJS(state).setIn(["data"], action.payload).toJS();
        default:
            return state;
    }

}