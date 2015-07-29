(function() {
    'use strict';

    angular
        .module('threebund')
        .run(runBlock).factory('authInterceptor', intercept).config(function($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        });

    function runBlock($log) {
        $log.debug('runBlock end');
    }

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
