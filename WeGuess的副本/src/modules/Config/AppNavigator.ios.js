/**
 * Created by maple on 2017/6/6.
 */

import {StackNavigator} from "react-navigation";

import MainTabBar from "./TabbarConfig";
import Login from "../Login/page";
import Register from "../Register/page";
import ActionDetail from "../ActionDetail/page";
import Analysis from "../Analysis/page";
import AnalysisDetail from "../AnalysisDetail/page";
import BindPhone from "../BindPhone/page";
import BuyRecommend from "../BuyRecommend/page";
import ForgetPwd from "../ForgetPwd/page";
import MoneyRecord from "../MoneyRecord/page";
import NewPwd from "../NewPwd/page";
import Rank from "../Rank/page";
import UserRank from "../UserRank/page";
import VoucherCenter from "../VoucherCenter/page";
import Test from "../Test/page";
import SportMatch from "../SportMatchItem/page";
import SportRank from "../SportRank/page";
import SportBetList from "../SportBetList/page";
import GuessRule from "../Rule/guessRule";
import EventDetails from '../EventDetails/page/index';
import NoticePage from '../Notice/page/index';
const AppNavigator = StackNavigator({
    TabHome: {screen: MainTabBar},
    Login: {screen: Login},
    Register: {screen: Register},
    ActionDetail: {screen: ActionDetail},
    Analysis: {screen: Analysis},
    AnalysisDetail: {screen: AnalysisDetail},
    BindPhone: {screen: BindPhone},
    BuyRecommend: {screen: BuyRecommend},
    ForgetPwd: {screen: ForgetPwd},
    MoneyRecord: {screen: MoneyRecord},
    NewPwd: {screen: NewPwd},
    Rank: {screen: Rank},
    UserRank: {screen: UserRank},
    VoucherCenter: {screen: VoucherCenter},
    Test: {screen: Test},
    SportMatch: {screen: SportMatch},
    SportRank: {screen: SportRank},
    SportBetList: {screen: SportBetList},
    GuessRule: {screen: GuessRule},
    EventDetails:{screen:EventDetails},
    NoticePage:{screen:NoticePage},
}, {
    initialRouteName: "TabHome",
    navigationOptions: {
        headerStyle: {
            height: 64,
            paddingBottom: 1,
            paddingTop: 20,
            backgroundColor: "#ffffff",
            borderBottomWidth: 1,
            borderBottomColor: "#eeeeee"
        },
        headerTintColor: "#3a66b3",
        headerTitleStyle: {
            fontSize: 18,
            alignSelf: 'center',
            backgroundColor: "#ffffff",
        },
        headerBackTitleStyle: {
            color: "#3a66b3",
        }
    },
    onTransitionStart: (pre, cur) => {
    }, //页面切换开始回调
    onTransitionEnd: (pre, cur) => {
    }//页面切换结束回调
});

export default AppNavigator;
