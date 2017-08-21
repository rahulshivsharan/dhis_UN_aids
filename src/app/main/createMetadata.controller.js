(function(){
	'use strict';

	angular.module("DureDHIS").controller("createMetadataCtrl",createMetadataCtrl);
	createMetadataCtrl.$inject = ["dhisService","$scope","$state","$timeout","$q"]

	function createMetadataCtrl(dhisService,$scope,$state,$timeout,$q){
		console.log("create metadata Controller is intialised");
		var vm = this;

		// private variables
		var xmlMetadata = undefined;
		var xmlDataIndicators = undefined;

		// public variables
		vm.isAlert = {
			visible : false,
			success : false,
			danger : false
		};
		vm.isLoading = false;

		// public methods
		vm.init = init;
		vm.importDataElements = importDataElements;

		// private methods
		var navigateToUploadDataElements = navigateToUploadDataElements;

		function importDataElements(){
			//console.log(" Import metadata ",xmlMetadata);
			vm.isLoading = true;
			var promise1 = dhisService.createMetadata(xmlMetadata);
			var promise2 = dhisService.createMetadata(xmlDataIndicators);

			$q.all([promise1,promise2]).then(function(responseArray){
				vm.isAlert.visible = true;
				vm.isAlert.success = true;
				vm.isLoading = false;
				navigateToUploadDataElements();
			},function(error){
				vm.isAlert.visible = true;
				vm.isAlert.danger = true;
			});

		} // end of importDataElements

		function navigateToUploadDataElements(){	
			$timeout(function(){
				console.log("Navigate to Upload Data elements");
				$state.go("dataelement.uploadDataElements");
			},1000);
		} // end of 'navigateToUploadDataElements'

		function init(){
			var promise1 = dhisService.getMetaDataFile();
			var promise2 = dhisService.importIndicatorsFile();

			$q.all([promise1,promise2]).then(function(responsArray){
				xmlMetadata = responsArray[0]["data"];
				xmlDataIndicators = responsArray[1]["data"];
			},function(error){
				console.log(error);
			});

			
		} // end of init

	}// end of createMetadataCtrl	
})();