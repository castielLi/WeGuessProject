/**
 * Created by maple on 2017/5/15.
 */
'use strict';

import  NetworkFetch from './NetworkFetch';


export default class NetWorking {
    constructor() {
        this.UseingFramework = "";
        this.RequestFramework = null;
    }

    static getInstance(frameworkName = "fetch") {
        if (NetWorking.instance) {
            return NetWorking.instance;
        }
        NetWorking.instance = new NetWorking();
        NetWorking.instance.UseingFramework = frameworkName;
        if (NetWorking.instance.UseingFramework === 'fetch') {
            NetWorking.instance.RequestFramework = new NetworkFetch();
        } else {
            NetWorking.instance.RequestFramework = methodsAxios;
        }
        return NetWorking.instance;
    }

    get(url, params, headers = {}) {
        return this.RequestFramework.get(url, params, headers)
    }

    post(url, params, headers = {}) {
        return this.RequestFramework.post(url, params, headers)
    }

    setHeaders(headers = {}, isCors = true) {
        this.RequestFramework.setOptions(headers, isCors);
    }

    setAuthToken(tokenConfig = [], isCors = true) {
        let obj = {};
        let length = tokenConfig.length;
        for (let i = 0; i < length; i++) {
            obj = Object.assign(obj, tokenConfig[i]);
        }
        this.RequestFramework.setOptions(obj, isCors);
    }


}
