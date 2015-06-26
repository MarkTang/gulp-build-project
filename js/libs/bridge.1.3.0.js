;var ua = navigator.userAgent.toLowerCase();

window._tc_bridge_public = {
    /**
     * @description fake url的name
     * @type {String}
     */
//    urlPrefix: 'tctrip://shouji.17u.cn',

    /**
     * @description 当前平台类型
     * @type {Number} {0: iPhone, 1: Andriod}
     */
    platform: null,

    /**
     * @description 当前是否在客户端中
     * @type {boolean} {true: 在客户端中, false: 不在客户端中}
     */
    isTc: null,
    /**
     * @description 用户是否登录
     * @type {bool} {true: 未登录, false: 已登录}
     */
    isLogin: null,

    /**
     * @description 导航栏是否隐藏
     * @type {bool} {true: 隐藏, false: 显示}
     */
    isNavbarHidden: null,

    /**
     * 是否获取客户端信息getClientInfo
     */
    isGetClientInfo : false,

    /**
     * 会员id信息
     */
    memberId : null,

    /**
     * 会员信息回调实体，现在只支持一个存在
     */
    memberInfoCBObj: null,

    /**
     * @description 判断一个字符串是不是空字符串
     * @param {String} str 待判断的字符串
     * @return {boolean}
     */
    NaEptStr: function (str) {
        return !!(typeof str === 'string' && str.length > 0);
    },

    /**
     * @description 判断一个对象是不是空对象
     * @param {Object} obj 待判断的对象
     * @return {boolean}
     */
    NaEptObj: function (obj) {
        if (obj == null) return false;

        if (obj.length > 0)    return true;

        if (obj.length === 0)  return false;

        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return true;
        }

        return false;
    },

    /**
     * @description 对传入的JSON对象做JSON.stringify和encode操作,并返回结果
     * @param  {JSON} jsonObj 传入的JSON对象
     * @return {String} 返回转义过的JSON字符串
     */
    stringifyAndEncode: function (jsonObj) {
        return (typeof jsonObj === 'string' || this.NaEptObj(jsonObj)) ? encodeURIComponent(JSON.stringify(jsonObj)) : '';
    },

    /**
     * @description 对传入的JSON字符串做decode和JSON.parse操作,并返回结果
     * @param  {JSON} jsonStr 传入的JSON字符串
     * @return {Object} 返回处理过的对象
     */
    decodeAndParse: function (jsonStr) {
        return this.NaEptStr(jsonStr) ? JSON.parse(decodeURIComponent(jsonStr)) : {};
    },

    /**
     * @description 拼接native端方法的JSON字符串参数
     * @param params 调用的方法的参数对象
     * @param CBPluginName 回调h5的模块名
     * @param CBTagName 回调h5某个模块下的方法名
     * @returns {String} 调用native方法的参数
     */
    buildParamString: function (params, CBPluginName, CBTagName) {
        var paramObj = {};
        paramObj.param = params || null;
        paramObj.CBPluginName = CBPluginName || '';
        paramObj.CBTagName = CBTagName || '';

        return window._tc_bridge_public.stringifyAndEncode(paramObj);
    },

    /**
     * @description native回调web
     * @param  {JSON} jsonStr 要传递的JSON字符串,
     *                             格式:
     *                             {
     *                               "tagname": String, // REQUIRED
     *                               "params": Object // OPTIONAL
     *                             }
     *                             tagname是要调用的方法名字, 必填
     *                             params是调用方法时传递的参数, 可选
     */
    ntvCB: function (jsonStr) {

        jsonStr = jsonStr || '';

        if (this.NaEptStr(jsonStr)) {
            //alert(decodeURIComponent(jsonStr));
            var cbObj = this.decodeAndParse(jsonStr),
                cbPlugin = cbObj.pluginname,
                cbAction = cbObj.tagname,
                cbParams = cbObj.param;
            // 回调H5定义的window.action对象里的方法,根据tagname指定方法名
//                alert(cbAction);
//                alert(decodeURIComponent(cbParams.CBData) );
//                alert(window[cbPlugin] +"|"+ window[cbPlugin].hasOwnProperty(cbAction) );

            if (window[cbPlugin] && window[cbPlugin].hasOwnProperty(cbAction)) {

                return window[cbPlugin][cbAction](cbParams);
            } else {
//                    alert(cbAction + "|"+cbPlugin +"|" +cbParams.tagname);
            }

            throw '回调web api出错!不存在window._tc_web_*或window._tc_web_*中没有需要回调的方法';
        }
    },

    /**
     * @brief 内部URL跳转
     * @description 内部隐藏iframe，做URL跳转
     * @method loadURL
     * @param {String} url 需要跳转的链接
     * @since v1.1.0
     */
    loadURL:function(url) {
        var iframe = document.createElement("iframe");
        var cont = document.body || document.documentElement;

        iframe.style.display = "none";
        iframe.setAttribute('src', url);
        cont.appendChild(iframe);

        setTimeout(function(){
            iframe.parentNode.removeChild(iframe);
            iframe = null;
        }, 200);
    },

    /**
     * app版本判断
     * 当前版本高于支持的版本 返回true，反之 返回false
     * @param minVer
     * @returns {boolean}
     */
    isAppVersionGreatThan : function(minVer){
        //var ua = navigator.userAgent;
        var verInt = 0;
        if(/tctravel/.test(ua)){
            var uaArr = ua.split("/"),
                len = uaArr.length,
                verStr = uaArr[len - 1];
            var verStr = verStr.split(".");
            if (verStr.length == 2){
                verStr.push(0);
            }
            else{
                verInt = parseInt(verStr.join(""));
            }
        }
        return verInt >= minVer;
    },


    /**
     * @description 初始化bridge
     */
    init: function () {
        var platform = window.navigator.userAgent.toLowerCase();
        if (platform.indexOf('iphone') > -1) {

            // iPhone
            this.platform = 0;
        }
        if (platform.indexOf('ipad') > -1) {
            // ipad
            this.platform = 0;
        }
        
        if (platform.indexOf('android') > -1) {

            // Android
            this.platform = 1;
        }
        if (platform.indexOf("tctravel") != -1) {
            this.isTc = true;
        }
        else {
            this.isTc = false;
        }

    }
};

