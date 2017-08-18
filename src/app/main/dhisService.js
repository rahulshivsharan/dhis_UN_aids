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
		var tableRowData = undefined; // contains row data i.e. and array of array [[],[]... ]    
		var ou = undefined; // holds organisationUnit key-value,
		var ouUpdatedValues = undefined; // holds key-value for organisation Units where 'key' is old value and 'value' is newly mapped value 

		// public methods
		service.getOrganisationUnits = getOrganisationUnits;
		service.getDataElements = getDataElements; 
		service.createMetadata = createMetadata;
		service.getBasicInfoOfCurrentUser = getBasicInfoOfCurrentUser;
		service.getUserRoles = getUserRoles;
		service.createOrganisationUnit = createOrganisationUnit;
		service.setDataElementObject = setDataElementObject;	
		service.getDataElementObject = getDataElementObject;
		service.getMetaDataFile = getMetaDataFile;
		service.getCategoryOptionCombos = getCategoryOptionCombos;

		service.getOrgUnitLevels = getOrgUnitLevels;
		service.getAnOrgUnitLevel = getAnOrgUnitLevel;
		service.getOrgUnitsTree = getOrgUnitsTree;
		service.importDataElements = importDataElements;

		service.setTableRowData = setTableRowData;
		service.getTableRowData = getTableRowData;
		service.setOU = setOU;
		service.getOU = getOU;
		service.setUpdatedOU = setUpdatedOU;
		service.getUpdatedOU = getUpdatedOU;
		service.resetValues = resetValues;
		service.tableHeaders = undefined; // no getter-setters


		// private methods		
		var parseResponse = parseResponse;
		var parseXmlResponse = parseXmlResponse; // utility method to parse string to XML;

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

		function parseXmlResponse(response){
				var xmlString = undefined,
					responseObj = undefined;

				// the below condition is added 
				// to parse the XML response according to the endpoint configured.
				// the first condition is for testing (i.e. DHIS_BACKEND pointing to testing or local environment) 
				// where as the second condition is for production (i.e. DHIS_BACKEND pointing to production;
				// when deployed in DHIS). 	
				if("body" in response.data){
					if(angular.isString(response.data.body)){
						xmlString = response.data.body;						
						responseObj = $.parseXML(xmlString);							
					}else{
						responseObj = response.data.body;
					}					
						
				}else{					
					responseObj = response.data
				}

			return 	responseObj;
		} // end of parseXmlResponse



		// getters and setters for property 'tableRowData'
		function setTableRowData(tData){
			tableRowData = tData;
		}

		function getTableRowData(){
			return tableRowData;
		}

		// getters and setters for property 'dataElementObject'
		function setDataElementObject(obj){
			dataElementObject = obj;
		}

		function getDataElementObject(){
			return dataElementObject;
		} 

		// getters and setters for property 'OU'(Organisation Unit)
		function setOU(obj){
			ou = obj;
		}

		function getOU(){
			return ou;
		} 

		// getters and setters for property 'ouUpdatedValues' (Organisation Unit)
		function setUpdatedOU(obj){
			ouUpdatedValues = obj;
		}

		function getUpdatedOU(){
			return ouUpdatedValues;
		}

		function resetValues(){
			dataElementObject = undefined;
			tableRowData = undefined;
			ou = undefined;
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
				var jsonResponseObj = undefined;

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

		function createMetadata(xmlData){
			var url = DHIS_BACKEND + "/api/metadata";
			var deferred = $q.defer();

			$http({
				"method" : "POST",
				"url" : url,
				"header" : {
					"Content-type" : "application/xml",
				},
				"data" : xmlData
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


		function getMetaDataFile(){
			var url = "app/main/UNAIDS_metadata.xml";
			var deferred = $q.defer();
			var success = success, error = error;

			$http({
				"method" : "GET",
				"url" : url
			}).then(success,error);

			return deferred.promise;

			function success(response){
				deferred.resolve(response);
			}

			function error(response){
				deferred.reject(response);
			}

		}// end of getMetaDataFile

		function getCategoryOptionCombos(){
			var url = DHIS_BACKEND + "/api/categoryOptionCombos.json";
			var deferred = $q.defer();
			var success = success, error = error;

			$http({
				"method" : "GET",
				"url" : url
			}).then(success,error);

			return deferred.promise;

			function success(response){
				var jsonResponseObj = parseResponse(response);
				deferred.resolve(jsonResponseObj);
			}

			function error(response){
				var jsonResponseObj = parseResponse(response);
				deferred.reject(jsonResponseObj);
			}
		} // end of getCategoryOptionCombos

		function getOrgUnitLevels(){
			var url = DHIS_BACKEND + "/api/organisationUnitLevels.json";
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

		} // end of getOrgUnitLevels

		function getOrgUnitsTree(){
			
			var url = DHIS_BACKEND + "/dhis-web-commons-ajax-json/getOrganisationUnitTree.action";
			
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

		} // end of getOrgUnitsTree

		function getAnOrgUnitLevel(ouId){
			//var url = DHIS_BACKEND + "/api/organisationUnitLevels/" + ouId +".json";
			var url = DHIS_BACKEND + "/api/orgUnitLevel?ouId=" + ouId;
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

		} // end of getAnOrgUnitLevel

		function importDataElements(dataObj){
			var url = DHIS_BACKEND + "/api/24/dataValueSets";
			var deferred = $q.defer();

			$http({
				"method" : "POST",
				"url" : url,
				"data" : dataObj
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
		} // importDataElements

	} // end of dhisService

})();