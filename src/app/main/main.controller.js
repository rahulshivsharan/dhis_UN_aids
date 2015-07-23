  angular
    .module('threebund')
    .controller('MainController', ['$scope' , 'dhis', function($scope, dhis) {
      var setTitle = function(title) {
        $scope.title = title;
      };
      dhis.getApplicationTitle().then(setTitle);
    }]);
