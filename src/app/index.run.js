(function() {
    'use strict';

    angular
        .module('threebund')
    // .factory('authInterceptor', intercept).config(function($httpProvider) {
    //     $httpProvider.interceptors.push('authInterceptor');
    // });

    function intercept($location, $q, $window, AUTH) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                var header = 'Basic ' + AUTH;
                config.headers.Authorization = header;
                return config;
            }
        };
    }

})();
