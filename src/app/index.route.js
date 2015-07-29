(function() {
    'use strict';

    angular
        .module('threebund')
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            }).state('settings', {
                url: '/settings',
                templateUrl: 'app/settings/start.html',
                controller: 'SettingsController',
                controllerAs: 'SettingsController'
            });

        $urlRouterProvider.otherwise('/');
    }

})();
