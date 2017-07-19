(function() {
    'use strict';
    describe('controllers', function() {
        beforeEach(module('threebund'));

        var $scope, titleDeferred, dhisUrlDeferred, controller, mockDhis;

        beforeEach(inject(function($controller, $rootScope, $q) {
            $scope = $rootScope.$new();
            titleDeferred = $q.defer();
            dhisUrlDeferred = $q.defer();

            mockDhis = jasmine.createSpyObj('dhis', ['getApplicationTitle', 'getConfig', 'dhisUrl']);

            mockDhis.getApplicationTitle.and.returnValue(titleDeferred.promise);
            mockDhis.dhisUrl.and.returnValue(dhisUrlDeferred.promise);

            controller = $controller('HeaderController', {
                $scope: $scope,
                dhis: mockDhis
            });
        }));

        it('should set the title', function() {
            titleDeferred.resolve('super title');
            $scope.$apply();
            expect($scope.title).toBe('super title');
        });

        it('should set the homeUrl', function() {
            dhisUrlDeferred.resolve('/dhis');
            $scope.$apply();
            expect($scope.homeUrl).toBe('/dhis');
        });

    });
})();
