(function() {
    'use strict';

    angular
        .module('DureDHIS')
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
                url: '/',
                templateUrl: 'app/main/home.html',
                controller: 'homeController',
                controllerAs: 'vm'
        }).state('importMetadata', {
                url: '/importMetadata',
                templateUrl: 'app/main/createMetadata.html',
                controller: 'createMetadataCtrl',
                controllerAs: 'vm'
        });

        $urlRouterProvider.otherwise('/');
    }

})();
