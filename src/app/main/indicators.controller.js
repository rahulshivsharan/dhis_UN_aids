(function(){
	'use strict';
	angular.module('DureDHIS').controller("indicatorsController",indicatorsController);

	indicatorsController.$index = ["$scope","dhisService","$q","_"]

	function indicatorsController($scope,dhisService,$q,_){
		var vm = this;	

		// public methods
		vm.init = init;
		vm.fetchIndicator = fetchIndicator;		
		
		vm.submit = submit;
		vm.onChangeDataElement = onChangeDataElement;
		vm.confirmIndicatorsMapping = confirmIndicatorsMapping;

		// public variables
		vm.indicatorList = undefined;
		vm.selectedIndicatorId = "";
		vm.selectedIndicatorObj = undefined;
		vm.isLoaded = true;
		vm.selectedIndicatorName = undefined;
		vm.dataElementOperandList = [];
		
		// this variable holds value 
		// as 
		// {
		// 	indicatorid : {
		// 		id : operandId,
		// 		label : operandName
		// 	}
		// }
		// i.e. key-value were key as indicatorId
		// and value as operand object
		vm.selectedDataElementOperand = {};
		
		vm.alert = {
			"type" : "",
			"msg" : ""
		}

		// maintains an key-value pair
		// of indicator id as key and value 
		// as indicator object
		vm.indicatorMap = {};

		vm.isMappingDone = false; // used to confirm button
		vm.indicatorsChanged = []; // maintains list of changed indicator for final save 
		
		

		// private methods
		var fetchAllIndicators = fetchAllIndicators;
		var fetchDataElementOperands = fetchDataElementOperands;

		function init(){
			vm.isLoaded = true; // to display loading image
			vm.isMappingDone = false; // used to confirm button
			vm.isResponse = false; // used to display final response success message alert

			vm.indicatorsChanged = []; // maintains list of changed indicator for final save 
			
			var promise = fetchAllIndicators(); // fetch all indicators
			
			// the below block of code is for 
			// fetching all indicator objects 
			// from already fetch indicator Id's			
			$q.when(promise).then(function(){
				var promiseArray = [];
				angular.forEach(vm.indicatorList,function(indicatorObj,index){
					//console.log(indicatorObj["id"]);
					var indicatorId = indicatorObj["id"];
					vm.indicatorMap[indicatorId] = {}; // put key as indicatorId in map
					var p = fetchIndicator(indicatorId);
					promiseArray.push(p); 
				});

				$q.all(promiseArray).then(function(){
					vm.isLoaded = false;
				});
			},function(error){
				console.log(error);
			});

			fetchDataElementOperands();


		}// end of init

		function fetchAllIndicators(){

			var success = success, error = error, deferred = $q.defer(); 
			dhisService.getIndicators().then(success,error);

			return deferred.promise;

			function success(response){
				vm.indicatorList = response["indicators"];				
				deferred.resolve("success");
			}

			function error(response){
				console.log(response);
				deferred.reject(response);
			}
		} // end of fetchAllIndicators

		// fetch Indicator object
		// for a perticular indicator Id
		function fetchIndicator(indicatorId){
			//vm.isLoaded = false;
			vm.isResponse = false;
			var success = success, error = error, mainDeferred = $q.defer();
			
			// maintains a key-value were key is indicatorId
			// and value is operandId and operand display Name 
			vm.selectedDataElementOperand[indicatorId] = {
				"label" : "",
				"id" : ""
			};
			//console.log(vm.selectedIndicatorId);

			var promise = dhisService.getAnIndicator(indicatorId).then(success,error);// fetch an indicator info

			// fetch dataelement for selected indicator's numerator value
			var dataElementPromise = promise.then(function(){
				var numeratorInfo = vm.selectedIndicatorObj["numerator"];
				var parameter = undefined;
				var numeratorId = undefined;

				/*
					the below two if conditions are added for
					from selected indicator's numberator value 
					we are able to get DataElements.  
					If Numerator value contains "." than split
					and take the first array value
					and fetch dataElement for that split value.
				*/
				if(angular.isDefined(numeratorInfo) && angular.isString(numeratorInfo)){
					numeratorId = numeratorInfo.split(".");
				}
				
				if(angular.isDefined(numeratorId) && angular.isArray(numeratorId) && numeratorId.length > 0){
					parameter = "filter=id:eq:" + numeratorId[0];	
				}else{
					parameter = "filter=id:eq:" + vm.selectedIndicatorObj["numerator"];	
				}
				
				var promiseObj = dhisService.getDataElements(parameter); // fetch dataelements for perticular numerator 
				return promiseObj;
			});

			function success(response){
				
				//console.log(response);
				vm.selectedIndicatorObj = response;			
				
				var numerator = vm.selectedIndicatorObj["numerator"].replace(/[{}#]/g,"");					
				vm.selectedIndicatorObj["numerator"] = numerator;
				vm.indicatorMap[indicatorId] = vm.selectedIndicatorObj;
			} // end of success

			function error(response){
				console.log(response);
			} // end of error

			// resolving promise for getting selected numerator's dataElement object
			dataElementPromise.then(function(response){ // success
				//console.log(response);
				var dataElementList = response["dataElements"];

				// if dataElement for numerator for perticular indicator is present
				// then set it as value of indicatorName
				// else indicatorName is space.
				if(angular.isArray(dataElementList) && dataElementList.length > 0){
					vm.selectedIndicatorName = dataElementList[0]["displayName"];
					vm.indicatorMap[indicatorId]["indicatorName"] = vm.selectedIndicatorName; 	
				}else{
					vm.selectedIndicatorName = "";
					vm.indicatorMap[indicatorId]["indicatorName"] = vm.selectedIndicatorName;
				}
				
				vm.isLoaded = true;
				mainDeferred.resolve();
			},function(response){ // error
				console.log(response);
				mainDeferred.reject();
			});

			return mainDeferred.promise;
		} // end of fetchIndicator

		// fetch all dataelement operand
		function fetchDataElementOperands(){
			var success = success, error = error;
			dhisService.getDataElementOperands().then(success,error);
			
			function success(response){
				//console.log(response);
				vm.dataElementOperandList = response["dataElementOperands"];				
			}

			function error(response){
				console.log(response);
			}
		} // end of fetchDataElementOperands

		 

		function submit(){
			var error = error, success = success, promiseArray = [];
			vm.isLoaded = true;
			angular.forEach(vm.indicatorsChanged,function(indicatorId,index){
				var selectedIndicatorObj = vm.indicatorMap[indicatorId];
				var promise = dhisService.editIndicator(selectedIndicatorObj);
				promiseArray.push(promise);
			});// end of forEach

			$q.all(promiseArray).then(function(responseArray){
				var response = undefined;
				vm.isLoaded = false;
				for(var i = 0; i < responseArray.length; i++){
					response = responseArray[i]
					if(response["httpStatusCode"] === 200 || response["httpStatusCode"] === 201){
						vm.alert.type = "success";
						vm.alert.msg = "Indicator Updated";
						vm.isLoaded = false;
						vm.isResponse = true;
						vm.selectedIndicatorId = "";
						vm.selectedDataElementOperand = {};
						vm.isMappingDone = false;
					}else{
						vm.alert.type = "warning";
						vm.alert.msg = "Error occurred";
						vm.isLoaded = false;
						vm.isResponse = true;
					}

				} // end of if

			});
			
		} // end of submit

		function onChangeDataElement(indicatorId){
			
			var operandObj = _.find(vm.dataElementOperandList,function(selectedOperand){
				return selectedOperand["id"] === vm.selectedDataElementOperand[indicatorId]["id"];
			});

			vm.selectedDataElementOperand[indicatorId]["label"] = operandObj["displayName"];
			
			// console.log(vm.selectedDataElementOperand); 
			
			vm.selectedIndicatorObj["numerator"] = "#{" + vm.selectedDataElementOperand[indicatorId]["id"] + "}";
			vm.indicatorMap[indicatorId]["numerator"] = "#{" + vm.selectedDataElementOperand[indicatorId]["id"] + "}";
			vm.indicatorsChanged.push(indicatorId);
		} // end of onChangeDataElement


		function confirmIndicatorsMapping(){
			vm.isMappingDone = true;
		}
	} // end of indicatorsController
})();