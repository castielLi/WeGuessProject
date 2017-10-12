/**
 * Created by maple on 2017/6/7.
 */
'use strict'

import React, {Component} from 'react';
import {
    BackHandler,
    ToastAndroid,
    View,
    AsyncStorage,
    Image
} from 'react-native';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import AppNavigator from "./Config/AppNavigator";
import getStore from "../store/store";
import SplashScreen from 'react-native-splash-screen';
import * as Actions from './TokenManager/reducer/action';
import AppUpdate from './AppUpdate/page/index';
import ContainerComponent from '../Core/Component/ContainerComponent';
import DeviceInfo from 'react-native-device-info';
import HOCFactory from "../Core/HOC";

class App extends ContainerComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        SplashScreen.hide();
        this.asyncStorage();
    }

    asyncStorage() {
        let currentVersion = DeviceInfo.getVersion();
        AsyncStorage.getItem('version', (err, res) => {
            if (res == null && res != currentVersion) {
                AsyncStorage.setItem('version', currentVersion);
                this.setState({homePageShow: false});
            } else {
                AsyncStorage.clear();
                this.setState({homePageShow: true});
            }
        })
    }

    onNavigationStateChange = (preState, currentState) => {
        if (currentState.index == 0 && currentState.routes[0].index == 4) {
            this.props.getMemberInfo();
        }
    }

    close() {
        this.setState({
            homePageShow: true
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <AppNavigator onNavigationStateChange={this.onNavigationStateChange.bind(this)}/>
                <AppUpdate />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions, dispatch)
});

export const AppWithNavigationState = HOCFactory(connect(mapStateToProps, mapDispatchToProps)(App),["HocAndroidBack"]);

const navReducer = (state, action) => {
    let newAction = action;
    const newState = AppNavigator.router.getStateForAction(newAction, state);
    return newState || state;
};

export const store = getStore(navReducer);