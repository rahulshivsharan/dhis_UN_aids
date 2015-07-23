angular
  .module('threebund').service('dhis', ['$http', 'AUTH', '$q',

    function($http, authHeader, $q) {

      this.getApplicationTitle = function() {
        var titleDeferred = $q.defer();
        var promise = $http.get('/api/systemSettings.json');
        var getTitle = function(response) {
          var title = response.data.applicationTitle;
          titleDeferred.resolve(title);
        };
        promise.then(getTitle)
        return titleDeferred.promise;
      };

    }
  ]);
