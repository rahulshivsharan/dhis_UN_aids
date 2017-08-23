(function(){
	'use strict';
	angular.module('DureDHIS').controller("indicatorsController",indicatorsController);

	indicatorsController.$index = ["$scope","dhisService","$q"]

	function indicatorsController($scope,dhisService,$q){
		var vm = this;	

		// public methods
		vm.init = init;
		vm.fetchIndicator = fetchIndicator;		
		vm.onDataElementSelect = onDataElementSelect;

		// public variables
		vm.indicatorList = undefined;
		vm.selectedIndicatorId = "";
		vm.selectedIndicatorObj = undefined;
		vm.isLoaded = false;
		vm.selectedIndicatorName = undefined;
		vm.dataElementOperandList = [];
		vm.selectedDataElementOperand = {
			"label" : "",
			"id" : ""
		}

		// private methods
		var fetchAllIndicators = fetchAllIndicators;
		var fetchDataElementOperands = fetchDataElementOperands;

		function init(){
			fetchAllIndicators();
			fetchDataElementOperands();
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
			vm.isLoaded = false;
			var success = success, error = error;
			
			//console.log(vm.selectedIndicatorId);

			var promise = dhisService.getAnIndicator(vm.selectedIndicatorId).then(success,error);

			// fetch dataelement for selected indicator's numerator value
			var dataElementPromise = promise.then(function(){
				var parameter = "filter=id:eq:" + vm.selectedIndicatorObj["numerator"];
				var promiseObj = dhisService.getDataElements(parameter);
				return promiseObj;
			});

			function success(response){
				
				//console.log(response);
				vm.selectedIndicatorObj = response;			
				
				var numerator = vm.selectedIndicatorObj["numerator"].replace(/[{}#]/g,"");					
				vm.selectedIndicatorObj["numerator"] = numerator;
				
			} // end of success

			function error(response){
				console.log(response);
			} // end of error

			// resolving promise for getting selected numerator's dataElement object
			dataElementPromise.then(function(response){ // success
				//console.log(response);
				var dataElementList = response["dataElements"];
				if(angular.isArray(dataElementList) && dataElementList.length > 0){
					vm.selectedIndicatorName = dataElementList[0]["displayName"];	
				}else{
					vm.selectedIndicatorName = "";
				}
				
				vm.isLoaded = true;
			},function(response){ // error
				console.log(response);
			});
		} // end of fetchIndicator

		// fetch all dataelement operand
		function fetchDataElementOperands(){
			var success = success, error = error;
			dhisService.getDataElementOperands().then(success,error);
			
			function success(response){
				//console.log(response);
				vm.dataElementOperandList = response["dataElementOperands"];
			}

			function error(response){
				console.log(response);
			}
		} // end of fetchDataElementOperands

		function onDataElementSelect($item, $model, $label, $event){
			vm.selectedDataElementOperand.id = $item["id"];	
			vm.selectedIndicatorObj["numerator"] = "#{" + $item["id"] + "}";
			//console.log(vm.selectedIndicatorObj);		
		}
	} // end of indicatorsController
})();