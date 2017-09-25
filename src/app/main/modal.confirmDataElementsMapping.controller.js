(function(){
	'use strict'

	angular.module('DureDHIS').controller("modalConfirmDataElementsMappingController",modalConfirmDataElementsMappingController);

	modalConfirmDataElementsMappingController.$inject = ["$scope","$uibModalInstance"]

	function modalConfirmDataElementsMappingController($scope,$uibModalInstance){
		var vm = this;
		vm.ok = ok;
		vm.cancel = cancel;

		function ok(){
			$uibModalInstance.close(true);
		}

		function cancel(){
			$uibModalInstance.close(false);
		}

	} // end of modalConfirmDataElementsMappingController
})();