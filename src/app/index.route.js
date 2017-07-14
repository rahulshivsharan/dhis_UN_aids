(function() {
    'use strict';

    angular
        .module('DureDHIS')
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
                url: '/',
                templateUrl: 'app/demoApp/home.html',
                controller: 'homeController',
                controllerAs: 'vm'
            });

        $urlRouterProvider.otherwise('/');
    }

})();
