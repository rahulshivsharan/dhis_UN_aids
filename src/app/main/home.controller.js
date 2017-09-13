(function() {
    'use strict';
    angular.module('DureDHIS').controller('homeController', homeController);
    homeController.$inject = ["dhisService","$scope","$state","$q","$window","DHIS_BACKEND"]

    function homeController(dhisService,$scope,$state,$q,$window,DHIS_BACKEND){
    	console.log("Home Controller is intialised");   
        
        var vm = this;
        vm.isLoading = false;

        // private methods        
        var checkIfDataElementsExists = checkIfDataElementsExists;
        var isCurrentUserAdmin = isCurrentUserAdmin;

        // public methods and variables
    	vm.init = init;
        vm.loadHome = loadHome;
        
        
    	function init(){
    	   vm.isLoading = true;           
           
           // check if the current user is 
           // admin user
           isCurrentUserAdmin().then(function(flag){
                if(flag === true){
                    // if current user is admin; then further check
                    // if are there any data elements present in system
                    checkIfDataElementsExists();
                }else{
                    $state.go("dataelement.uploadDataElements");
                } 
           },function(error){
                // error
           }); 
           
    	} // end of init


        // this function loaded all the
        // available userRoles in system,
        // and compares the userroles with the
        // current User. If the current user is Admin
        // it flags it.
        function isCurrentUserAdmin(){
            var flag = false,
                deferred = $q.defer();
            dhisService.getBasicInfoOfCurrentUser().then(successFn,errorFn);
            
            return deferred.promise;

            function successFn(response){  
                             
                if(response["code"] === "admin"){
                    flag = true;
                }
                deferred.resolve(flag);                
            }; // end of successFn

            function errorFn(response){
                console.log(response);
                deferred.reject("error");
            }

        } // end of 'loadAllUserRoles'
        
        // are there any data elements 
        // present in system
        function checkIfDataElementsExists(){
            var promise = dhisService.getDataElements("filter=id:eq:rhXstKVfvvj");
            promise.then(successFn,errorFn);

            function successFn(response){
                var dataElements = undefined;
                if(angular.isDefined(response["dataElements"]) 
                        && angular.isArray(response["dataElements"]) 
                        && response["dataElements"].length >= 1){
                    
                    dataElements = response["dataElements"]; 
                    
                    // if data elements present; then navigate to 
                    // upload Data elements page
                    if(dataElements[0]["id"] === "rhXstKVfvvj"){
                        vm.isLoading = false;
                        $state.go("dataelement.uploadDataElements");
                        //$state.go("importMetadata");                        
                    }                    
                }else{

                    // if system doesn't contain data element
                    // then load upload metadata page
                    $state.go("importMetadata");
                }
            } // end of successFn

            function errorFn(response){
                console.log(response);
            }
        }; // end of checkIfDataElementsExists 


        function loadHome(){
            var url = DHIS_BACKEND + "/";
            //var url = "//localhost:8082";
            $window.location.href = url;
        }
        
    } // end of "homeController" 
})();
