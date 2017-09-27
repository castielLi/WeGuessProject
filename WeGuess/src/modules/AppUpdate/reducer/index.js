/**
 * Created by apple on 2017/6/7.
 */

import * as TYPES from './actionTypes';
import {fromJS} from 'immutable';

//版本state
const versionState={
	 version:null,
	 download:null,
	 dateTime:0
}

export default function versionStore(state=versionState,action){
	switch (action.type){
		case TYPES.VERSION_NUMBER:
			return fromJS(state).setIn(['version'],action.payload.Version).setIn(['download'],action.payload.DownloadUrl).setIn(['dateTime'],action.payload.DateTime).toJS();
		default:
		    return state;
	}
}
