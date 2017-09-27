/**
 * Created by maple on 2017/6/6.
 */
'use strict';

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import TokenManager from './modules/TokenManager';

import {AppWithNavigationState,store} from './modules/Root'


export default class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

        console.ignoredYellowBox = ['Warning: In next release','Remote debugger'];

        //初始化Token;
        let tokenManager = TokenManager.getInstance(store);
        tokenManager.InitToken();
    }

    render() {
        return (
            <Provider store={store}>
                <AppWithNavigationState />
            </Provider>
        )
    }
}