window._tc_bridge_public.init();

window._tc_bridge_bar = {
    /**
     * @description 根据传递的参数设置导航栏
     * @param jsonObj
     */
    set_navbar: function (jsonObj) {
        var jsonStr;
        if (window._tc_bridge_public.NaEptObj(jsonObj)) {
            //var params = jsonObj.param;
            //jsonStr = window._tc_bridge_public.buildParamString(jsonObj, params.CBPluginName, params.CBTagName);//2014/11/28 Modified By sc09395
            var jsonStr = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {//iPhone
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_bar", "set_navbar", jsonStr);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_bar.set_navbar(jsonStr);
            }
        }
    },


    /*
     *
     * */

    /**
     * @description 设置导航栏是否隐藏
     * @param isHidden
     */
    set_navbar_hidden: function () {
        var jsonObj = {},
            jsonStr;

        jsonObj.isNavbarHidden = !window._tc_bridge_public.isNavbarHidden;
        jsonStr = window._tc_bridge_public.buildParamString(jsonObj, '_tc_web_bar', 'set_navbar_hidden');

        return window._tc_ntv_bar.set_navbar_hidden(jsonStr);
    },

    /**
     * @description 设置工具栏是否隐藏
     * @param isHidden
     */
    set_toolbar_hidden: function () {
        var jsonObj = {},
            jsonStr;

        jsonObj.isToolbarHidden = !window._tc_bridge_public.isToolbarHidden;
        jsonStr = window._tc_bridge_public.buildParamString(jsonObj, '_tc_web_bar', 'set_tool_bar');

        return window._tc_ntv_bar.set_toolbar_hidden(jsonStr);
    },

    /**
     * @description app分享h5页面内容
     * @param jsonObj
     * @returns {*}
     */
    shareInfoFromH5: function (jsonObj) {
        if (window._tc_bridge_public.NaEptObj(jsonObj)) {
            var jsonStr = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            return window._tc_ntv_bar.shareInfoFromH5(jsonStr);
        }
        throw '分享信息不能为空!';
    }
};

