(function() {
    'use strict';

    angular
        .module('DureDHIS')
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
                url: '/home',
                templateUrl: "app/main/home.html",
                controller: 'homeController',
                controllerAs: 'vm'
        }).state('importMetadata', {
                url: '/importMetadata',
                templateUrl: 'app/main/createMetadata.html',
                controller: 'createMetadataCtrl',
                controllerAs: 'vm'
        }).state("dataelement",{
                abstract : true,
                url : "/dataelement",
                template : "<ui-view>",
                controller : "dataElementsController",
                controllerAs : "vm"
        }).state('dataelement.uploadDataElements', {
                url: '/uploadDataElements',
                templateUrl: 'app/main/dataElementsMapping.html',                
                parent : "dataelement"
        }).state('dataelement.mapDataElements', {
                url: '/mapDataElements',
                templateUrl: 'app/main/mapDataElements.html',                
                parent : "dataelement"
        }).state('dataelement.mapOrgUnits', {
                url: '/mapOrgUnits',
                templateUrl: 'app/main/mapOrgUnits.html',                
                parent : "dataelement"
        }).state('dataelement.confirmMappedValues', {
                url: '/confirmMappedValues',
                templateUrl: 'app/main/confirmMappedValues.html',                
                parent : "dataelement"
        }).state('indicators', {
                url: '/indicators',
                templateUrl: 'app/main/indicatorsMapping.html',
                controller: 'indicatorsController',
                controllerAs: 'vm'
        });

        $urlRouterProvider.otherwise('/home');
    }

})();
