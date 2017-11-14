/**
 * Created by ml23 on 2017/08/04.
 */


import AppNavigator from "../AppNavigator";

const navReducer = (state, action) => {
    const newState = AppNavigator.router.getStateForAction(action, state);
    return newState || state;
};
