/*
 * 处理数据
 */
      import Tools from './sportTool.js'
    const HandleData = {
        //计算hdp
        ComputeHDP: function (data) {
            var hdp = Math.abs(data || 0);
            hdp = (hdp % 0.5) == 0.25 ? "{0}/{1}".format(hdp - 0.25, hdp + 0.25) : hdp;

            return hdp;
        },
        showHDP: function (hdp, pos, market) {
            if (market == 3 || market == 4) {
                return HandleData.ComputeHDP(hdp);
            }
            if (market == 1 || market == 2) {
                if (pos == 1) {
                    return HandleData.HdpH(hdp);
                }
                if (pos == 2) {
                    return HandleData.HdpA(hdp);
                }
            }

            return "";
        },
        HdpH: function (hdp) { //计算主队让球hdp
            var str = hdp < 0 ? "-" : "+";
            str = hdp == 0 ? "" : str;
            return str + HandleData.ComputeHDP(hdp);
        },
        HdpA: function (hdp) { //计算客队让球hdp
            var str = hdp < 0 ? "+" : "-";
            str = hdp == 0 ? "" : str;
            return str + HandleData.ComputeHDP(hdp);
        },
        FormatOdds: function (odds) {
            if (odds == 0) { return "-" };
            return odds;
        },
        //计算滚球时间
        ComputeLiveTime: function (sportId, phase, livetime) {
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
        },
        IsEmptyObj: function (obj) {
            if (obj == null) {
                return true;
            }
            for (var pro in obj) {
                if (this.hasOwnProperty(pro)) { // 这里扩展了对象,所以必须判断
                    return true;
                }
            }
            return false;
        },
        //滚球与混合过关
        CompareChange: function (olddata, newdata) {
            if (newdata == null) {
                return;
            }
            if (olddata == null) {
                if (newdata == null) {
                    olddata = {};
                } else {
                    olddata = newdata;
                }
                return {};
            };
            var MH = olddata.MH,
				d = newdata,
				changed = {};
            var matchlist = {};
            if (MH != null && MH != undefined) {
                for (var i = 0; i < MH.length; i++) {
                    matchlist[MH[i].MatchID + ""] = i;
                }
                if (d.D) {
                    var deleatelist = {};
                    d.D.forEach(function (id, i) {
                        deleatelist[id] = true;
                    });
                    MH.forEach(function (m, k) {
                        if (deleatelist.hasOwnProperty(m.MatchID)) {
                            MH[k].MK = {};
                        }
                    });
                    deleatelist = null;
                }; //删除取消的比赛
                if (d.MH) {
                    for (var k = 0; k < d.MH.length; k++) {
                        var item = d.MH[k];
                        k = matchlist[d.MH[k].MatchID + ""]; //获取数组索引
                        if (MH[k] && MH[k] != null) {
                            if (item.ML && item.ML.length > 0) { //更新扩展信息
                                if (MH[k].ML && (MH[k].ML[2] != item.ML[2] || MH[k].ML[3] != item.ML[3]))
                                    changed["{0}-score".format(MH[k].M[0])] = true; //记录比分改变
                                MH[k].ML = item.ML;
                            }
                            if (item.M && item.M.length > 0) MH[k].M = item.M; //更新基础信息
                            if (!item.MK || item.MK.length == 0) return {};
                            for (var id in item.MK) {
                                if (item.MK.hasOwnProperty(id)) {
                                    var mk = item.MK[id];
                                    if (!MH[k].MK[id]) MH[k].MK[id] = [];
                                    mk.forEach(function (mkarr, i) {
                                        if (mkarr) {
                                            if (JSON.stringify(MH[k].MK[id][i]) != JSON.stringify(mkarr)) {
                                                mkarr.forEach(function (itema, j) {
                                                    if (MH[k].MK[id][i] && MH[k].MK[id][i][j] && (MH[k].MK[id][i][j].toString() != itema)) {
                                                        if (parseFloat(MH[k].MK[id][i][j]) < parseFloat(itema)) {
                                                            changed["{0}-{1}-{2}-{3}".format(MH[k].M[0], id, i, j)] = 1; //记录增加更改
                                                        } else if (parseFloat(MH[k].MK[id][i][j]) > parseFloat(itema)) {
                                                            changed["{0}-{1}-{2}-{3}".format(MH[k].M[0], id, i, j)] = 2; //记录降低更改
                                                        }
                                                    }
                                                });
                                                MH[k].MK[id][i] = mkarr; //数据刷新
                                            }
                                        }
                                    });
                                    if (mk.length < MH[k].MK[id].length) //删除多余的market数据
                                        MH[k].MK[id] = MH[k].MK[id].slice(0, mk.length);
                                }
                            };
                        } else { MH.push(item); }
                    }
                    olddata.MH = MH;
                }
            } else { olddata.MH = d.MH; };
            var lg = Tools.ContactJson(olddata.LG, newdata.LG);
            olddata.LG = lg;
            return changed;
        },
        //具体比赛数据变更
        MatchChange: function (match, newdata) {
            var changed = {};
            if (match == null) {
                if (newdata == null) {
                    match = {};
                } else {
                    match = newdata;
                }
                return {};
            }
            for (var key in newdata) {
                if (key != "MK") {
                    match[key] = newdata[key];
                }
            }
            if (match.MK != null) {
                for (var i in newdata.MK) { //盘口
                    if (newdata.MK.hasOwnProperty(i)) {
                        var mkarr = newdata.MK[i];
                        if (mkarr != null && mkarr.length > 0) {
                            if (match.MK[i] != null) { //变更盘口
                                mkarr.forEach(function (item, k) {
                                    match.MK[i].forEach(function (olditem, j) {
                                        if (olditem[0] == item[0]) {
                                            item.forEach(function (newodd, h) {
                                                if (parseFloat(newodd) > parseFloat(olditem[h])) { //上升
                                                    changed["{0}-{1}-{2}".format(i, j, h)] = 1; //记录增加更改
                                                } else if (parseFloat(newodd) < parseFloat(olditem[h])) { //下降
                                                    changed["{0}-{1}-{2}".format(i, j, h)] = 2; //记录减少更改
                                                }
                                            })
                                        }

                                    })
                                })
                            } else { //添加盘口
                                match.MK[i] = mkarr;
                            }
                        } else { //关闭盘口
                            match.MK[i] = null;
                        }
                    }
                }
            } else {
                match.MK = newdata.MK;
            }
            return changed;
        }
    }
    export default HandleData;
