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

		// private methods
		var processData = processData;

		function init(){
			//console.log("vm.tableRowData ",vm.tableRowData);	
		}

		function importData(){
			//console.log("Import data");
			var data = processData();
			var success = success, error = error;
			//console.log(data);

			dhisService.importDataElements(data).then(success,error);

			function success(response){
				console.log(response);
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
					dataValueObject["value"] = rowData[6];	
				}
				
				data.dataValues.push(dataValueObject);
			});

			return data;
		} // end of processData
	} // end of mappedValuesController
})();