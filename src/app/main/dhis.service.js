(function () {
  'use strict';
  angular.module('threebund').service('dhis', ['$http', 'AUTH', '$q', 'serverPath',
    function ($http, authHeader, $q, serverPath) {
      var getApplicationTitle = function () {
        var titleDeferred = $q.defer();
        var promise = $http.get(serverPath + '/api/systemSettings.json');
        var parseTitle = function (response) {
          var title = response.data.applicationTitle;
          titleDeferred.resolve(title);
        };
        promise.then(parseTitle);
        return titleDeferred.promise;
      };
      var loadResource = function (path) {
        var resourceDeferred = $q.defer();
        var parseResource = function (response) {
          resourceDeferred.resolve(response.data);
        };
        $http.get(path).then(parseResource);
        return resourceDeferred.promise;
      };
      var uploadResource = function (path) {
        var resourceDeferred = $q.defer();
        var parseImportResponse = function (response) {
          resourceDeferred.resolve(response.data);
        };
        loadResource(path).then(function (resource) {
          $http({
            method: 'POST',
            url: serverPath + '/api/metaData',
            data: resource,
            headers: {
              "Content-Type": 'application/xml'
            }
          }).then(parseImportResponse);
        });
        return resourceDeferred.promise;
      };
      return {
        "uploadResource": uploadResource,
        "getApplicationTitle": getApplicationTitle
      };
    }
  ]);
})();
