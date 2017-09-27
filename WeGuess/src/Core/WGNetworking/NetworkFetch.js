/**
 * Created by maple on 2017/6/8.
 */
import  * as config from './NetworkConfig';
import fetch from './RewriteFetch';
import ContainerComponent from '../Component/ContainerComponent';

export default class NetworkFetch{
    constructor() {
        this.headers = {
            "Accept": "application/json",
            'Content-Type': "application/x-www-form-urlencoded",
            'Access-Control-Allow-Origin': "*"
        };
        this.options = {};
    }

    setOptions(headers, isCors = true) {
        this.headers = Object.assign(this.headers, headers);
        if (typeof isCors != 'undefined') {
            this.options = isCors ? Object.assign({}, this.options, {mode: "no-cors"}) : this.options;
        }
    }

    get(url, params, headers = {}) {
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));

            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }

        let options = {
            method: "GET",
            headers: Object.assign({}, this.headers, headers)
        }
        options = Object.assign(options, this.options);

        return this.promiseRequest(url, options);
    }

    post(url, params, headers = {}) {
        let paramsArray = [];
        if (params) {
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
        }
        let obj = {
            method: "POST",
            headers: Object.assign({}, this.headers, headers),
            body: paramsArray.join('&')
        }
        return this.promiseRequest(url, obj);
    }

    promiseRequest(requestURL, requestObject) {
        return new Promise((resolve, reject) => {
            fetch(requestURL, requestObject)
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        return response
                    } else {
                        reject && reject(response);
                    }
                },e=>{reject && reject(e)})
                .then((response) =>{
                    if(response){
                      return response.json()
                    }
                })
                .then((responseJSON) => {
                    resolve && resolve(responseJSON)
                })
                .catch(e => {
                    reject && reject(e);                      
                });

        });
    }

}