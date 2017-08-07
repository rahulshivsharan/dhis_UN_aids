(function(){
	'use strict'
	angular.module("DureDHIS").factory("dhisService",dhisService);	

	dhisService.$inject = ["DHIS_BACKEND","$http","$q"];

	function dhisService(DHIS_BACKEND,$http,$q){

		var service = {};

		// 'dataElementObject' object is used in 
		// holding the values when data-elements from Dhis
		// comma seperated files is uploaded
		var dataElementObject = undefined; 

		// public methods
		service.getOrganisationUnits = getOrganisationUnits;
		service.getDataElements = getDataElements; 
		service.createMetadata = createMetadata;
		service.getBasicInfoOfCurrentUser = getBasicInfoOfCurrentUser;
		service.getUserRoles = getUserRoles;
		service.createOrganisationUnit = createOrganisationUnit;
		service.setDataElementObject = setDataElementObject;	
		service.getDataElementObject = getDataElementObject;

		// private methods
		var getData = getData;
		var parseResponse = parseResponse;

		return service;

		function parseResponse(response){
				var jsonString = undefined,
					jsonResponseObj = undefined;

				// the below condition is added 
				// to parse the response according to the endpoint configured.
				// the first condition is for testing (i.e. DHIS_BACKEND pointing to testing or local environment) 
				// where as the second condition is for production (i.e. DHIS_BACKEND pointing to production;
				// when deployed in DHIS). 	
				if("body" in response.data){
					if(angular.isString(response.data.body)){
						jsonString = response.data.body;
						jsonResponseObj = JSON.parse(jsonString);	
					}else{
						jsonResponseObj = response.data.body;
					}					
						
				}else{					
					jsonResponseObj = response.data
				}

			return 	jsonResponseObj;
		} // end of parseResponse

		// getters and setters for property 'dataElementObject'
		function setDataElementObject(obj){
			dataElementObject = obj;
		}

		function getDataElementObject(){
			return dataElementObject;
		} 

		// get organisation Unit from server
		function getOrganisationUnits(){
			var url = DHIS_BACKEND + "/api/organisationUnits.json";
			var deferred = $q.defer();
			
			$http({
				"method" : "GET",
				"url" : url
			}).then(successFn,errorFn);

			return deferred.promise;

			function successFn(response){				
				var jsonResponseObj = parseResponse(response);				
				deferred.resolve(jsonResponseObj);
			} // end of successFn

			function errorFn(response){
				var jsonResponseObj = parseResponse(response);
				deferred.reject(jsonResponseObj);
			} // end of errorFn
		} // end of "getOrganisationUnits" 

		function createOrganisationUnit(id,name,shortName,openingDate){
			var url = DHIS_BACKEND + "/api/organisationUnits.json";
			var deferred = $q.defer();
			
			$http({
				"method" : "POST",
				"url" : url,
				"data" : {
					"id" : id,
					"name" : name,
  					"shortName" : shortName,
  					"openingDate" : openingDate
				}
			}).then(successFn,errorFn);

			return deferred.promise;

			function successFn(response){
				var jsonResponseObj = parseResponse(response);
				deferred.resolve(jsonResponseObj);
			} // end of successFn

			function errorFn(response){
				var jsonResponseObj = parseResponse(response);
				deferred.reject(jsonResponseObj);
			} // end of errorFn
		}// end of createOrganisationUnit


		function getDataElements(queryParameters){
			var url = DHIS_BACKEND + "/api/24/dataElements.json";

			if(angular.isDefined(queryParameters) && queryParameters !== null && queryParameters.trim() !== ""){
				url += "?" + queryParameters; // Example /api/24/dataElements.json?filter=id:eq:rhXstKVfvvj
			}

			var deferred = $q.defer();
			
			$http({
				"method" : "GET",
				"url" : url
			}).then(successFn,errorFn);

			return deferred.promise;

			function successFn(response){
				var jsonResponseObj = parseResponse(response);				
				deferred.resolve(jsonResponseObj);			
			} // end of successFn

			function errorFn(response){
				var jsonResponseObj = parseResponse(response);
				deferred.reject(jsonResponseObj);
			} // end of errorFn
		} // end of "getOrganisationUnits"

		function createMetadata(){
			var url = DHIS_BACKEND + "/api/metadata.json";
			var deferred = $q.defer();

			$http({
				"method" : "POST",
				"url" : url,
				"data" : getData()
			}).then(successFn,errorFn);

			return deferred.promise;

			function successFn(response){
				var jsonResponseObj = parseResponse(response);
				deferred.resolve(jsonResponseObj);
			}// end of successFn

			function errorFn(response){
				var jsonResponseObj = parseResponse(response);
				deferred.reject(jsonResponseObj);
			}

		} // end of 'createMetadata'

		function getBasicInfoOfCurrentUser(){
			var url = DHIS_BACKEND + "/api/me.json";
			var deferred = $q.defer();
			
			$http({
				"method" : "GET",
				"url" : url
			}).then(successFn,errorFn);

			return deferred.promise;

			function successFn(response){				
				var jsonResponseObj = parseResponse(response);				
				deferred.resolve(jsonResponseObj);
			} // end of successFn

			function errorFn(response){
				var jsonResponseObj = parseResponse(response);
				deferred.reject(jsonResponseObj);
			} // end of errorFn
			 
		} // end of 'getBasicInfoOfCurrentUser'


		function getUserRoles(){
			var url = DHIS_BACKEND + "/api/userRoles.json";
			var deferred = $q.defer();
			
			$http({
				"method" : "GET",
				"url" : url
			}).then(successFn,errorFn);

			return deferred.promise;

			function successFn(response){
				var jsonResponseObj = parseResponse(response);				
				deferred.resolve(jsonResponseObj);				
			} // end of successFn

			function errorFn(response){
				var jsonResponseObj = parseResponse(response);
				deferred.reject(jsonResponseObj);
			} // end of errorFn
		}// end of function 'getUserRoles'

		function getData(){
			var data = {
				"system": {
					"id": "eed3d451-4ff5-4193-b951-ffcc68954299",
					"rev": "78cffad",
					"version": "2.27",
					"date": "2017-07-03T12:18:42.935"
				},
				"dataSets": [

					{
						"lastUpdated": "2017-07-03T12:30:50.022",
						"id": "SwOdzq5MuZh",
						"created": "2017-07-03T11:04:33.437",
						"name": "Data trial set",
						"shortName": "Data trial set",
						"validCompleteOnly": false,
						"dataElementDecoration": false,
						"publicAccess": "rw------",
						"notifyCompletingUser": false,
						"noValueRequiresComment": false,
						"skipOffline": false,
						"fieldCombinationRequired": false,
						"renderHorizontally": false,
						"renderAsTabs": false,
						"mobile": false,
						"version": 1,
						"timelyDays": 15,
						"periodType": "Monthly",
						"openFuturePeriods": 0,
						"expiryDays": 0,
						"categoryCombo": {
							"id": "p0KPaWEg3cf"
						},
						"lastUpdatedBy": {
							"id": "M5zQapPyTZI"
						},
						"user": {
							"id": "M5zQapPyTZI"
						},
						"dataSetElements": [
							{
								"categoryCombo": {
									"id": "qI5bEmuW1bi"
								},
								"dataElement": {
									"id": "rhXstKVfvvj"
								},
								"dataSet": {
									"id": "SwOdzq5MuZh"
								}
							}
						],
						"compulsoryDataElementOperands": [],
						"translations": [],
						"dataInputPeriods": [],
						"organisationUnits": [						
							{
								"id": "ZwVNnjED1Dh"
							}
						],
						"userGroupAccesses": [],
						"attributeValues": [],
						"indicators": [],
						"userAccesses": [],
						"legendSets": []
					}
				],
				"dataElements": [
					{
						"code": "Population1524",
						"lastUpdated": "2017-07-03T12:17:11.901",
						"id": "rhXstKVfvvj",
						"created": "2017-07-03T12:17:11.901",
						"name": "Population aged 15-24",
						"shortName": "Population aged 15-24",
						"aggregationType": "SUM",
						"domainType": "AGGREGATE",
						"publicAccess": "rw------",
						"description": "Population aged 15-24",
						"valueType": "NUMBER",
						"zeroIsSignificant": false,
						"categoryCombo": {
							"id": "qI5bEmuW1bi"
						},
						"lastUpdatedBy": {
							"id": "M5zQapPyTZI"
						},
						"user": {
							"id": "M5zQapPyTZI"
						},
						"translations": [],
						"userGroupAccesses": [],
						"attributeValues": [],
						"userAccesses": [],
						"legendSets": [],
						"aggregationLevels": []
					}
				]
			}// data

			return data;
		} // end of getData

	} // end of dhisService

})();