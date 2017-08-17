(function(){
	'use strict';

	angular.module("DureDHIS").controller("mapOrgUnitsController",mapOrgUnitsController);

	mapOrgUnitsController.$inject = ["$scope","dhisService","_"];

	function mapOrgUnitsController($scope,dhisService,_){
		console.log("Controller \"mapOrgUnitsController\" initialised ");
		var vm = this;

		// public methods
		vm.init = init;
		vm.loadAnOuLevel = loadAnOuLevel; // fetches a perticular OU Level object 
		vm.mapOuId = mapOuId; // this method is invoked on typeAhead select

		// public variables
		vm.oldOrgUnits = undefined; // organisationUnits to be replaced (key,value)		
		vm.ouLevelList = undefined; // list displayed in OU level select box
		vm.selectedOULevel = "";
		vm.filteredOuList = []; // this list is feed in typeAhead as options		
		vm.mappedOrgUnits = undefined; // old organisationUnits to mapped to new organisationUnits (key,value)

		// private method
		var fetchSelectedOrgUnits = fetchSelectedOrgUnits; // fetch unique list of organisation Units to be replaced
		var fetchOrganisationLevels = fetchOrganisationLevels;
		var fetchOrganisationUnitTree = fetchOrganisationUnitTree;
		var copyOU = copyOU;
		var clearSelectedOU = clearSelectedOU; 

		// private variables
		var mainOrgUnitsObj = undefined; // key-value pair of all OU, where key is ouId and value is OU object
		var completelistOfOU = undefined; // array of all organisationUnits
		var selectedLevelNo = undefined;
		

		function init(){			
			fetchSelectedOrgUnits();			
			fetchOrganisationLevels();
			fetchOrganisationUnitTree();
		}// end of init
		
		// fetch unique list of organisation Units to be replaced
		function fetchSelectedOrgUnits(){
			vm.oldOrgUnits = dhisService.getOU();
			vm.mappedOrgUnits = {};
			
			angular.forEach(vm.oldOrgUnits,function(value,key){
				vm.mappedOrgUnits[key] = {
					"label" : "",
					"value" : ""
				} 	
			});			
		} // end of fetchSelectedOrgUnits

		function fetchOrganisationLevels(){
			var success = success, error = error;
			dhisService.getOrgUnitLevels().then(success,error);

			function success(response){
				vm.ouLevelList = response["organisationUnitLevels"];
				//console.log(response["organisationUnitLevels"]);
			}

			function error(response){
				console.log(response);
			}
		} // fetchSelectedOrgUnits

		function fetchOrganisationUnitTree(){
			var success = success, error = error;
			
			dhisService.getOrgUnitsTree().then(success,error);

			function success(response){
				mainOrgUnitsObj = response["organisationUnits"];
				completelistOfOU = _.values(mainOrgUnitsObj);				
			}

			function error(response){
				console.log(response);
			}
		} // end of fetchOrganisationUnitTree

		


		function loadAnOuLevel(){
			var success = success, error = error;
			
			if(vm.selectedOULevel !== "" && !_.isNull(vm.selectedOULevel)){
				clearSelectedOU(); // clear all selected OrganisationUnits
				dhisService.getAnOrgUnitLevel(vm.selectedOULevel).then(success,error);	
			}
			

			function success(response){
				selectedLevelNo = response["level"];
				var filteredOuList = _.where(completelistOfOU,{ "l" : selectedLevelNo });
				console.log(filteredOuList);
				vm.filteredOuList = filteredOuList;				
			}

			function error(response){
				console.log(response);
			}
		} // end of loadAnOuLevel

		function clearSelectedOU(){
			angular.forEach(vm.mappedOrgUnits,function(value,key){
				value["label"] = "";
				value["value"] = "";
			});
		}

		// this method is invoked on typeAhead select
		function mapOuId($item, $model, $label, $event,key){
			vm.mappedOrgUnits[key]["value"] = $item["id"];			
		}

	} // end of mapOrgUnitsController
})();