/**
 * Created by maple on 2017/6/7.
 */
import {fromJS} from 'immutable';
import * as TYPES from './actionTypes';

const initialState = {
    pageIndex: 1,
    pageSize: 10,
    noMorData: false,
    isLoading: false,
    data: [],
    error: null
};

export default function analysisStore(state = initialState, action) {
    switch (action.type) {
        case TYPES.BUYANALYSISLOADING:
            return fromJS(state).setIn(["isLoading"], action.payload)
                .setIn(["isNewData"], false).toJS();

        case TYPES.BUYANALYSISNOMORE:
            return fromJS(state).setIn(["noMorData"], action.payload)
                .setIn(["isNewData"], false).toJS();
        case TYPES.GETANALYSISSUCCESS:
            if (action.payload.isRefresh) {
                return fromJS(state).setIn(["data"], action.payload.data)
                    .setIn(["isNewData"], true).toJS();
            } else {
                return fromJS(state).update('data', list => list.concat(action.payload.data))
                    .setIn(["error"], null)
                    .setIn(["isNewData"], true).toJS();
            }
        case TYPES.GETANALYSISERROR:
            return fromJS(state).setIn(["error"], action.payload).toJS();
        default:
            return state;
    }

}