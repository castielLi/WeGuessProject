/**
 * Created by apple on 2017/7/10.
 */

import * as TYPES from './actionTypes';

import {GetVersionUrl} from '../../Config/apiUrlConfig';
import NetWorking from '../../../Core/WGNetworking/Network';
this.networking = NetWorking.getInstance();
//获取版本号
export function getVersion(){
	return (dispatch,getState)=>{
        this.networking.get(GetVersionUrl, {})
            .then((data) => {
                if (data.Result == 1) {
                    let payload={
                    	Version:data.Version,
						DownloadUrl:data.DownloadUrl,
                        DateTime:new Date().getTime()
					};
                    dispatch(versionNumber(data.Data))
                }
            }, (error) => {

            }).catch((error) => {

        });
	}
}

export function versionNumber(payload){
	return{
		type:TYPES.VERSION_NUMBER,
		payload:payload
	}
}
