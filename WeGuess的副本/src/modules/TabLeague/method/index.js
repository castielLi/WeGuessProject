//数字转千分位方法
function numFormat (num) {
    return (num+ '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
//时间格式化方法
function timeFormat(dateString,fmt){
    let date = parseDate(dateString);
    const o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o){
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }        
    return fmt;
}
//数据重组格式 [{a:1},{b:2},{c:3},{d:4}]  =>  [[{a:1},{b:2}],[{c:3},{d:4}]]
function dataFormat(data){
    var arr = [];
    for(var i = 0;i<data.length;i+=2){
      var newArr = [];
      newArr.push(data[i]);
      data[i+1]&&newArr.push(data[i+1]);
      arr.push(newArr)
    }
    return arr;
  }
//new Data('2016-11-15 10:20')在不同内核存在兼容问题，使用以parseDate('2016-11-15 10:20')代替
function parseDate(date) {
    var isoExp, parts;
    isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s(\d\d):(\d\d):(\d\d)\s*$/;
    try {
        parts = isoExp.exec(date);
    } catch(e) {
        return null;
    }
    if (parts) {
        date = new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]);
    } else {
        return null;
    }
    return date;
}

//获取日期列表，initdate初始时间，num初试时间后的天数
function getDateList(initdate, num) {
            var datelist = new Array();
            for (var i = 0; i < num; i++) {
                var date = new Date(initdate.getTime() + i * 1000 * 24 * 60 * 60);
                var item = {
                    "date": date.format("YY-MM-dd"),
                    "day": w.Language.DayList[date.getDay()]
                }
                datelist.push(item);
            }
            return datelist;
}

        //判断json数组是否含某个值
function ArrayContain(arr, item, key) {
            if (arr instanceof Array) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i][key] == item) {
                        return true;
                    }
                }
            }
            return false;
}

  //计算滚球时间
function ComputeLiveTime(sportId, phase, livetime) {
            switch (sportId) {
                case 1: //足球
                    switch (phase) {
                        case -1:
                            return "Live!";
                        case 0:
                            return "中场";
                        case 1:
                            if (livetime < 45) {
                                return livetime + "'";
                            } else {
                                return "45'+";
                            }
                        case 2:
                            return 45 + livetime + "'";
                    }
                    break;
                case 2: //篮球
                    return phase + "Q" + ":" + livetime + "'";
            }
            return "";
}
export {numFormat,timeFormat,dataFormat,getDateList,ArrayContain,ComputeLiveTime}