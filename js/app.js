app.run([
    '$rootScope',
    '$state',
    '$location',
    function ($rootScope, $state, $location) {

        $rootScope.netWorkNotOn = false;
        $rootScope.netWorkError = false;
        $rootScope.serverCrash = false; 

        $rootScope.getError = function (header) {
            $rootScope.netWorkNotOn = header.rspType == CODE.NETWORKNOTON;
            $rootScope.netWorkError = header.rspType == CODE.NETWORKERROR;
            $rootScope.serverCrash = header.rspType == CODE.SERVERCRASH;
            return $rootScope.netWorkNotOn || $rootScope.netWorkError || $rootScope.serverCrash;
        }

        $rootScope.tapToReload = function () {
            window.location.reload();
        };
        //===========fastclick&no drag============
        FastClick.attach(document.body);
    }
]);