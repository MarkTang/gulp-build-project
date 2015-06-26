/**
 * Created by sc09395 on 2015/1/23 0023.
 */
app.factory("API", ["APIAddress",function (APIAddress) {
    function API() {
        var online = "http://tcmobileapi.17usoft.com/", //discovery,
            test = "http://61.155.197.172:8008/",
            fake = "http://61.155.197.172:8008/previewAPI/";

        if(APIAddress.on == 0){
            return test;
        }
        if(APIAddress.on == 1){
            return online;
        }
        return fake;
    }
    return API();
}])
