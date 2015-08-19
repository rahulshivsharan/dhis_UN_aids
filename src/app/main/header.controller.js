(function() {
    'use strict';
    angular.module('threebund').controller('HeaderController', ['$scope', 'dhis',

        function($scope, dhis) {

            var setTitle = function(title) {
                $scope.title = title;
            };

            var setHomeUrl = function(url) {
                $scope.homeUrl = url;
            };

            dhis.getApplicationTitle().then(setTitle);

            dhis.dhisUrl('').then(setHomeUrl);

            $scope.goHome = function() {
                window.location = $scope.homeUrl;
            };
        }

    ]);
})();
