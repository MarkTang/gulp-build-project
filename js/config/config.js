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
