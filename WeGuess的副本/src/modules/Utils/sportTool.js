
    var base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function (e) {
            var t = "";
            var n, r, i, s, o, u, a;
            var f = 0;
            e = base64._utf8_encode(e);
            while (f < e.length) {
                n = e.charCodeAt(f++);
                r = e.charCodeAt(f++);
                i = e.charCodeAt(f++);
                s = n >> 2;
                o = (n & 3) << 4 | r >> 4;
                u = (r & 15) << 2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) {
                    u = a = 64;
                } else if (isNaN(i)) {
                    a = 64;
                }
                t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
            }
            return t;
        },
        decode: function (e) {
            var t = "";
            var n, r, i;
            var s, o, u, a;
            var f = 0;
            e = e.replace(/[^A-Za-z0-9+/=]/g, "");
            while (f < e.length) {
                s = this._keyStr.indexOf(e.charAt(f++));
                o = this._keyStr.indexOf(e.charAt(f++));
                u = this._keyStr.indexOf(e.charAt(f++));
                a = this._keyStr.indexOf(e.charAt(f++));
                n = s << 2 | o >> 4;
                r = (o & 15) << 4 | u >> 2;
                i = (u & 3) << 6 | a;
                t = t + String.fromCharCode(n);
                if (u != 64) {
                    t = t + String.fromCharCode(r);
                }
                if (a != 64) {
                    t = t + String.fromCharCode(i);
                }
            }
            t = base64._utf8_decode(t);
            return t;
        },
        _utf8_encode: function (e) {
            e = e.replace(/rn/g, "n");
            var t = "";
            for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r);
                } else if (r > 127 && r < 2048) {
                    t += String.fromCharCode(r >> 6 | 192);
                    t += String.fromCharCode(r & 63 | 128);
                } else {
                    t += String.fromCharCode(r >> 12 | 224);
                    t += String.fromCharCode(r >> 6 & 63 | 128);
                    t += String.fromCharCode(r & 63 | 128);
                }
            }
            return t;
        },
        _utf8_decode: function (e) {
            var t = "";
            var n = 0;
            var r,c2,c3;
            while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r);
                    n++;
                } else if (r > 191 && r < 224) {
                    c2 = e.charCodeAt(n + 1);
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                    n += 2;
                } else {
                    c2 = e.charCodeAt(n + 1);
                    c3 = e.charCodeAt(n + 2);
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    n += 3;
                }
            }
            return t;
        }
    };
    let tools = {
        Base64: base64,
        //计算HDP
        Fmoney: function (n) {
            n = (n > 0 && n <= 20) ? n : 2;
            var s = parseFloat(this.replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(),
				r = s.split(".")[1],
				t = "",
				len = l.length;
            for (var i = 0; i < len; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != len ? "," : "");
            }
            return t.split("").reverse().join("") + "." + r;
        },
        ContactJson: function (json1, json2) {
            for (var key in json2) {
                if (json1 && !json1.hasOwnProperty(key)) {
                    json1[key] = json2[key];
                }
            }
            return json1;
        },
        //获取日期列表，initdate初始时间，num初试时间后的天数
        GetDateList: function (initdate, num) {
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
        },
        //判断json数组是否含某个值
        ArrayContain: function (arr, item, key) {
            if (arr instanceof Array) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i][key] == item) {
                        return true;
                    }
                }
            }
            return false;
        }
    }


String.prototype.fmoney = function (n) {
    n = (n > 0 && n <= 20) ? n : 2;
    var s = parseFloat(this.replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
		r = s.split(".")[1],
		t = "",
		len = l.length;
    for (var i = 0; i < len; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != len ? "," : "");
    }
    //return t.split("").reverse().join("") + "." + r;//保留小数
    return t.split("").reverse().join("");
};
String.prototype.format = function (args) {
    if (arguments.length > 0) {
        var result = this,
			reg, length = arguments.length;
        if (length === 1 && typeof (args) == "object") {
            for (var key in args) {
                reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        } else {
            for (var i = 0; i < length; i++) {
                reg = new RegExp("({[" + i + "]})", "g");
                result = result.replace(reg, arguments[i]);
            }
        }
        return result;
    }
    return this;
};
Date.prototype.format = function (fmt) {
    var o = {
        "Y+": this.getFullYear(),
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, //12小时制
        "H+": this.getHours(),
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds(), //毫秒
        "P": this.getHours() <= 12 ? "AM" : "PM"
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) {
            if (k == "Y+") {
                fmt = fmt.replace(RegExp.$1, o[k]);
            } else {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }

        }
    return fmt;
};
//时间增减小时数
Date.prototype.addHours = function (offsetHours) {
    if (isNaN(offsetHours)) {

        return this;
    }
    var ts = this.valueOf();
    ts += parseInt(offsetHours * 60 * 60 * 1000);
    ts = new Date(ts);
    return ts;
};

//时间增减小时数
Date.prototype.getReportDate = function () {
    var ts = this.valueOf();
    ts += parseInt(-12 * 60 * 60 * 1000);
    ts = new Date(ts);
    ts.setHours(0);
    ts.setMinutes(0);
    ts.setSeconds(0);
    return ts;
};

export default tools