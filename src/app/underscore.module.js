(function(){
	'use strict'

	angular.module("underscore",[]);

	angular.module("underscore").factory("_",["$window",function($window){
		return $window._;
	}]);

	// reference on how to use 'UnderScore' with 'Angular' as below,
	// https://stackoverflow.com/questions/14968297/use-underscore-inside-angular-controllers
})();