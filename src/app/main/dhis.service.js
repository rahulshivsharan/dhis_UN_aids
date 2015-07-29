(function() {
    'use strict';
    angular.module('threebund').service('dhis', ['$http', 'AUTH', '$q', 'serverPath', 'x2js',
        function($http, authHeader, $q, serverPath, x2js) {
            var fileSetting = 'spectrumConfigFiles';
            var stateSetting = 'spectrumImportState';

            var initialConfig = {
                indicatorFile: '/resources/data_elements_v001.xml',
                dataElementFile: '/resources/indicators_v001.xml',
                dashboardFile: '/resources/dashboard_v001.xml',
            };

            var initialState = {
                indicator: false,
                dataElement: false,
                dashboard: false,
            };
            var buildUrl = function(path) {
                return serverPath + path;
            };

            var getSetting = function(key) {
                return $http.get(buildUrl('/api/systemSettings/' + key));
            };

            var putSetting = function(key, value) {
                return $http({
                    method: 'POST',
                    url: buildUrl('/api/systemSettings/' + key),
                    data: value,
                    headers: {
                        "Content-Type": 'text/plain'
                    }
                });

            };

            var getState = function() {
                var settingDeferred = $q.defer();
                var promise = getSetting(stateSetting);
                promise.then(function(response) {
                    if (response.data !== "") {
                        settingDeferred.resolve(response.data);
                    } else {
                        putSetting(stateSetting, initialState);
                        settingDeferred.resolve(initialState);
                    }
                }, function(data, status) {
                    settingDeferred.reject(data, status);
                });
                return settingDeferred.promise;
            };

            var putState = function(value) {
                return putSetting(stateSetting, value);
            };

            var updateState = function(key, value) {
                return getState().then(function(state) {
                    state[key] = value;
                    return putState(state);
                });
            };
            var getConfig = function() {
                var configDeferred = $q.defer();
                var promise = getSetting(fileSetting);
                promise.then(function(response) {
                    if (response.data !== "") {
                        configDeferred.resolve(response.data);
                    } else {
                        putSetting(fileSetting, initialConfig);
                        configDeferred.resolve(initialConfig);
                    }
                }, function(data, status) {
                    configDeferred.reject(data, status);
                });
                return configDeferred.promise;
            };

            var updateConfig = function(value) {
                return putSetting(fileSetting, value);
            };

            var getApplicationTitle = function() {
                var titleDeferred = $q.defer();
                var promise = getSetting('applicationTitle');
                var parseTitle = function(response) {
                    var title = response.data;
                    titleDeferred.resolve(title);
                };
                promise.then(parseTitle, function(data, status) {
                    titleDeferred.reject(data, status);
                });
                return titleDeferred.promise;
            };

            var loadResource = function(path) {
                var resourceDeferred = $q.defer();
                var parseResource = function(response) {
                    resourceDeferred.resolve(response.data);
                };
                $http.get(path).then(parseResource, function(data, status) {
                    resourceDeferred.reject(data, status);
                });
                return resourceDeferred.promise;
            };

            var uploadResource = function(path) {
                var resourceDeferred = $q.defer();
                var parseImportResponse = function(response) {
                    var data = x2js.xml_str2json(response.data);
                    resourceDeferred.resolve(data);
                };
                loadResource(path).then(function(resource) {
                    $http({
                        method: 'POST',
                        url: buildUrl('/api/metaData'),
                        data: resource,
                        headers: {
                            "Content-Type": 'application/xml'
                        }
                    }).then(parseImportResponse, function(data, status) {
                        resourceDeferred.reject(data, status);
                    });
                }, function(data, status) {
                    resourceDeferred.reject(data, status);
                });
                return resourceDeferred.promise;
            };
            return {
                "uploadResource": uploadResource,
                "getApplicationTitle": getApplicationTitle,
                "getSetting": getSetting,
                "putSetting": putSetting,
                "getConfig": getConfig,
                "updateConfig": updateConfig,
                "getState": getState,
                "putState": putState,
                "updateState": updateState
            };
        }
    ]);
})();
