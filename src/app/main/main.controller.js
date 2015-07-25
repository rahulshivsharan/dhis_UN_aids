(function () {
  'use strict';
  angular.module('threebund').controller('MainController', ['$scope', 'dhis',
    function ($scope, dhis) {
      var setTitle = function (title) {
        $scope.title = title;
      };
      var tabs = {
        'data-element': {
          'template': 'app/main/data-element.html',
          'resource': 'resources/data_elements_v001.xml'
        },
        'indicator': {
          'template': 'app/main/indicator.html',
          'resource': 'resources/indicators_v001.xml'
        },
        'dashboard': {
          'template': 'app/main/dashboard.html',
          'resource': ''
        }
      };
      dhis.getApplicationTitle().then(setTitle);
      $scope.import = function (path) {
        return dhis.uploadResource(path);
      };
      $scope.loadDataElements = function () {
        var resource = tabs['data-element'].resource;
        $scope.loading = true;
        dhis.uploadResource(resource).then(function () {
          $scope.page = 'indicator';
          $scope.tab = tabs[$scope.page].template;
          $scope.loading = false;
        });
      };
      $scope.loadIndicators = function () {
        var resource = tabs['indicator'].resource;
        $scope.loading = true;
        dhis.uploadResource(resource).then(function () {
          $scope.page = 'dashboard';
          $scope.tab = tabs[$scope.page].template;
          $scope.loading = false;
        });
      };
      $scope.tab = 'app/main/data-element.html';
      $scope.page = 'data-element';
    }
  ]);
})();
