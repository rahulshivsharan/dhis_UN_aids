(function() {
    'use strict';
    angular.module('threebund').controller('MainController', ['$scope', 'dhis',

        function($scope, dhis) {

            var setupTabs = function(config) {
                $scope.tabs = {
                    'dataElement': {
                        'template': 'app/main/data-element.html',
                        'resource': config.dataElementFile,
                        'name': 'Data Elements'
                    },
                    'indicator': {
                        'template': 'app/main/indicator.html',
                        'resource': config.indicatorFile,
                        'name': 'Indicators'
                    },
                    'dashboard': {
                        'template': 'app/main/dashboard.html',
                        'resource': config.dashboardFile,
                        'name': 'Dashboards'
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
                    $scope.tab = $scope.tabs[$scope.page];
                    $scope.template = $scope.tab.template;
                    $scope.loading = false;
                    $scope.hasConflicts = false;
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
            var importWasSuccess = function(importCount) {
                return (importCount._updated + importCount._imported) > 0 && importCount._ignored === 0;
            };

            var showResponse = function(state, name) {
                return function(data) {
                    if (importWasSuccess(data.importSummary.importCount)) {
                        $scope.summaries = [];
                        $scope.summaries.push({
                            name: name,
                            data: data.importSummary.importCount
                        });
                        dhis.updateState(state, true).then(setupState);
                    } else {
                        $scope.conflicts = data.importSummary.typeSummaries.typeSummary.conflicts.conflict;
                        $scope.loading = false;
                        $scope.hasConflicts = true;
                    }
                };
            };

            $scope.loadItem = function() {
                var resource = $scope.tab.resource;
                $scope.loading = true;
                dhis.uploadResource(resource).then(showResponse($scope.page, $scope.tab.name), handleError);
            };
        }
    ]);
})();
