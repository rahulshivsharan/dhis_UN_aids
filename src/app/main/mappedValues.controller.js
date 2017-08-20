(function(){
	'use strict';

	angular.module("DureDHIS").controller("mappedValuesController",mappedValuesController);

	mappedValuesController.$inject = ["$scope","dhisService","_","$state"];

	function mappedValuesController($scope,dhisService,_,$state){
		console.log("Controller 'mappedValuesController' is initialised");

		var vm = this;

		// public methods
		vm.init = init;
		vm.importData = importData;

		// public variables		
		vm.tableHeaders = dhisService.tableHeaders;
		vm.tableRowData = dhisService.getTableRowData();
		vm.mappedOrgUnits = dhisService.getUpdatedOU();
		vm.responseObject = undefined; // to be display in UI once data is imported
		vm.isDataImported = false; // this flag is used to hide and show table data
		vm.isLoading = false; // this flag is used to display loading image

		// private methods
		var processData = processData;

		function init(){
			//console.log("vm.tableRowData ",vm.tableRowData);	
		}

		function importData(){
			vm.isDataImported = false;
			vm.isLoading = true; // show loading image
			//console.log("Import data");
			var data = processData();
			var success = success, error = error;
			//console.log(data);

			dhisService.importDataElements(data).then(success,error);

			function success(response){
				//console.log(response);
				vm.responseObject = {};
				vm.isDataImported = true;
				vm.isLoading = false;
				vm.responseObject["status"] = response["status"];
				vm.responseObject["importCount"] = response["importCount"];
			}

			function error(response){
				console.log(response);
			}
		} // end of importData

		function processData(){
			var data = {
				"dataValues" : []
			};

			angular.forEach(vm.tableRowData,function(rowData,index){
				var dataValueObject = {}, 
					dataElementId = undefined, 
					period = undefined,
					orgUnitLabel = undefined,
					categoryOptionsComboId = undefined,
					value = undefined;

				if(angular.isDefined(rowData[1])){
					dataValueObject["dataElement"] = rowData[1];	
				}
				
				if(angular.isDefined(rowData[2])){
					dataValueObject["period"] = rowData[2];
				}
				
				if(angular.isDefined(rowData[3])){
					orgUnitLabel = rowData[3];
					dataValueObject["orgUnit"] = vm.mappedOrgUnits[orgUnitLabel]["value"];	
				}
				
				if(angular.isDefined(rowData[4])){
					dataValueObject["categoryoptioncombo"] = rowData[4]["value"];
				}
				
				if(angular.isDefined(rowData[6])){
					dataValueObject["value"] = parseInt(rowData[6]);	
				}
				
				data.dataValues.push(dataValueObject);
			});

			return data;
		} // end of processData
	} // end of mappedValuesController
})();