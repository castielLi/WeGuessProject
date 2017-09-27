/**
 * Created by maple on 2017/6/7.
 */
'use strict';


import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native-storage';
import reducers from './reducer/reducer';

const logger = store => next => action => {

    let result = next(action);

    return result;
}

let middlewares = [
    logger,
    thunk
];

let createAppStore = applyMiddleware(...middlewares)(createStore);


export default function configureStore(onComplete){
    const store = autoRehydrate()(createAppStore)(reducers);
    let opt = {
        storage: AsyncStorage,
        transform: [],
        //whitelist: ['userStore'],
    };
    // persistStore(store, opt, onComplete);
    return store;
}