(function(){
	'use strict';
	angular.module('DureDHIS').controller("indicatorsController",indicatorsController);

	indicatorsController.$index = ["$scope","dhisService"]

	function indicatorsController($scope,dhisService){
		var vm = this;	

		// public methods
		vm.init = init;
		vm.fetchIndicator = fetchIndicator;

		// public variables
		vm.indicatorList = undefined;
		vm.selectedIndicatorId = "";
		vm.selectedIndicatorObj = undefined;

		// private methods
		var fetchAllIndicators = fetchAllIndicators;


		function init(){
			fetchAllIndicators();
		}// end of init

		function fetchAllIndicators(){
			var success = success, error = error; 
			dhisService.getIndicators().then(success,error);

			function success(response){
				vm.indicatorList = response["indicators"];
			}

			function error(response){
				console.log(response);
			}
		} // end of fetchAllIndicators

		function fetchIndicator(){
			var success = success, error = error;
			//console.log(vm.selectedIndicatorId);
			dhisService.getAnIndicator(vm.selectedIndicatorId).then(success,error);

			function success(response){
				console.log(response);
				vm.selectedIndicatorObj = response;			
				
				var indicator = vm.selectedIndicatorObj["numerator"].replace(/[{}#]/g,"");
				
				vm.selectedIndicatorObj["numerator"] = indicator;	
			}

			function error(response){
				console.log(response);
			}
		} // end of fetchIndicator
	}
})();