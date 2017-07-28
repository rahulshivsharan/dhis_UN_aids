(function(){
	'use strict'

	angular.module("DureDHIS").controller("mapDataElementsController",mapDataElementsController);

	mapDataElementsController.$inject = ["$scope","dhisService","_"];

	function mapDataElementsController($scope,dhisService,_){
		var vm = this;

		console.log("'mapDataElementsController' is initialised..");
		
		// public methods
		vm.init = init;
		vm.dataElementIdMap = undefined; // array values to be populated in select-box-1
		vm.orgUnitMap = undefined; // array values to be populated in select-box-1
		vm.categoryOptionComboMap = undefined; // array values to be populated in select-box-1
		vm.attributeOptionComboMap = undefined;		 // array values to be populated in select-box-1
		vm.data_element_list = undefined; // array values to be populated in select-box-2
		
		// for data Elements
		vm.selectedDataElementId = ""; // value selected by select-box 1
		vm.mapValueSelectedDataElementId = ""; // value selected by select-box 2
		
		// for organisation Unit
		vm.selectedOrgUnitId = ""; // value selected by select-box 1
		vm.mapValueSelectedOrgUnitId = ""; // value selected by select-box 2

		vm.selectedCategoryOptionId = ""; // value selected by select-box 1
		vm.mapValueSelectedCategoryOptionId = ""; // value selected by select-box 2

		vm.selectedAttrOptionId = ""; // value selected by select-box 1
		vm.mapValueSelectedAttrOptionId = ""; // value selected by select-box 2

		
		// private variables 
		var dataElementList = undefined; // dataElements list we got from uploaded csv document	
		

		// private methods		
		var groupByDataElementId = groupByDataElementId;
		var groupByOrgUnit = groupByOrgUnit;
		var groupByCategoryOptionCombo = groupByCategoryOptionCombo;
		var groupByAttributeOptionCombo = groupByAttributeOptionCombo;  

		function init(){
			var dataElementObject = dhisService.getDataElementObject();
			dataElementList = dataElementObject["dataElements"];
			
			groupByDataElementId();
			groupByOrgUnit();
			groupByAttributeOptionCombo();
			groupByCategoryOptionCombo();

			dhisService.getDataElements().then(function(response){ // error
				vm.data_element_list = response["dataElements"];
				console.log(vm.data_element_list);
			},function(response){ // error
				console.log(response);
			});			

		} // end of init

		function groupByDataElementId(){
			var dataElementIdMap = _.groupBy(dataElementList,"dataelement");
			vm.dataElementIdMap = [];
			
			for(var prop in dataElementIdMap){
				if(angular.isDefined(prop) && prop !== "" && prop !== "undefined"){
					vm.dataElementIdMap.push(prop);	
				}				
			}
		} // end of groupByDataElementId

		function groupByOrgUnit(){
			var orgUnitMap = _.groupBy(dataElementList,"orgunit");
			vm.orgUnitMap = [];
			for(var prop in orgUnitMap){
				if(angular.isDefined(prop) && prop !== "" && prop !== "undefined"){
					vm.orgUnitMap.push(prop);	
				}				
			}
		} // end of groupByOrgUnit

		function groupByCategoryOptionCombo(){
			var categoryOptionComboMap = _.groupBy(dataElementList,"categoryoptioncombo");

			vm.categoryOptionComboMap = [];
			
			for(var prop in categoryOptionComboMap){
				if(angular.isDefined(prop) && prop !== "" && prop !== "undefined"){
					vm.categoryOptionComboMap.push(prop);	
				}				
			}
		} // end of groupByCategoryOptionCombo

		function groupByAttributeOptionCombo(){
			var attributeOptionComboMap = _.groupBy(dataElementList,"attributeoptioncombo");

			vm.attributeOptionComboMap = [];
			
			for(var prop in attributeOptionComboMap){
				if(angular.isDefined(prop) && prop !== "" && prop !== "undefined"){
					vm.attributeOptionComboMap.push(prop);	
				}				
			} 
		} // groupByAttributeOptionCombo
		
	}// end of 'mapDataElementsController'
})();