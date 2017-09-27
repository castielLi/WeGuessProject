/**
 * Created by ml23 on 2017/08/04.
 */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import promiseMiddleware from 'redux-promise';

import getReducers from './reducer/reducer';

//promiseMiddleware 是异步action的一个中间件，本例子中暂时没有使用

export default function getStore(navReducer) {
    return createStore(
        getReducers(navReducer),
        undefined,
        applyMiddleware(thunk)
    );
}