(function(){
	'use strict'
	angular.module("DureDHIS").factory("dhisService",dhisService);	

	dhisService.$inject = ["DHIS_BACKEND","$http","$q"]

	function dhisService(DHIS_BACKEND,$http,$q){

		var service = {};
		service.getOrganisationUnits = getOrganisationUnits; 

		return service;

		function getOrganisationUnits(){
			var url = DHIS_BACKEND + "/organisationUnits";
			var deferred = $q.defer();
			
			$http({
				"method" : "GET",
				"url" : url
			}).then(successFn,errorFn);

			return deferred.promise;

			function successFn(response){
				var jsonString = response.data.body;

				var obj = JSON.parse(jsonString);
				deferred.resolve(obj);
			}

			function errorFn(response){
				deferred.reject(response);
			}
		} // end of "getOrganisationUnits" 

	} // end of dhisService
})();