window._tc_bridge_util = {
    //webview后退
    //Added By Reeoo Shen sc09395
    // 2014//11/27
    // support On 7.1
    setwebview_back:function (argStr) {
        if (window._tc_bridge_public.platform === 0) {//iPhone
            window._tc_bridge_util.getEasyJsUrl("_tc_ntv_bar", "set_webview_back", argStr);
        } else {
            _tc_ntv_bar.set_webview_back(argStr);
        }
    },

    //打电话
    show_dialog: function (params) {
        var obj = params.param;
        var jsonStr = window._tc_bridge_public.buildParamString(obj, params.CBPluginName, params.CBTagName);
        if (window._tc_bridge_public.platform === 0)//iPhone
        {
            window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "show_dialog", jsonStr);
        }
        else {
            window._tc_ntv_util.show_dialog(jsonStr);
        }
    },

    dispatch: function dispatch(c, b) {
        try {
            var a = document.createEvent("Event");
            a.initEvent(b, true, true);
            c.dispatchEvent(a)
        } catch (d) {
            alert(d)
        }
    },

    getEasyJsUrl: function (obj, functionName, args) {
        var formattedArgs = [];
        formattedArgs.push("s");
        formattedArgs.push(encodeURIComponent(args));
        var argStr = (formattedArgs.length > 0 ? ":"
        + encodeURIComponent(formattedArgs.join(":")) : "");
        window._tc_bridge_public.loadURL("easy-js:" + obj + ":"
        + encodeURIComponent(functionName + ":") + argStr);
    },

    /**
     * @description 从NA获取接口数据
     * @returns {*}
     */
    get_data: function (params) {
        //alert(params);
        var obj = params.param;
        var jsonStr = window._tc_bridge_public.buildParamString(obj, params.CBPluginName, params.CBTagName);
        if (window._tc_bridge_public.platform == 0) {
            return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "get_data", jsonStr);
        } else if (window._tc_bridge_public.platform == 1) {
            return window._tc_ntv_util.get_data(jsonStr);
        } else {//非客户端，返回数据方便调试
            return getTestData();
        }
        function getTestData() {
            $.ajax({
                type: 'post',
                url: 'http://61.155.159.99:8010/youlun/api/apitesthandler.ashx',
                data: JSON.stringify(obj),
                success: function (data) {
                    var response = {};
                    response.CBData = data;
                    window[params.CBPluginName][params.CBTagName](response);
                }
            });
        }

        //return window._tc_ntv_util.get_data(jsonStr);
    },

    /**
     * @description 提交页面跟踪数据
     * @returns {*}
     */
    set_page: function (params) {
        var obj = params.param;
        var jsonStr = window._tc_bridge_public.buildParamString(obj, params.CBPluginName, params.CBTagName);
        if (window._tc_bridge_public.platform == 0) {
            return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "set_page", jsonStr);
        } else if (window._tc_bridge_public.platform == 1) {
            return window._tc_ntv_util.set_page(jsonStr);
        }
    },
    /**
     * @description 提交事件跟踪数据
     * @returns {*}
     */
    set_event: function (params) {
        var obj = params.param;
        var jsonStr = window._tc_bridge_public.buildParamString(obj, params.CBPluginName, params.CBTagName);
        if (window._tc_bridge_public.platform == 0) {
            return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "set_event", jsonStr);
        } else if (window._tc_bridge_public.platform == 1) {
            return window._tc_ntv_util.set_event(jsonStr);
        }
    },

    ////调用
    //window._tc_bridge_util.getClientInfo(function (data)
    //{
    //    //isTc:是否是客户端,client客户端类型(android、iphone、WP8),version:版本号,memberId:用户id
    //    alert(JSON.stringify(data));
    //});
    getClientInfo : function (funBack) {
        var ua = navigator.userAgent, isTc = (/tctravel/i).test(ua);
        window._tc_bridge_public.isGetClientInfo = false;
        //android
        if (window.Android) {
            var AndroidHandler = eval('(' + Android.getDataFromAndroid() + ')');
            if (AndroidHandler) {
                AndroidHandler.isTc = isTc = true;
                AndroidHandler.client = "android";
                if (!!funBack) {
                    funBack(AndroidHandler);
                } else {
                    window._tc_bridge_util.clientInfoCB(AndroidHandler);
                }
            }
        }
        //iphone
        document.addEventListener('TongChengWebViewJavascriptBridgeReady', function (event) {
            var bridge = event.bridge, m = 0;
            isTc = true;
            bridge.init(function (message, responseCallback) {
            });
            bridge.registerHandler('TongchengJavaScriptHandler', function (data, responseCallback) {
                if (m++ == 0) {
                    data.isTc = isTc;
                    data.client = "iphone";
                    if (!!funBack) {
                        funBack(data);
                    } else {
                        window._tc_bridge_util.clientInfoCB(data);
                    }
                }
            });
        }, false);
        //WP
        window.TongChengWindowsPhoneFuncBack = function (message) {
            try {
                message = eval("(" + message + ")");
                if (message) {
                    isTc = true;
                    message.isTc = isTc;
                }
                if (!!funBack) {
                    funBack(message);
                } else {
                    window._tc_bridge_util.clientInfoCB(data);
                }
            } catch (e) {
            }
        }
        if ((/windows phone 8/i).test(ua)) {
            try {
                window.external.notify('TongChengWindowsPhoneFuncBack');
            }
            catch (e) {
            }
        }
        //非客户端
        window.setTimeout(function () {
            if (!isTc && !!funBack) {
                funBack({isTc: isTc});
            } else if(!!funBack){
                window._tc_bridge_util.clientInfoCB({isTc: isTc});
            }
        }, 1000);
    },

    /**
     * 共享数据中客户端信息返回
     */
    clientInfoCB : function(data){
        if (window._tc_bridge_public.NaEptObj(data)){
            window._tc_bridge_public.memberId = data.memberId;
            window._tc_bridge_public.isGetClientInfo = true;
        }
        if (window._tc_bridge_public.NaEptObj(window._tc_bridge_public.memberInfoCBObj)) {
            var cbJson = {
                "pluginname": window._tc_bridge_public.memberInfoCBObj.CBPluginName,
                "tagname": window._tc_bridge_public.memberInfoCBObj.CBTagName,
                "param": {
                    "tagname": window._tc_bridge_public.memberInfoCBObj.param.tagname
                }
            };
            var CBData = {
                "memberInfo":{
                    "memberId":window._tc_bridge_public.memberId
                }
            };
            cbJson.param.CBData = JSON.stringify(CBData);
            window._tc_bridge_public.ntvCB(window._tc_bridge_public.stringifyAndEncode(cbJson));
            window._tc_bridge_public.memberInfoCBObj = null;//滞空回调信息
        }
    },

    /**
     *  7.1.0新增
     * 获取会员信息 暂时从共享对象获取
     * 需要事先调用window._tc_bridge_util.getClientInfo();
     * @param jsonObj
     * {
       "param": {
       "tagname":"member_info",
       "type":"1 默认 获取信息不管是否有登陆（现在支持）|2 获取登陆"
       },
       "CBPluginName": "_tc_web_util",
       "CBTagName": "get_member_info"
       }
     */
    get_member_info : function(jsonObj){
        window._tc_bridge_public.memberInfoCBObj = jsonObj;
        if(window._tc_bridge_public.isGetClientInfo == true){
            window.setTimeout(function () {
                window._tc_bridge_util.clientInfoCB(null);
            }, 1);
        } else {
            window._tc_bridge_util.getClientInfo();
        }
    },

    /**
     * 7.1.0 开始支持
     * 上传图片
     * {
            "param" : {
                "tagname" : "get_image",
                "imgCount" : "2(图片张数)"
            },
            "CBPluginName" : "_tc_web_util",
            "CBTagName" : "get_imagelist"
        }
     **/
    upload_photo : function(jsonObj){
        var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
        if (window._tc_bridge_public.platform == 0) {
            return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "upload_photo", strParam);
        } else if (window._tc_bridge_public.platform == 1){
            return window._tc_ntv_util.upload_photo(strParam);
        }
    },

    /*
     * 7.1.0 开始支持
     * 关键字搜索
     *jsonObj:{
     "param": {
     "tagname": "keyword_search",
     "cityInfo":{
     "cityType": "1景点 默认|2自助游",
     "cityName": "苏州",
     "cityId": "226"
     }
     },
     "CBPluginName": "_tc_web_bar",
     "CBTagName": "keyword_search"
     }
     */
    keyword_search: function(jsonObj){
        var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
        if (window._tc_bridge_public.platform == 0) {
            return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "keyword_search", strParam);
        } else if (window._tc_bridge_public.platform == 1){
            return window._tc_ntv_util.keyword_search(strParam);
        }
    },

    /*
     * 7.1.0 开始支持
     * 从客户端城市列表设置城市
     *jsonObj:{
     "param": {
     "tagname": "city",
     "cityInfo":{
     "cityType": "1景点 默认|2自助游",
     "cityName": "苏州",
     "cityId": "226"
     }
     },
     "CBPluginName": "_tc_web_bar",
     "CBTagName": "set_city"
     }
     */
    set_city: function(jsonObj){
        var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
        if (window._tc_bridge_public.platform == 0) {
            return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "set_city", strParam);
        } else if (window._tc_bridge_public.platform == 1){
            return window._tc_ntv_util.set_city(strParam);
        }
    },

    /**
     * 7.1.0开始支持
     * @description 单个事件跟踪
     * 如:时长跟踪
     * jsonObj = {
		"param": {
		"category": "36(事件类别)",
		"action": "4(用户行为)",
		"optLabel": "(浏览器|浏览器版本|网络)记录的值名称，需要保证|的完整",
		"optValue":"耗时(毫秒数) 资源id",
		"pagename":"页面名称 如：h5_test"
		},
		"CBPluginName": "_tc_web_util",
		"CBTagName": "set_category_event"
		};
     * @returns {*}
     */
    set_category_event: function (jsonObj) {
        var jsonStr = window._tc_bridge_public.stringifyAndEncode(jsonObj);
        if (window._tc_bridge_public.platform == 0) {
            return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "set_category_event", jsonStr);
        } else if (window._tc_bridge_public.platform == 1) {
            return window._tc_ntv_util.set_category_event(jsonStr);
        }
    },

    /**
     * 7.1.0 开始 仅ios支持
     * h5页面信息传给app
     * jsonObj = {
        "param": {
        "tagname": "webview",
        "webview":{
        "height": "110(webview高度)"
        }
        },
        "CBPluginName": "_tc_web_util",
        "CBTagName": "set_webview_info"
        }
     */
    set_webview_info: function (jsonObj) {
        if(window._tc_bridge_public.isAppVersionGreatThan(710)){
            var jsonStr = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "set_webview_info", jsonStr);
            } else if (window._tc_bridge_public.platform == 1) {
                return null;
            }
        } else {
            return null;
        }
    },

    /**
     * 7.2.0 开始
     * h5页面信息传给app
     * jsonObj = {
			"param":{
				"tagname":"dialog",
				"desc":"这是描述内容",
				"btnList":[{"showText":"取消","tagname":"tag_click_left_btn"},
					{"showText":"确定","tagname":"tag_click_right_btn"}]
			},
			"CBPluginName": "_tc_web_util",
			"CBTagName": "show_tips_dialog"
		}
     */
    show_tips_dialog : function(jsonObj){
        if(window._tc_bridge_public.isAppVersionGreatThan(720)){
            var jsonStr = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "show_tips_dialog", jsonStr);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_util.show_tips_dialog(jsonStr);
            }
        } else {
            return null;
        }
    },

    /**
     * 7.2.0 开始
     * 获取网络类型
     * jsonObj = {
        "param":{
        "tagname":"network_type"
        },
        "CBPluginName": "_tc_web_util",
        "CBTagName": "get_network_type"
        }
     */
    get_network_type :function(jsonObj){
        if(window._tc_bridge_public.isAppVersionGreatThan(720)){
            var jsonStr = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "get_network_type", jsonStr);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_util.get_network_type(jsonStr);
            }
        } else {
            return null;
        }
    },

    /**
     * 7.2.0 开始
     * 设置提醒信息
     * jsonObj = {
        "param":{
        "tagname":"alarm_status",
        "alarmInfo":{
        "alarmTitle":"通知测试",
        "alarmContent":"通知内容",
        "alarmStartTime":"时间格式：2015-02-12 16:40:27",
        "alarmUrl":"http://10.1.200.193:8081/wrntest/jsp/first.html"
        }
        },
        "CBPluginName": "_tc_web_util",
        "CBTagName": "set_alarm_info"
        }
     */
    set_alarm_info : function(jsonObj){
        if(window._tc_bridge_public.isAppVersionGreatThan(720)){
            var jsonStr = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "set_alarm_info", jsonStr);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_util.set_alarm_info(jsonStr);
            }
        } else {
            return null;
        }
    },

    /**
     * 7.2.0 开始
     * 获取提醒信息
     * jsonObj = {
        "param":{
        "tagname":"alarm_status",
        "alarmInfo":{
        "alarmUrl":"http://10.1.200.193:8081/wrntest/jsp/first.html"
        }
        },
        "CBPluginName": "_tc_ntv_util",
        "CBTagName": "get_alarm_info"
        }
     */
    get_alarm_info : function(jsonObj){
        if(window._tc_bridge_public.isAppVersionGreatThan(720)){
            var jsonStr = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "get_alarm_info", jsonStr);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_util.get_alarm_info(jsonStr);
            }
        } else {
            return null;
        }
    },

    /**
     * 7.2.0 开始
     * 取消提醒信息
     * jsonObj = {
        "param":{
        "tagname":"alarm_status",
        "alarmInfo":{
        "alarmUrl":"http://10.1.200.193:8081/wrntest/jsp/first.html"
        }
        },
        "CBPluginName": "_tc_web_util",
        "CBTagName": "cancel_alarm_info"
        }
     */
    cancel_alarm_info : function(jsonObj){
        if(window._tc_bridge_public.isAppVersionGreatThan(720)){
            var jsonStr = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "cancel_alarm_info", jsonStr);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_util.cancel_alarm_info(jsonStr);
            }
        } else {
            return null;
        }
    },

    /*
     * 7.1.0 开始支持
     * 设置跟踪tag信息,跳转链接,设置tag信息
     * 需要有returnUrl
     *jsonObj:{
     "param": {
     "tagname": "set_tag",
     "trackTag": "跟踪的tag (现在就支持这个)",
     "trackLevel": "跟踪的等级",
     "type":"1 返回url|2 打开url",
     "jumpUrl": "跳转的规则链接,可以是内部链接|也可以是外部链接"
     },
     "CBPluginName": "_tc_web_util",
     "CBTagName": "set_tag_jump"
     }
     */
    set_tag_jump : function(jsonObj){
        var tagUrl = "http://shouji.17u.cn/internal_" + jsonObj.param.trackTag + "/settag/settag";
        document.getElementById("returnUrl").href = tagUrl;
        window._tc_bridge_util.dispatch(document.getElementById("returnUrl"), "click");
    },

    /*
     * 7.3.0 开始支持
     * 显示提示信息
     *jsonObj={
     "param":{
     "tagname":"toast",
     "showInfo":"aaa",
     "showTime":"1000"
     },
     "CBPluginName": "_tc_web_util",
     "CBTagName": "show_toast"
     }
     */
    show_toast : function(jsonObj){
        if(window._tc_bridge_public.isAppVersionGreatThan(730)){
            var jsonStr = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_util", "show_toast", jsonStr);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_util.show_toast(jsonStr);
            }
        } else {
            return null;
        }
    }
};

