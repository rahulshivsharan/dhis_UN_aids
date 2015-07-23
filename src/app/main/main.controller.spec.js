(function() {
  'use strict';

  describe('controllers', function() {

    beforeEach(module('threebund'));

    it('should set the title', inject(function($controller, $rootScope, $q) {
      var $scope = $rootScope.$new();
      var titleDeferred = $q.defer();
      var mockDhis = jasmine.createSpyObj('dhis', ['getApplicationTitle']);
      mockDhis.getApplicationTitle.and.returnValue(titleDeferred.promise);
      var vm = $controller('MainController', {
        $scope: $scope,
        dhis: mockDhis
      });
      titleDeferred.resolve('super title');
      $scope.$apply();
      expect($scope.title).toBe('super title');
    }));
  });
})();
