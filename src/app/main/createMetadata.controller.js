(function(){
	'use strict';

	angular.module("DureDHIS").controller("createMetadataCtrl",createMetadataCtrl);
	createMetadataCtrl.$inject = ["dhisService","$scope","$state","$timeout"]

	function createMetadataCtrl(dhisService,$scope,$state,$timeout){
		console.log("create metadata Controller is intialised");
		var vm = this;

		// private variables
		var xmlMetadata = undefined;
		var xmlData = undefined;

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
			var promise = dhisService.createMetadata(xmlData);
			promise.then(function(response){ // success callback
				vm.isAlert.visible = true;
				vm.isAlert.success = true;
				vm.isLoading = false;
				navigateToUploadDataElements();
			},function(response){ // error callback
				vm.isAlert.visible = true;
				vm.isAlert.danger = true;
			});
		}

		function navigateToUploadDataElements(){	
			$timeout(function(){
				console.log("Navigate to Upload Data elements");
				$state.go("dataelement.uploadDataElements");
			},1000);
		} // end of 'navigateToUploadDataElements'

		function init(){
			var promise = dhisService.getMetaDataFile();
			promise.then(function(response){ // success
								
				//var parser = new DOMParser();
				//xmlMetadata = parser.parseFromString(response["data"],"text/xml");
				xmlData = response["data"];
				//console.log(xmlData);
			},function(response){ // error
				console.log(response);
			});
		} // end of init

	}// end of createMetadataCtrl	
})();