(function(){
	'use strict';
	angular.module('DureDHIS').controller("createOrgUnitController",createOrgUnitController);
	
	createOrgUnitController.$inject = ["$scope","dhisService","$uibModalInstance","moment","$timeout"];
	
	function createOrgUnitController($scope,dhisService,$uibModalInstance,moment,$timeout){
		console.log("Controller 'createOrgUnitController' instantiated");

		var vm = this;

		// public methods
		vm.create = create;
		vm.cancel = cancel;
		vm.init = init;

		// public variabled
		vm.orgUnitId = "";
		vm.orgUnitName = "";
		vm.alertType = "";
		vm.alertMsg = "";
		vm.isAlert = 0;

		function init(){

		} // end of init

		function create(){
			var dateString = moment().format("YYYY-MM-DD");
			console.log(dateString);
			var promise = dhisService.createOrganisationUnit(vm.orgUnitId,vm.orgUnitName,vm.orgUnitName,dateString);
			promise.then(success,error);
			function success(response){
				vm.isAlert = 1;
				var statusCode = response["httpStatusCode"];
				
				if(statusCode === 201 || statusCode === 200){
					vm.alertMsg = "Organisation Unit \""+vm.orgUnitName+"\" created successfully";
					vm.alertType = "alert-success";	
					
					$timeout(function(){						
						$uibModalInstance.close("Created");	
					},1000)	
						
				}else{
					vm.alertMsg = "Error occurred while creating Organisation Unit \""+vm.orgUnitName+"\"";
					vm.alertType = "alert-danger";	
					console.log(response);
				}	
			} // end of success

			function error(response){
				vm.isAlert = 1;						
				vm.alertMsg = "Error occurred while creating Organisation Unit \""+vm.orgUnitName+"\"";
				vm.alertType = "alert-danger";
				console.log(response);
			}
			
		} // end of create

		function cancel(){
			$uibModalInstance.dismiss('cancel');
		} // end of cancel
	}
})();