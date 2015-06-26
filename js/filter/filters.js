/**
 * Created by sc09395 on 2014/10/14 0014.
 */

app.filter("tcNaTag", function () {
    function tagUrl(url, tag) {
        if (!url) return;

        if (url.indexOf("&") > 0) {
            url += "&tcnatag=" + tag;
        }
        else {
            if (url.indexOf("?") > 0) {
                url += "&tcnatag=" + tag;
            } else {
                url += "?tcnatag=" + tag;
            }
        }

        var isNativeUrl = url.indexOf("shouji.17u.cn/internal") != -1;
        if (isNativeUrl){
            return url;
        }
        else{
            url += "&tcwvcnew";
            return encodeURI(url);
        }
    }

    return tagUrl;
})
app.filter("tcNaTagByProjectId", function () {
    function tagUrl(url, tag ,projectId) {
        if (!url) return;
        if(projectId === '3'){
            if (url.indexOf("&") > 0) {
                url += "&tcnatag=" + tag;
            }
            else {
                if (url.indexOf("?") > 0) {
                    url += "&tcnatag=" + tag;
                } else {
                    url += "?tcnatag=" + tag;
                }
            }
        }
        var isNativeUrl = url.indexOf("shouji.17u.cn/internal") != -1;
        if (isNativeUrl){
            return url;
        }
        else{
            url += "&tcwvcnew";
            return encodeURI(url);
        }
    }
    return tagUrl;
})

app.filter("openInWebview", function () {
    function processUrl(url) {
        if (!url) return;
        var isNativeUrl = url.indexOf("shouji.17u.cn/internal") != -1;
        if (isNativeUrl) return url;
        else {
            if (url.indexOf("&") > 0) {
                url += "&tcwvcnew"
            }
            else {
                if (url.indexOf("?") > 0) {
                    url += "&tcwvcnew"
                } else {
                    url += "?tcwvcnew"
                }
            }
            return url;
        }
    }

    return processUrl;
}).filter("tag", function () {
    function processUrl(url, tag) {
        if (!url) return;
        if (url.toLowerCase().indexOf('internal') != -1) {
            if (tag) {

                return encodeURI(url.toLowerCase().replace('internal', 'internal_' + tag));
            }
            return url;
        } else {
            if (url.indexOf("&") > 0) {
                url += "&tcwvcnew"
            }
            else {
                if (url.indexOf("?") > 0) {
                    url += "&tcwvcnew"
                } else {
                    url += "?tcwvcnew"
                }
            }
            return encodeURI(url);
        }
    }

    return processUrl;
}).filter("intParser", function () {
    function intParser(number) {
        return parseInt(number);
    }

    return intParser;
})