window._tc_bridge_map = {
    /**
     * 7.1.0 开始支持
     * 获取定位信息
     * {
        "param" : {
            "showType" : "1 对话框是否展示(默认：1显示;2不显示)",
            "cacheType" : "2 默认1 使用已定位数据；2 不使用缓存;3 返回当前的地址信息(无论有无都返回)",
            "tagname" : "locate"
        },
        "CBPluginName" : "_tc_web_map",
        "CBTagName" : "app_locate"
    }
     **/
    app_location: function(jsonObj){
        var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
        if (window._tc_bridge_public.platform == 0) {
            return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_map", "app_locate", strParam);
        } else if (window._tc_bridge_public.platform == 1){
            return window._tc_ntv_map.app_locate(strParam);
        }
    },

    /**
     * 7.2.0 开始支持
     * 显示地图信息
     * @param jsonObj
     * {
        "param":{
        "tagname":"show_location",
        "mapType":"默认 1 国内周边|2 国外周边|3 电影票",
        "centerLocation":{"lon":"","lat":"","cityId":"","address":""}
        },
        "CBPluginName": "_tc_web_map",
        "CBTagName": "show_location"
     }
     * @returns {*}
     */
    show_location : function(jsonObj) {
        if(window._tc_bridge_public.isAppVersionGreatThan(720)) {
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_map", "show_location", strParam);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_map.show_location(strParam);
            }
        } else {
            return null;
        }
    },

    /**
     * 7.3.0 开始支持
     * 打开 导航 页面
     * @param jsonObj
     * jsonObj ={
        "param":{
            "tagname":"navigation_map",
            "centerLocation":{"lon":"120.85443689","lat":"31.12027377","showName":"周庄","googleLat":"31.113928684516","googleLon":"120.848002924416" }
        },
        "CBPluginName": "_tc_web_map",
        "CBTagName": "open_navigation_map"
    }
     * @returns {*}
     */
    open_navigation_map : function(jsonObj) {
        if(window._tc_bridge_public.isAppVersionGreatThan(730)) {
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_map", "open_navigation_map", strParam);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_map.open_navigation_map(strParam);
            }
        } else {
            return null;
        }
    },

    /**
     * 7.3.0 开始支持
     * 选择 城市 页面
     *
     * @returns {*}
     */
    select_city : function(jsonObj) {
        if(window._tc_bridge_public.isAppVersionGreatThan(730)) {
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_map", "select_city", strParam);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_map.select_city(strParam);
            }
        } else {
            return null;
        }
    }
};

