(function(){
	'use strict';

	angular.module("DureDHIS").controller("createMetadataCtrl",createMetadataCtrl);
	createMetadataCtrl.$inject = ["dhisService","$scope","$state","$timeout"]

	function createMetadataCtrl(dhisService,$scope,$state,$timeout){
		console.log("create metadata Controller is intialised");
		var vm = this;

		// public variables
		vm.isAlert = {
			visible : false,
			success : false,
			danger : false
		};

		// public methods
		vm.importDataElements = importDataElements;

		// private methods
		var navigateToUploadDataElements = navigateToUploadDataElements;

		function importDataElements(){
			console.log(" Import metadata ");

			var promise = dhisService.createMetadata();
			promise.then(function(response){ // success callback
				vm.isAlert.visible = true;
				vm.isAlert.success = true;
				navigateToUploadDataElements();
			},function(response){ // error callback
				vm.isAlert.visible = true;
				vm.isAlert.danger = true;
			});
		}

		function navigateToUploadDataElements(){	
			$timeout(function(){
				console.log("Navigate to Upload Data elements");
			},2000);
		} // end of 'navigateToUploadDataElements'


	}// end of createMetadataCtrl	
})();