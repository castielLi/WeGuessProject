/**
 * Created by ml23 on 2017/08/02.
 */

import NetWorking from '../../Core/WGNetworking/Network';
import StorageHelper from '../../Core/StorageHelper';
import {GetTokenUrl} from '../Config/apiUrlConfig';

import {loginIn, loginOut, getMemberInfo, clearMemberInfo, hasToken} from './reducer/action';
import BackgroundTimer from 'react-native-background-timer';


let netWorking = NetWorking.getInstance();
let storageHelper = new StorageHelper();
let defaultRefreshTime = 30000;

export default class TokenManager {
    constructor() {
        this.store = null;
        this.token = "";
    }

    static getInstance(store) {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        if (store) {
            TokenManager.instance.store = store;
        }
        return TokenManager.instance;
    }

    InitToken() {
        let that = this;
        storageHelper.init();
        netWorking.setHeaders({QIC: "QIC"});
        netWorking.setHeaders({Authorization: this.token});
        storageHelper.load("Token", null).then((data) => {
            netWorking.setHeaders({Authorization: data});
            that.refreashToken().then((response) => {
                this.store.dispatch(hasToken());
                if (!response.Data.Tourist) {
                    this.store.dispatch(getMemberInfo());
                }
            }, (error) => {

            });
            that.CircleToken();
        }, (error) => {

            that.setToken("", false);
            that.refreashToken().then((response) => {
                this.store.dispatch(hasToken());
            });
            ;
            that.CircleToken();
        });
    }

    CircleToken() {
        let that = this;
        const intervalId = BackgroundTimer.setInterval(() => {
            that.refreashToken()
        }, defaultRefreshTime);
    }

    setToken(token, isLogin = false, refreshTime = 30000, openID = "") {
        netWorking.setHeaders({Authorization: token});
        defaultRefreshTime = refreshTime * 10;
        if (isLogin) {
            this.store.dispatch(loginIn(openID));
        } else {
            this.store.dispatch(loginOut(""));
            this.store.dispatch(clearMemberInfo());
        }
        storageHelper.save("Token", token, null);
        storageHelper.save("IsLogin", isLogin, null);
        this.token = token;
    }

    clearToken() {
        netWorking.setHeaders({Authorization: ""});
        this.refreashToken();
        this.store.dispatch(clearMemberInfo());
    }

    getToken() {
        var that = this;
        return new Promise((resolve, reject) => {
            if (that.token == "") {
                that.refreashToken().then(() => {
                    resolve(that.token)
                });
            } else {
                resolve(that.token)
            }
        })
    }

    refreashToken() {
        var that = this;
        return new Promise((resolve, reject) => {
            netWorking.get(GetTokenUrl, null, {}).then((response) => {
                if (response.Result == 1) {
                    that.setToken(response.Data.Token, !response.Data.Tourist, response.Data.RefreshTime, response.Data.OpenID);
                    resolve(response);
                }
            }, (error) => {
				// that.clearToken();
            });
        })
    }

}