window._tc_bridge_user = {
    /**
     * 7.2.0 开始支持 将get_member_info方法合并
     * 调用登录页面
     * {
			"param": {
				"tagname":"logininfo"
			},
			"CBPluginName": "_tc_web_user",
			"CBTagName": "user_login"
		}
     **/
    user_login: function(jsonObj){
        if(window._tc_bridge_public.isAppVersionGreatThan(720)){
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_user", "user_login", strParam);
            } else if (window._tc_bridge_public.platform == 1){
                return window._tc_ntv_user.user_login(strParam);
            }
        } else {
            return null;
            /*document.getElementById("returnUrl").href = "http://shouji.17u.cn/internal/login/";
            window._tc_bridge_util.dispatch(document.getElementById("returnUrl"), "click");*/
        }
    },

    /**
     * 7.2.0 开始支持
     * 获取设备信息
     * {
			"param": {
				"tagname":"device_info"
			},
			"CBPluginName": "_tc_web_user",
			"CBTagName": "get_device_info"
		};
     */
    get_device_info: function(jsonObj){
        if (window._tc_bridge_public.isAppVersionGreatThan(720)){
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_user", "get_device_info", strParam);
            } else if (window._tc_bridge_public.platform == 1){
                return window._tc_ntv_user.get_device_info(strParam);
            }
        }
        else {
            /*window._tc_bridge_public.memberInfoCBObj = jsonObj;
            if(window._tc_bridge_public.isGetClientInfo == true){
                window.setTimeout(function () {
                    window._tc_bridge_util.clientInfoCB(null);
                }, 1);
            } else {
                window._tc_bridge_util.getClientInfo();
            }*/
            return null;
        }
    },

    /**
     * 7.3.0 开始支持
     * 获取联系人信息
     * jsonObj={
        "param":{
        "tagname":"contacts"
        },
     "CBPluginName": "_tc_web_user",
     "CBTagName": "get_contacts"
     };
     */
    get_contacts : function(jsonObj){
        if (window._tc_bridge_public.isAppVersionGreatThan(730)){
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_user", "get_contacts", strParam);
            } else if (window._tc_bridge_public.platform == 1){
                return window._tc_ntv_user.get_contacts(strParam);
            }
        } else {
            return null;
        }
    },

    /**
     * 7.3.0 开始支持
     * 获取联系人信息
     * jsonObj={
        "param":{
            "tagname":"address",
            "addressInfo":{}
        },
        "CBPluginName": "_tc_web_user",
        "CBTagName": "get_mailing_address"
     };
     */
    get_mailing_address : function(jsonObj){
        if (window._tc_bridge_public.isAppVersionGreatThan(730)){
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_user", "get_mailing_address", strParam);
            } else if (window._tc_bridge_public.platform == 1){
                return window._tc_ntv_user.get_mailing_address(strParam);
            }
        } else {
            return null;
        }
    },

    /**
     * 7.3.0 开始支持
     * 注销登录会员 用于修改手机号
     * {
        "param":{
        "tagname":"logout"
        },
        "CBPluginName": "_tc_web_user",
        "CBTagName": "user_logout"
        }
     **/
    user_logout: function(jsonObj){
        if(window._tc_bridge_public.isAppVersionGreatThan(730)){
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_user", "user_logout", strParam);
            } else if (window._tc_bridge_public.platform == 1){
                return window._tc_ntv_user.user_logout(strParam);
            }
        } else {
            return null;
        }
    }
};

