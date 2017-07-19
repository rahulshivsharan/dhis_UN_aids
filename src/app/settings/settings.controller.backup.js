(function() {
    'use strict';
    angular.module('threebund').controller('SettingsController', ['$scope', 'dhis',
        function($scope, dhis) {
            $scope.strategies = [{
                value: 'NEW',
                text: 'New Only'
            }, {
                value: 'NEW_AND_UPDATES',
                text: 'New and Updates'
            }, {
                value: 'UPDATES',
                text: 'Updates Only'
            }];
            $scope.loading = true;
            dhis.getConfig().then(function(config) {
                $scope.loading = false;
                $scope.config = config;
            });

            $scope.save = function(config) {
                $scope.loading = true;
                dhis.updateConfig(config).then(function() {
                    $scope.loading = false;
                });
            };

            $scope.resetState = function() {
                $scope.loading = true;
                dhis.putState({}).then(function() {
                    $scope.loading = false;
                });
            };

            $scope.resetConfig = function() {
                $scope.loading = true;
                dhis.resetSettings().then(function() {
                    dhis.getConfig().then(function(config) {
                        $scope.loading = false;
                        $scope.config = config;
                    });
                });
            };

        }
    ]);
})();
