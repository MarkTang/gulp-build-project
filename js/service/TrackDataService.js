/**
 * Created by xialing on 2014/10/29.
 */
app.factory('TrackDataService', function () {
    function TrackDataService(pParams, eParams,cParams) {
        this.pageParams = {
            "param": {
                /*"pagename": "h5_linelist(命名规则：h5_项目_页面)",
                 "action": "load(默认)|exit|stop|restart",
                 "": "",
                 "": "",*/
            },
            "CBPluginName": (pParams && pParams.pluginName) || '',
            "CBTagName": (pParams && pParams.actionName) || ''
        };
        this.eventParams = {
            "param": {
                /*"eventId": "(事件id)",
                 "type": "（类型）",
                 "tagname": ""*/
            },
            "CBPluginName": (eParams && eParams.pluginName) || '',
            "CBTagName": (eParams && eParams.actionName) || ''
        };
        this.categoryParams = {
            "param": {
                // "category": "事件类别",
                // "action": "用户行为",
                // "optLabel": "记录的值名称",
                // "optValue":"资源id",
                // "pageName":"h5页面名称"
            },
            "CBPluginName": (cParams && cParams.pluginName) || '',
            "CBTagName": (cParams && cParams.actionName) || ''
        };
    }
    TrackDataService.prototype.projectIdDict = {
        '1': 1,//酒店
        '2': 2,//机票
        '3': 3,//景区
        '8': 4,//自助游
        '9': 5,//出境
        '15': 2016,//火车
        '10': 2007,//游轮
        '12': 2012,//国际机票
        '20': 2019,//农家乐
        // '18': 2011,//国内游
        '19': 2020,//一日游
        '21':2022,//电影票
        'jj':4,//景+酒
        '27':3//当地玩乐
    };
    TrackDataService.prototype.submitPageData = function () {
        window._tc_bridge_util.set_page(this.pageParams);
    }
    TrackDataService.prototype.submitEventData = function () {
        window._tc_bridge_util.set_event(this.eventParams);
    }
    TrackDataService.prototype.submitCategoryData = function () {
        window._tc_bridge_util.set_category_event(this.categoryParams);
    }
    return TrackDataService;
});
window._tc_bridge_util.pageParams = {
    "param": {
        /*"pagename": "h5_linelist(命名规则：h5_项目_页面)",
         "action": "load(默认)|exit|stop|restart",
         "": "",
         "": "",*/
    },
    "CBPluginName": "",
    "CBTagName": ""
};
window._tc_bridge_util.eventParams = {
    "param": {
        /*"eventId": "(事件id)",
         "type": "（类型）",
         "tagname": ""*/
    },
    "CBPluginName": "",
    "CBTagName": ""
};
window._tc_bridge_util.submitPageData = function () {
    window._tc_bridge_util.set_page(this.pageParams);
};
window._tc_bridge_util.submitEventData = function () {
    window._tc_bridge_util.set_event(this.eventParams);
};
