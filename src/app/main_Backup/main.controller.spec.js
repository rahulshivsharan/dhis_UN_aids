(function() {
    'use strict';
    describe('MainController', function() {
        beforeEach(module('threebund'));
        var mockDhis, $scope, controller, configDeferred, stateDeferred, dhisUrlDeferred;
        beforeEach(inject(function($controller, $rootScope, $q) {
            $scope = $rootScope.$new();
            mockDhis = jasmine.createSpyObj('dhis', ['getApplicationTitle', 'getConfig', 'dhisUrl', 'setState', 'getState']);
            configDeferred = $q.defer();
            stateDeferred = $q.defer();
            dhisUrlDeferred = $q.defer();
            mockDhis.getState.and.returnValue(stateDeferred.promise);
            mockDhis.dhisUrl.and.returnValue(dhisUrlDeferred.promise);
            mockDhis.getConfig.and.returnValue(configDeferred.promise);
            controller = $controller('MainController', {
                $scope: $scope,
                dhis: mockDhis
            });
        }));

        it('sets up the strategy', function() {
            configDeferred.resolve({
                'strategy': 'WORK'
            });
            $scope.$apply();
            expect($scope.strategy).toBe('WORK');
        });
    });
})();
