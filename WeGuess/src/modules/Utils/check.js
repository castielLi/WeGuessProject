/**
 * Created by ml23 on 2017/08/14.
 */

export function isPhone(phone) {
    if (/^((\+)?86|((\+)?86)?)0?1[34578]\d{9}$/.test(phone)) {
        return true
    }

    return false;
}

export function isCaptcha(captcha) {
    if (/^.{4,6}$/.test(captcha)) {
        return true;
    }

    return false
}

export function checkPassword(pwd) {
    if(/^(?=.*[A-Za-z])[A-Za-z\d]{8,20}$/.test(pwd)){
        return true;
    }

    return false;
}