/**
 * Created by maple on 2017/08/07.
 */
const NeedLoginPage = ["TabMe"];

export default function CheckNeedLogin(page,isLogin) {
    if (NeedLoginPage.indexOf(page) > -1&&!isLogin) {
        return true;
    } else {
        false
    }
}