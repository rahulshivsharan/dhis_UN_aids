(function() {
    'use strict';
    angular.module('threebund').controller('MainController', ['$scope', 'dhis',

        function($scope, dhis) {

            var setupTabs = function(config) {
                $scope.tabs = {
                    'dataElement': {
                        'template': 'app/main/data-element.html',
                        'resource': config.dataElementFile
                    },
                    'indicator': {
                        'template': 'app/main/indicator.html',
                        'resource': config.indicatorFile
                    },
                    'dashboard': {
                        'template': 'app/main/dashboard.html',
                        'resource': config.dashboardFile
                    },
                    'complete': {
                        'template': 'app/main/done.html'
                    }
                };
            };
            $scope.summaries = [];
            $scope.loading = true;
            var setupState = function() {
                dhis.getState().then(function(state) {
                    if (state.dataElement) {
                        if (state.indicator) {
                            if (state.dashboard) {
                                $scope.page = 'complete';
                            } else {
                                $scope.page = 'dashboard';
                            }
                        } else {
                            $scope.page = 'indicator';
                        }
                    } else {
                        $scope.page = 'dataElement';
                    }
                });
            };

            $scope.$watch('page', function(page) {
                if (page) {
                    $scope.tab = $scope.tabs[$scope.page].template;
                    $scope.loading = false;
                }
            }, true);

            dhis.getConfig().then(setupTabs).then(function() {
                setupState();
            });

            var handleError = function(error) {
                $scope.loading = false;
                $scope.hasError = true;
                $scope.error = error.data;
                $scope.statusCode = error.status;
            };
            $scope.import = function(path) {
                return dhis.uploadResource(path);
            };

            $scope.loadDataElements = function() {
                var resource = $scope.tabs.dataElement.resource;
                $scope.loading = true;
                dhis.uploadResource(resource).then(function(data) {
                    $scope.summaries.push({
                        name: 'Data Elements',
                        data: data.importSummary.importCount
                    });
                    dhis.updateState('dataElement', true).then(setupState);

                }, handleError);
            };
            $scope.loadIndicators = function() {
                var resource = $scope.tabs.indicator.resource;
                $scope.loading = true;
                dhis.uploadResource(resource).then(function(data) {
                    $scope.summaries.push({
                        name: 'Indicators',
                        data: data.importSummary.importCount
                    });
                    dhis.updateState('indicator', true).then(setupState);
                }, handleError);
            };

            $scope.loadDashboards = function() {
                var resource = $scope.tabs.dashboard.resource;
                $scope.loading = true;
                dhis.uploadResource(resource).then(function(data) {
                    $scope.summaries.push({
                        name: 'Dashboards',
                        data: data.importSummary.importCount
                    });
                    dhis.updateState('dashboard', true).then(setupState);
                }, handleError);
            };
        }
    ]);
})();
