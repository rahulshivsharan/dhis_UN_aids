(function(){
	'use strict'

	angular.module("DureDHIS").controller("mapDataElementsController",mapDataElementsController);

	mapDataElementsController.$inject = ["$scope","dhisService","_"];

	function mapDataElementsController($scope,dhisService,_){
		var vm = this;

		console.log("'mapDataElementsController' is initialised..");
		
		// public methods
		vm.init = init;
		vm.dataElementIdMap = undefined;
		vm.orgUnitMap = undefined;
		vm.categoryOptionComboMap = undefined;
		vm.attributeActionComboMap = undefined;
		vm.selectedDataElementId = "";
		
		// private variables 
		var dataElementList = undefined;	
		

		// private methods		
		var groupByDataElementId = groupByDataElementId;
		var groupByOrgUnit = groupByOrgUnit;
		var groupByCategoryOptionCombo = groupByCategoryOptionCombo;
		var groupByAttributeActionCombo = groupByAttributeActionCombo;  

		function init(){
			var dataElementObject = dhisService.getDataElementObject();
			dataElementList = dataElementObject["dataElements"];
			
			groupByDataElementId();
			groupByOrgUnit();
			groupByAttributeActionCombo();
			groupByCategoryOptionCombo();

			console.log("dataElement ",vm.dataElementIdMap);
			console.log("orgUnit ",vm.orgUnitMap);
			console.log("categoryOptionCombo ",vm.categoryOptionComboMap);
			console.log("attributeActionCombo ",vm.attributeActionComboMap);
		} // end of init

		function groupByDataElementId(){
			vm.dataElementIdMap = _.groupBy(dataElementList,"dataelement");
		}

		function groupByOrgUnit(){
			vm.orgUnitMap = _.groupBy(dataElementList,"orgunit");
		}

		function groupByCategoryOptionCombo(){
			vm.categoryOptionComboMap = _.groupBy(dataElementList,"categoryoptioncombo");
		}

		function groupByAttributeActionCombo(){
			vm.attributeActionComboMap = _.groupBy(dataElementList,"attributeoptioncombo"); 
		}
	}// end of 'mapDataElementsController'
})();