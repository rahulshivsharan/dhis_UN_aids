(function(){
	'use strict'

	angular.module("DureDHIS").controller("mapDataElementsController",mapDataElementsController);

	mapDataElementsController.$inject = ["$scope","dhisService","_"];

	function mapDataElementsController($scope,dhisService,_){
		var vm = this;

		console.log("'mapDataElementsController' is initialised..");
		
		// public variables
		vm.dataElementsMap = undefined;

		// public methods
		vm.init = init;
		

		function init(){
			vm.dataElementsMap = dhisService.getDataElementObject();			
		}

	}// end of 'mapDataElementsController'
})();