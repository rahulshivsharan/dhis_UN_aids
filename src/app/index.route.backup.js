(function() {
    'use strict';

    angular
        .module('threebund')
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('setup', {
                url: '/setup',
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            }).state('settings', {
                url: '/settings',
                templateUrl: 'app/settings/start.html',
                controller: 'SettingsController',
                controllerAs: 'SettingsController'
            }).state('home', {
                url: '/',
                templateUrl: 'app/main/home.html',
                controller: 'HomeController',
                controllerAs: 'home'
            });

        $urlRouterProvider.otherwise('/');
    }

})();