window._tc_bridge_web = {
    /**
     * 7.2.0 开始支持
     * 新页打开 ,可设置回调标志
     * jsonObj = {
			"param": {
				"tagname": "tagback",
				"openParams": "newWindow,hideTitle,hideBottom",
				"jumpUrl": "打开的链接"
			},
			"CBPluginName": "_tc_web_util",
			"CBTagName": "open_newurl"
		}
     **/
    open_newurl: function (jsonObj) {
        if (window._tc_bridge_public.isAppVersionGreatThan(720)) {
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_web", "open_newurl", strParam);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_web.open_newurl(strParam);
            }
        } else {
            return null;
        }
    },

    /**
     * 7.2.0 开始支持
     * 页面数据回调前一页面
     * {
			"param":{
				"tagname":"callback",
				"event":"close（默认）",
				"result":"[字符串]"
			},
			"CBPluginName": "_tc_web_util",
			"CBTagName": "data_callback"
		}
     **/
    data_callback: function (jsonObj) {
        if (window._tc_bridge_public.isAppVersionGreatThan(720)) {
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_web", "data_callback", strParam);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_web.data_callback(strParam);
            }
        } else {
            return null;
        }
    }
};

window._tc_bridge_datetime = {
    /**
     * 730开始支持
     * 选择时间
     * jsonObj ={
        "param":{
            "tagname":"datetime",
            "dateTimeInfo":{
                "startTime":"时间格式：2015-02-12 16:40",
                "endTime":"时间格式：2015-02-12 16:40",
                "selectTime":"时间格式：2015-02-12 16:40",
                "timeInterval":"1,10,60-oneMins|tenMins|oneHour(间隔时间)",
                "title":"android标题",
                "tips":"ios提示内容"
            }
        },
        "CBPluginName": "_tc_web_util",
        "CBTagName": "pick_datetime"
    };
     */
    pick_datetime : function (jsonObj){
        if (window._tc_bridge_public.isAppVersionGreatThan(730)) {
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_datetime", "pick_datetime", strParam);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_datetime.pick_datetime(strParam);
            }
        } else {
            return null;
        }
    },

    /**
     * 730开始支持
     * 选择日期
     * jsonObj ={
        "param":{
            "tagname":"date",
            "dateTimeInfo":{
                "startTime":"时间格式：2015-02-12 16:40",
                "endTime":"时间格式：2015-02-12 16:40",
                "selectTime":"时间格式：2015-02-12 16:40",
                "title":"android标题",
                "tips":"ios提示内容"
            }
        },
        "CBPluginName": "_tc_web_util",
        "CBTagName": "pick_date"
    };
     */
    pick_date : function (jsonObj){
        if (window._tc_bridge_public.isAppVersionGreatThan(730)) {
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_datetime", "pick_date", strParam);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_datetime.pick_date(strParam);
            }
        } else {
            return null;
        }
    }
};
window._tc_bridge_sale = {
    /**
     * 730开始支持
     * 获取红包信息
     * jsonObj = {
        "param":{
            "tagname":"redpackage",
            "resourceId":"资源id",
            "projectTag":"项目标志（景区：jingqu 周末游：zhoumoyou 出境：dujia 邮轮：youlun 项目订单填写页获取可用红包使用）"
        },
        "CBPluginName": "_tc_web_redpackage",
        "CBTagName": "cb_get_redpackage"
    };
     */
    get_redpackage: function (jsonObj) {
        if (window._tc_bridge_public.isAppVersionGreatThan(730)) {
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_sale", "get_redpackage", strParam);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_sale.get_redpackage(strParam);
            }
        } else {
            return null;
        }
    },

    /**
     * 730开始支持
     * 选择红包
     * jsonObj = {
        "param":{
            "tagname":"redpackage",
            "resourceId":"资源id",
            "projectTag":"项目标志（景区：jingqu 周末游：zhoumoyou 出境：dujia 邮轮：youlun 项目订单填写页获取可用红包使用）"

        },
        "CBPluginName": "_tc_web_redpackage",
        "CBTagName": "cb_select_redpackage"
    };
     */
    select_redpackage: function (jsonObj) {
        if (window._tc_bridge_public.isAppVersionGreatThan(730)) {
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_sale", "select_redpackage", strParam);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_sale.select_redpackage(strParam);
            }
        } else {
            return null;
        }
    },

    /**
     * 730开始支持
     * 通过 价格获取可使用红包信息
     * jsonObj = {
        "param":{
            "tagname":"redpackage",
            "resourceId":"资源id",
            "projectTag":"项目标志（景区：jingqu 周末游：zhoumoyou 出境：dujia 邮轮：youlun 项目订单填写页获取可用红包使用）",
            "price":"123"
        },
        "CBPluginName": "_tc_web_redpackage",
        "CBTagName": "cb_redpackage_change"
    };
     projectTag:景区：jingqu 周末游：zhoumoyou 出境：dujia 邮轮：youlun 国内游：guoneiyou 国内机票：guoneijipiao 国际机票：guojijipiao
     电影票：dianying 火车票：huoche 项目订单填写页获取可用红包使用
     */
    get_redpackage_with_price : function (jsonObj) {
        if (window._tc_bridge_public.isAppVersionGreatThan(730)) {
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_sale", "get_redpackage_with_price", strParam);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_sale.get_redpackage_with_price(strParam);
            }
        } else {
            return null;
        }
    }
};

