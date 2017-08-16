(function(){
	'use strict'

	angular.module("DureDHIS").controller("mapDataElementsController",mapDataElementsController);

	mapDataElementsController.$inject = ["$scope","dhisService","_","$q","$state"];

	function mapDataElementsController($scope,dhisService,_,$q,$state){
		var vm = this;

		console.log("'mapDataElementsController' is initialised..");
		
		// public variables
		vm.dataElementsMap = undefined;
		vm.mapDE_COC = undefined; // map of DataElements(DE) and CategoryOptionCombo (COC)
		//vm.tableRowData = undefined;
		vm.isVisible = "gridHidden";

		// this is key value where key is "(DE)Id_(COC)Id" and value is boolean flag
		// this map will be used to disable option while selection 
		vm.mapSelectionFlag = undefined; 

		// stores array of selected "(DE)Id_(COC)Id" as value
		vm.selectedValueList = undefined;

		// public methods
		vm.init = init;
		vm.disableDE_COC_Options = disableDE_COC_Options;
		vm.remapDataElements = remapDataElements;

		// private methods
		var loadCategoryOptionCombos = loadCategoryOptionCombos;
		var createDE_COC_Map = createDE_COC_Map;

		// private variables
		var oldNew_DE_Map = {};

		

		function init(){			
			console.log("in init function");
			vm.dataElementsMap = dhisService.getDataElementObject();
			vm.selectedValueList = [];
			for(var prop in vm.dataElementsMap){
				vm.selectedValueList.push("");
			}

			console.log("loading combos");
			loadCategoryOptionCombos();
			//vm.tableRowData = dhisService.getTableRowData();
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

		// this method creates a key-Value pair where 
		// key is (DE)Id_(COC)Id and value is Label(DE)_Label(COC)
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

		// this method is invoked on change event of selection box
		// present in mapDataElements.html
		function disableDE_COC_Options(idx,oldDataElementId){
			//console.log("Selected Value ",vm.selectedValueList[idx]);
			var selectedValue = vm.selectedValueList[idx], 
				index = 0,
				key = undefined,
				prop = undefined;

			vm.mapSelectionFlag[selectedValue] = true;
			oldNew_DE_Map[oldDataElementId] = selectedValue;

			for(prop in vm.mapSelectionFlag){
				if(!_.contains(vm.selectedValueList,prop)){
					vm.mapSelectionFlag[prop] = false;
				}
			} // end of for
		} // end of disableDE_COC_Options


		function remapDataElements(){
			/*
			angular.forEach(vm.tableRowData,function(rowData,index){
				var oldDEId = rowData[1];
				var new_de_coc_value = oldNew_DE_Map[oldDEId];
				rowData[0] = vm.mapDE_COC[new_de_coc_value];				
			});
			*/
			//vm.isVisible = "gridVisible";
			$state.go("mapOrgUnits");
		} // end of remapData
		
	}// end of 'mapDataElementsController'
})();