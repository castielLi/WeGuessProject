/**
 * Created by ml23 on 2017/08/02.
 */
export const hostUrl = "http://m.weguess.cn";
const baseUrl = "http://m.weguess.cn/memberapi/api/";
// const baseUrl = "http://192.168.0.133:803/memberapi/api/";
const sportBaseUrl = "http://sport.weguess.cn/api/";
export const WebViewUrl = {
    userAgreement: {
        url: hostUrl+"/#/tab/userargreement",
        title: "用户服务协议"
    },
    winBean: {
        url:  hostUrl+"/#/tab/winbean",
        title: "猜豆获取说明"
    },
    analysisRule: {
        url:  hostUrl+"/#/tab/analysisrule",
        title: "众猜解盘说明"
    },
    userRankRule: {
        url:  hostUrl+"/#/tab/userrankrule",
        title: "达人规则"
    },
    awardRule: {
        url:  hostUrl+"/#/tab/awardrule",
        title: "抽奖规则"
    },
    registerAgreement: {
        url:  hostUrl+"/#/tab/userargreement",
        title: "用户协议"
    },
    actionHelp: {
        url:  hostUrl+"/#/tab/gamerule/",
        title: "游戏规则"
    }
}

export const PayUrl = "http://m.weguess.cn";
//同步一些信息
export const SyncUrl = baseUrl + "WeChat/Sync";
//获取版本信息
export const GetVersionUrl =  baseUrl + "WeChat/GetVersion";
//获取Token
export const GetTokenUrl = baseUrl + "WeChat/GetToken";
//活动列表页
export const GetSearchActionUrl = baseUrl + "WeChat/SearchAction";
//活动详情页数据
export const GetSearchActionUrlByActionIDUrl = baseUrl + "WeChat/SearchActionByActionID";
//活动详情页中奖数据
export const GetWinnerListUrl = baseUrl + "WeChat/GetWinnerList";
//提交活动
export const PostActionBetUrl = baseUrl + "WeChat/ActionBet";
//获取用户信息
export const GetMemberInfoUrl = baseUrl + "WeChat/GetMemberInfo";
//登录
export const PostLoginUrl = baseUrl + "WeChat/LoginByMobileAndPassword";

//公告
export const NoticeUrl = baseUrl+"WeChat/GetNotice";
//赛事
//赛事---赛程
export const GetProcessLeague = sportBaseUrl + "getmatchschedule";
//赛事---赛果
export const GetResultLeague = sportBaseUrl + "getmatchresult";
//赛事---即时
export const GetTimeLeague = sportBaseUrl + "getmatchlivedata";

//竞猜
//按时间获取
export const GetOddsByTime = sportBaseUrl + "getdatemenu";
//按联赛
export const GetOddsByLeague = sportBaseUrl + "getleaguemenu";
//获取滚球
export const GetOddsByLive = sportBaseUrl + "getweguessmatchodds";
//获取串关
export const GetOddsByMix = sportBaseUrl + "getweguessmatchodds";
//获取详细比赛
export const GetMatchOdd = sportBaseUrl + "getmatchdata";
//获取一般投注
export const GetBet = sportBaseUrl + "getbet";
//获取混合过关投注
export const GetMixBet = sportBaseUrl + "GetMixBet";
//一般投注
export const Bet = sportBaseUrl + "bet";//post请求
//混合过关投注
export const BetMix = sportBaseUrl + "mixbet";//post请求
//获取余额
export const GetBalance = sportBaseUrl + "getbalance";


//注单
//未结算注单列表
export const GetUnbalancedBets = sportBaseUrl + "getunbalancedbetlist";
//结算注单日期列表
export const GetBalancedBetDate = sportBaseUrl + "getbalancedbetdate";
//结算注单
export const GetBalancedBets = sportBaseUrl + "getbalancedbetlist";

//排行榜
export const GetRankList = baseUrl + "WeChat/WinRateRank";

//注单发布
export const PublishBet = baseUrl + "WeChat/PublishBet";

//获取排行信息
export const GetPublishRankUrl = baseUrl + "WeChat/GetPublishRank";

//获取解盘信息
export const GetAnalysisUrl = baseUrl + "WeChat/GetAnalysis";
//获取所有解盘信息
export const GetAllAnalysis = baseUrl + "WeChat/GetAllAnalysis";
//获取用户所有竞猜信息
export const GetPublishBetByOpenID = baseUrl + "WeChat/GetPublishBetByOpenID";
//获取用户信息
export const GetMemberInfo = baseUrl + "WeChat/GetMemberInfo";
//用户购买解盘信息
export const BuyAnalysis = baseUrl + "WeChat/BuyAnalysis";
//获取解盘信息
export const GetGuessAnalysisByNoUrl = baseUrl + "WeChat/GetGuessAnalysisByNo";
//下注记录
export const BuyBetRecord = baseUrl + "WeChat/BuyBetRecord";
//获取个人发布信息
export const GetMyPublishBet = baseUrl + "WeChat/GetMyPublishBet";

//获取钻石信息
export const GetDiamondsUrl = baseUrl + "WeChat/GetDiamonds";
//获取道具信息
export const GetPropListUrl = baseUrl + "WeChat/GetPropList";
//获取抽奖星星
export const GetAwardListUrl = baseUrl + "WeChat/GetAwardList";
//获取抽奖结束时间
export const GetAwardEndTimeUrl = baseUrl + "WeChat/GetAwardEndTime";
//获取钻石账目
export const GetGoldBalanceLogsUrl = baseUrl + "WeChat/GetGoldBalanceLogs";
//获取猜豆账目
export const GetBeanBalanceLogsUrl = baseUrl + "WeChat/GetBeanBalanceLogs";
//购买钻石
export const BuyDiamondUrl = baseUrl+"WeChat/BuyDiamond";
//购买道具
export const BuyPropUrl = baseUrl+"WeChat/BuyProp";
//抽奖
export const AddAwardRecordUrl = baseUrl+"WeChat/AddAwardRecord";

//检测是否绑定手机号
export const IsBindingPhoneUrl = baseUrl + "WeChat/IsBindingPhone";
//获取验证码
export const GetCaptchaUrl = baseUrl + "WeChat/GetCaptcha";
//绑定手机号
export const BindPhoneUrl = baseUrl + "WeChat/BindingPhone";
//手机号注册
export const RegistByMobilePhoneUrl = baseUrl + "WeChat/RegistByMobilePhone";
//获取注册验证码
export const GetMobileCaptchaForRegistionUrl = baseUrl + "WeChat/GetMobileCaptchaForRegistion";
//重置密码验证码
export const GetMobileCaptchaForRetrievePasswordUrl = baseUrl + "WeChat/GetMobileCaptchaForRetrievePassword";
//验证验证码
export const RetrievePasswordValidateByPhoneUrl = baseUrl + "WeChat/RetrievePasswordValidateByPhone";
//重置密码
export const ResetPasswordUrl = baseUrl + "WeChat/ResetPassword";

//购买推荐,获取购买的解盘
export const GetBoughtAnalysisUrl = baseUrl + "WeChat/GetBoughtAnalysis";
//购买推荐,获取购买的推荐
export const GetBuyBetRecordUrl = baseUrl + "WeChat/GetBuyBetRecord";


