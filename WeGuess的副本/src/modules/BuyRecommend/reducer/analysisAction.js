/**
 * Created by maple on 2017/7/10.
 */

import * as TYPES from './actionTypes'
import NetWorking from '../../../Core/WGNetworking/Network';
import {GetBoughtAnalysisUrl} from '../../Config/apiUrlConfig';
let netWorking = NetWorking.getInstance();

export function getBuyAnalysis(isRefresh) {
    return (dispatch, getState) => {
        let state = getState();
        let {isLoading, pageIndex, pageSize, noMorData, data} = state.analysisStore;

        if (isLoading) {
            if (isRefresh) {
                return
            } else if (noMorData) {
                return;
            }
        }
        try {
            dispatch(disIsLoading(true));
            let index = 1;
            if (isRefresh) {
                dispatch(disNoMore(false));
            } else {
                index = pageIndex + 1;
            }
            let params = {
                PageIndex: index,
                PageSize: pageSize
            }
            netWorking.get(GetBoughtAnalysisUrl, params, {}).then((responense) => {
                let {Result, Data} = responense;
                if (Result == 1) {
                    let rowsData = Data ? Data : [];
                    let length = rowsData.length;
                    let payload = {
                        isRefresh: isRefresh,
                        data: rowsData
                    }
                    if (length < pageSize) {
                        dispatch(disNoMore(true));
                    } else {
                        dispatch(disIsLoading(false));
                    }
                    dispatch(disSuccess(payload));
                } else {
                    dispatch(disError(Result));
                }
            }, (error) => {

                dispatch(disIsLoading(false));
                dispatch(disError(0));
            }).catch((error) => {

                dispatch(disIsLoading(false));
                dispatch(disError(0));
            })
        }
        catch (error) {

        }
    }
}

export function disIsLoading(payload) {
    return {
        type: TYPES.BUYANALYSISLOADING,
        payload: payload
    }
}

export function disNoMore(payload) {
    return {
        type: TYPES.BUYANALYSISNOMORE,
        payload: payload
    }
}

export function disSuccess(payload) {
    return {
        type: TYPES.GETANALYSISSUCCESS,
        payload: payload
    }
}

export function disError(payload) {
    return {
        type: TYPES.GETANALYSISERROR,
        payload: payload
    }
}