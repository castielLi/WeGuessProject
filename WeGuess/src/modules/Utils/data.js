/**
 * Created by ml23 on 2017/08/22.
 */

//抢红包活动状态
export function dealStatus(betInfo) {
    if (betInfo.IsCancel) {
        betInfo.Order = 4;
    } else if (betInfo.IsEnd) {
        betInfo.Order = 6;
    } else if (betInfo.IsOver) {
        betInfo.Order = 5;
    } else if (betInfo.IsBet) {
        betInfo.Order = 2;
    } else if (betInfo.IsFull) {
        betInfo.Order = 3;
    } else {
        betInfo.Order = 1;
    }
    return betInfo;
}
//数据重组格式 [{a:1},{b:2},{c:3},{d:4}]  =>  [[{a:1},{b:2}],[{c:3},{d:4}]]
export function dataFormat(data) {
    var arr = [];
    for (var i = 0; i < data.length; i += 2) {
        var newArr = [];
        newArr.push(data[i]);
        data[i + 1] && newArr.push(data[i + 1]);
        arr.push(newArr)
    }
    return arr;
}