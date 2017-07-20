(function(){
	'use strict'
	angular.module("DureDHIS").factory("dhisService",dhisService);	

	dhisService.$inject = ["DHIS_BACKEND","$http","$q"]

	function dhisService(DHIS_BACKEND,$http,$q){

		var service = {};
		service.getOrganisationUnits = getOrganisationUnits;
		service.getDataElements = getDataElements; 

		return service;

		function getOrganisationUnits(){
			var url = DHIS_BACKEND + "/api/organisationUnits.json";
			var deferred = $q.defer();
			
			$http({
				"method" : "GET",
				"url" : url
			}).then(successFn,errorFn);

			return deferred.promise;

			function successFn(response){
				
				var jsonString = undefined,
					jsonResponseObj = undefined;

				// the below condition is added 
				// to parse the response according to the endpoint configured.
				// the first condition is for testing (i.e. DHIS_BACKEND pointing to testing or local environment) 
				// where as the second condition is for production (i.e. DHIS_BACKEND pointing to production;
				// when deployed in DHIS). 	
				if("body" in response.data){					
					jsonString = response.data.body;
					jsonResponseObj = JSON.parse(jsonString);	
				}else{					
					jsonResponseObj = response.data
				}	
				
				deferred.resolve(jsonResponseObj);
			} // end of successFn

			function errorFn(response){
				deferred.reject(response);
			} // end of errorFn
		} // end of "getOrganisationUnits" 


		function getDataElements(){
			var url = DHIS_BACKEND + "/api/24/dataElements.json";
			var deferred = $q.defer();
			
			$http({
				"method" : "GET",
				"url" : url
			}).then(successFn,errorFn);

			return deferred.promise;

			function successFn(response){
				
				var jsonString = undefined,
					jsonResponseObj = undefined;

				// the below condition is added 
				// to parse the response according to the endpoint configured.
				// the first condition is for testing (i.e. DHIS_BACKEND pointing to testing or local environment) 
				// where as the second condition is for production (i.e. DHIS_BACKEND pointing to production;
				// when deployed in DHIS). 	
				if("body" in response.data){					
					jsonString = response.data.body;
					jsonResponseObj = JSON.parse(jsonString);	
				}else{					
					jsonResponseObj = response.data
				}	
				
				deferred.resolve(jsonResponseObj);
			} // end of successFn

			function errorFn(response){
				deferred.reject(response);
			} // end of errorFn
		} // end of "getOrganisationUnits" 

	} // end of dhisService
})();