(function() {
    'use strict';

    angular
        .module('DureDHIS')
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
                url: '/',
                templateUrl: "app/main/home.html",
                controller: 'homeController',
                controllerAs: 'vm'
        }).state('importMetadata', {
                url: '/importMetadata',
                templateUrl: 'app/main/createMetadata.html',
                controller: 'createMetadataCtrl',
                controllerAs: 'vm'
        }).state('uploadDataElements', {
                url: '/uploadDataElements',
                templateUrl: 'app/main/dataElementsMapping.html',
                controller: 'dataElementsController',
                controllerAs: 'vm'
        })/*.state('uploadDataElements', {
                url: '/uploadDataElements',
                templateUrl: 'app/main/uploadDataElements.html',
                controller: 'uploadDataElementsController',
                controllerAs: 'vm'
        })*/.state('mapDataElements', {
                url: '/mapDataElements',
                templateUrl: 'app/main/mapDataElements.html',
                controller: 'mapDataElementsController',
                controllerAs: 'vm'
        }).state('mapOrgUnits', {
                url: '/mapOrgUnits',
                templateUrl: 'app/main/mapOrgUnits.html',
                controller: 'mapOrgUnitsController',
                controllerAs: 'vm'
        });

        $urlRouterProvider.otherwise('/');
    }

})();
