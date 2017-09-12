(function(){
	'use strict';
	angular.module("DureDHIS").factory("dataCache",dataCache);

	function dataCache(){

		var stepName = "";
		var obj = new Object();

		obj.setImportDataStep = setImportDataStep;
		obj.getImportDataStep = getImportDataStep;

		return obj;

		function setImportDataStep(_stepName){
			stepName = _stepName;
		}

		function getImportDataStep(){
			return stepName;
		}
	} // end of dataCache

})();