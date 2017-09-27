/**
 * Created by maple on 2017/6/7.
 */
import { combineReducers } from 'redux';
import loginStore from '../../modules/TokenManager/reducer';
import buyBetRecordStore from '../../modules/BuyRecommend/reducer/betRecordStore';
import analysisStore from '../../modules/BuyRecommend/reducer/analysisStore';
import versionStore from '../../modules/AppUpdate/reducer';

//和导航相关的reducer通过从调用出传递进来
export default function getReducers(navReducer) {
	return combineReducers({
		loginStore,
		buyBetRecordStore,
		analysisStore,
		versionStore,
		nav: navReducer,
	});
}