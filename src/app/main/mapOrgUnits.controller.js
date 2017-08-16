(function(){
	'use strict';

	angular.module("DureDHIS").controller("mapOrgUnitsController",mapOrgUnitsController);

	mapOrgUnitsController.$inject = ["$scope","dhisService","_"];

	function mapOrgUnitsController($scope,dhisService,_){
		console.log("Controller \"mapOrgUnitsController\" initialised ");
		var vm = this;

		// public methods
		vm.init = init;

		// public variables
		vm.oldOrgUnits = undefined;

		function init(){
			vm.oldOrgUnits = dhisService.getOU();

		}// end of init
		
	} // end of mapOrgUnitsController
})();