window._tc_bridge_pay = {
    /**
     * 730开始支持
     * 用车 信用卡 担保
     * jsonObj = {
        "param":{
            "tagname":"creditcard",
            "payOrderInfo":{
                "orderId":"12345566",
                "orderSerialId":"sss12345566",
                "contactName":"abc",
                "contactNumber":"18352418950",
                "showPrice":"555"
            }
        },
        "CBPluginName": "_tc_web_pay",
        "CBTagName": "pay_creditcard"
    };
     */
    pay_creditcard : function (jsonObj) {
        if (window._tc_bridge_public.isAppVersionGreatThan(730)) {
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_pay", "pay_creditcard", strParam);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_pay.pay_creditcard(strParam);
            }
        } else {
            return null;
        }
    },

    /**
     * 730开始支持
     * 用车 支付宝支付
     * jsonObj = {
        "param":{
            "tagname":"alipay",
            "payOrderInfo":{
                "payContent":"调用支付宝支付的信息"
            }
        },
        "CBPluginName": "_tc_web_pay",
        "CBTagName": "pay_alipay"
     };
     */
    pay_alipay : function (jsonObj) {
        if (window._tc_bridge_public.isAppVersionGreatThan(730)) {
            var strParam = window._tc_bridge_public.stringifyAndEncode(jsonObj);
            if (window._tc_bridge_public.platform == 0) {
                return window._tc_bridge_util.getEasyJsUrl("_tc_ntv_pay", "pay_alipay", strParam);
            } else if (window._tc_bridge_public.platform == 1) {
                return window._tc_ntv_pay.pay_alipay(strParam);
            }
        } else {
            return null;
        }
    }
};
