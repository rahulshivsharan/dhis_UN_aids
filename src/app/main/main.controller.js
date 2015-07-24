(function () {
  'use strict';
  angular.module('threebund').controller('MainController', ['$scope', 'dhis',
    function ($scope, dhis) {
      var setTitle = function (title) {
        $scope.title = title;
      };
      dhis.getApplicationTitle().then(setTitle);
      $scope.resources = [{
        'path': 'resources/data_elements_v001.xml',
        'name': 'Data Elements'
      }, {
        'path': 'resources/indicators_v001.xml',
        'name': 'Indicators'
      }];
      $scope.import = function (path) {
        var showResult = function (result) {
          $scope.result = result;
        };
        dhis.uploadResource(path).then(showResult);
      };
    }
  ]);
})();
