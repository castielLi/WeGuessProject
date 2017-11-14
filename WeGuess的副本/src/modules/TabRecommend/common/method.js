/**
 * Created by Hsu. on 2017/8/11.
 */

let method = {
    // 对数字进行处理  10000 =>  10,000
    numberFormat(number){
        let result = '', counter = 0;
        number = (number || 0).toString();
        for (let i = number.length - 1; i >= 0; i--) {
            counter++;
            result = number.charAt(i) + result;
            if (!(counter % 3) && i !== 0) {
                result = ',' + result;
            }
        }
        number = result;
        return number;
    },

    //处理时间格式（second决定格式:Boole） "2017-08-10 13:33:00" => "2017/08/10 13:33:00" or "2017/08/10 13:33"
    timeFormat(time, second = false){
        let result = '';
        for (let i = 0; i < time.length; i++) {

            if (time.charAt(i) === '-') {
                result += '/';
            } else {
                result += time.charAt(i);
            }
        }
        if (second) {
            return result.slice(0, -3);
        }
        return result;
    },

    //处理时间格式（second决定格式:Boole） "2017-08-10 13:33:00" => "2017/08/10 13:33:00" or "08/10 13:33"
    timeFormatTwo(time, second = false){
        let result = '';
        for (let i = 0; i < time.length; i++) {

            if (time.charAt(i) === '-') {
                result += '/';
            } else {
                result += time.charAt(i);
            }
        }
        if (second) {
            return result.slice(5, -3);
        }
        return result;
    },


};

export default method;