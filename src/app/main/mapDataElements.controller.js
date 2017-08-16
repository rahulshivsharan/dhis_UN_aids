(function(){
	'use strict'

	angular.module("DureDHIS").controller("mapDataElementsController",mapDataElementsController);

	mapDataElementsController.$inject = ["$scope","dhisService","_","$q"];

	function mapDataElementsController($scope,dhisService,_,$q){
		var vm = this;

		console.log("'mapDataElementsController' is initialised..");
		
		// public variables
		vm.dataElementsMap = undefined;
		vm.mapDE_COC = undefined; // map of DataElements(DE) and CategoryOptionCombo (COC)

		// this is key value where key is "(DE)Id_(COC)Id" and value is boolean flag
		// this map will be used to disable option while selection 
		vm.mapSelectionFlag = undefined; 

		// stores array of selected "(DE)Id_(COC)Id" as value
		vm.selectedValueList = undefined;

		// public methods
		vm.init = init;
		vm.disableDE_COC_Options = disableDE_COC_Options;

		// private methods
		var loadCategoryOptionCombos = loadCategoryOptionCombos;
		var createDE_COC_Map = createDE_COC_Map;
		

		function init(){			
			vm.dataElementsMap = dhisService.getDataElementObject();
			vm.selectedValueList = [];
			for(var prop in vm.dataElementsMap){
				vm.selectedValueList.push("");
			}
			loadCategoryOptionCombos();
		}

		function loadCategoryOptionCombos(){
			var promiseTwo = dhisService.getCategoryOptionCombos();
			var promiseOne = dhisService.getDataElements();
			var success = success, error = error;

			$q.all([promiseOne,promiseTwo]).then(success,error);

			function success(values){
				
				var dataElementsList = values[0]["dataElements"];
				var categoryOptionComboList = values[1]["categoryOptionCombos"];

				//console.log("dataElementsList ",dataElementsList);
				//console.log("categoryOptionComboList ",categoryOptionComboList);
				createDE_COC_Map(dataElementsList,categoryOptionComboList);

				//console.log("vm.mapDE_COC ",vm.mapDE_COC);
			} // end of success

			function error(values){
				// console.log("error ",values);
			} // end of error

		} // end of loadCategoryOptionCombos

		function createDE_COC_Map(deList,cocList){
			var index1 = 0, index2 = 0, de = undefined, coc = undefined, key = undefined, value = undefined;

			vm.mapDE_COC = {};
			vm.mapSelectionFlag = {};
			
			for(index1 = 0; index1 < deList.length; index1++){
				for(index2 = 0; index2 < cocList.length; index2++){
					de = deList[index1];
					coc = cocList[index2];
					key = de["id"] + "_" + coc["id"];
					value = de["displayName"] + "_" + coc["displayName"];
					vm.mapDE_COC[key] = value;
					vm.mapSelectionFlag[key] = false; 
				}
			} 
		} // end of createDE_COC_Map

		function disableDE_COC_Options(idx){
			console.log("Selected Value ",vm.selectedValueList[idx]);
			var selectedValue = vm.selectedValueList[idx];
			vm.mapSelectionFlag[selectedValue] = true;
		} // end of disableDE_COC_Options
		
	}// end of 'mapDataElementsController'
})();