  angular
    .module('threebund')
    .controller('MainController', function($scope, dhis) {
      var setTitle = function(title) {
        $scope.title = title;
      };
      dhis.getApplicationTitle().then(setTitle);
    });
