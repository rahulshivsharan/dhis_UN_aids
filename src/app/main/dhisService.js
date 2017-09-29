(function(){
	'use strict'
	angular.module("DureDHIS").factory("dhisService",dhisService);	

	dhisService.$inject = ["DHIS_BACKEND","$http","$q"];

	function dhisService(DHIS_BACKEND,$http,$q){
		console.log("DHIS_BACKEND ",DHIS_BACKEND);
		var service = {};

		// public methods
		service.getOrganisationUnits = getOrganisationUnits;
		service.getDataElements = getDataElements; 
		service.createMetadata = createMetadata;
		service.getBasicInfoOfCurrentUser = getBasicInfoOfCurrentUser;
		service.getUserRoles = getUserRoles;
		service.createOrganisationUnit = createOrganisationUnit;
		
		service.getMetaDataFile = getMetaDataFile;
		service.getCategoryOptionCombos = getCategoryOptionCombos;

		service.getOrgUnitLevels = getOrgUnitLevels;
		service.getAnOrgUnitLevel = getAnOrgUnitLevel;
		service.getOrgUnitsTree = getOrgUnitsTree;
		service.importDataElements = importDataElements;
		service.importIndicatorsFile = importIndicatorsFile;
		
		service.getIndicators = getIndicators;
		service.getAnIndicator = getAnIndicator;
		service.getDataElementOperands = getDataElementOperands; 
		service.editIndicator = editIndicator;


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


		function getIndicators(){
			var url = DHIS_BACKEND + "/api/indicators.json?filter=name:ilike:HIV%20Ind";

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

		} // end of getIndicators

		function getAnIndicator(indicatorId){
			//var url = DHIS_BACKEND + "/api/indicators/"+indicatorId+".json"; // for production
			var url = DHIS_BACKEND + "/api/indicators?indicatorId="+indicatorId; // for development

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

		} // end of getAnIndicator

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
			var url = DHIS_BACKEND + "/api/dataElements.json";

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
				"headers" : {
					"Content-Type" : "application/xml"
				},
				"data" : xmlData
			}).then(successFn,errorFn);

			return deferred.promise;

			function successFn(response){
				//var jsonResponseObj = parseResponse(response);
				deferred.resolve(response);
			}// end of successFn

			function errorFn(response){
				//var jsonResponseObj = parseResponse(response);
				deferred.reject(response);
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
			// var url = "app/main/UNAIDS_metadata.xml";
			var url = "https://raw.githubusercontent.com/duretech/hivpopdata_meta_xml/master/default/UNAIDS_DataElements_v003.xml";
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
			//var url = DHIS_BACKEND + "/api/organisationUnitLevels/" + ouId +".json"; // production
			var url = DHIS_BACKEND + "/api/orgUnitLevel?ouId=" + ouId; // development

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
			var url = DHIS_BACKEND + "/api/dataValueSets?importStrategy=CREATE_AND_UPDATE";
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


		function importIndicatorsFile(){
			var url = "https://raw.githubusercontent.com/duretech/hivpopdata_meta_xml/master/default/UNAIDS_Indicators_v003.xml";

			var deferred = $q.defer();

			$http({
				"method" : "GET",
				"url" : url
			}).then(successFn,errorFn);

			return deferred.promise;

			function successFn(response){
				deferred.resolve(response);
			} // end of successFn

			function errorFn(response){				
				deferred.reject(response);
			} // end of errorFn
		} // end of importIndicatorsFile


		function getDataElementOperands(){
			var url = DHIS_BACKEND + "/api/dataElementOperands.json?filter=dataElement.domainType:eq:AGGREGATE&filter=name:ilike:HIV%20Num&fields=id,displayName&totals=true";
			

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
		} // end of getDataElementOperands

		function editIndicator(indicatorObj){
			//console.log(JSON.stringify(indicatorObj));
			
			//var url = DHIS_BACKEND + "/api/indicators/"+ indicatorObj["id"] +".json"; // production
			var url = DHIS_BACKEND + "/api/indicators?indicatorId="+ indicatorObj["id"]; // development

			var deferred = $q.defer();
			
			$http({
				"method" : "PUT",
				"url" : url,
				"data" : indicatorObj
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
			
			
		} // end of editIndicator 
	} // end of dhisService

})();