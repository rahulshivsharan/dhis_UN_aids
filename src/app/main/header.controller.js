(function() {
    'use strict';
    angular.module('threebund').controller('HeaderController', ['$scope', 'dhis',

        function($scope, dhis) {
            var setTitle = function(title) {
                $scope.title = title;
            };
            dhis.getApplicationTitle().then(setTitle);
        }
    ]);
})();
