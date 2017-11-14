/**
 * Created by maple on 2017/6/7.
 */
'use strict'

import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import AppNavigator from "./Config/AppNavigator";
import getStore from "../store/store";
import SplashScreen from 'react-native-splash-screen';
import * as Actions from './TokenManager/reducer/action';

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        SplashScreen.hide();
    }

    onNavigationStateChange(preState, currentState) {
        if(currentState.index==0&&currentState.routes[0].index==4){
            this.props.getMemberInfo();
        }
    }


    render() {
        return (
            <AppNavigator onNavigationStateChange={this.onNavigationStateChange.bind(this)}/>
        );
    }
}

const mapStateToProps = (state) => ({

});
const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions, dispatch)
});

export const AppWithNavigationState = connect(mapStateToProps,mapDispatchToProps)(App);

const navReducer = (state, action) => {
    let newAction = action;
    const newState = AppNavigator.router.getStateForAction(newAction, state);
    return newState || state;
};

export const store = getStore(navReducer);