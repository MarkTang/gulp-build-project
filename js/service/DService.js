/**
 * Created by sc09395 on 2014/10/21 0021.
 */
app.factory("DService", function () {
    function DService(oParams) {
        var self = this;
        this.totalCount = null;
        this.isAppend = true;//拼接
        this.canILoad = true;
        this.isbusy = false;
        this.loaderText = "努力加载中";
        this.loaderClass = "";
        this.params = {
//            lineId:"",
//            page:1,
//            pageSize:10,
//            dPlineAssess:0
        }
        this.builtParams = {
            "param": {
                "servicename": oParams.serviceName,
                "requrl": self.encode(oParams.url),
                "reqbody": "",
                "iscache": oParams.iscache || "0"
            },
            "CBPluginName": oParams.pluginName,
            "CBTagName": oParams.actionName
        }
    }

    DService.prototype.buildParams = function () {
        var params = this.params;
        var paramsArray = [];
        for (var o in params) {
            if (params[o] != "") {
                if (Object.prototype.toString.call(params[o]) === '[object Array]'){
                    paramsArray.push('"' + o + '":' + JSON.stringify(params[o]));
                    continue;
                }
                paramsArray.push('"' + o + '":' + '"' + params[o] + '"');
            }
        }
        this.builtParams.param.reqbody = paramsArray.join(",");
    }

    DService.prototype.getData = function () {

        if (this.isbusy || !this.canILoad) {
            return;
        }

        if ((this.params.page && this.params.page > this.totalCount && this.totalCount != null)) {
            this.loaderClass = " loaderNo";
            this.loaderText = "没有更多内容了哦";
            this.canILoad = false;
            return false;
        }
        else {
            this.canILoad = true;
            this.loaderClass = "";
            this.loaderText = "努力加载中";
        }



        var self = this;
        this.isbusy = true;


        window._tc_bridge_util.get_data(self.builtParams);
    }

    DService.prototype.encode = function (str) {
        return encodeURIComponent(str);
    }
    return DService;
})