var app = angular.module("app", [
    "ui.router",
    "ui.bootstrap",
    "ngTouch"
]);
app.config([
    '$stateProvider',
    '$locationProvider',
    "$urlRouterProvider",
    function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/index");
        $stateProvider
            .state('index', {
                url: "/index",
                templateUrl: 'views/index.html',
                controller: 'indexCtrl',
                onEnter: function () {
                },
                onExit: function () {
                }
            })
            
    }])
    .value('APIAddress', {
        /*
        * 0:测试地址,
        * 1:正式地址，
        * 2或其它值:fake地址
        * */
        on:1
    }).value("statusCode", {
        NETWORKNOTON: 77,
        NETWORKERROR: 55,
        SERVERCRASH: 88
    })
