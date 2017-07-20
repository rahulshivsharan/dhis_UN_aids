(function() {
    'use strict';
    angular.module('DureDHIS').controller('homeController', homeController);
    homeController.$inject = ["dhisService","$scope"]

    function homeController(dhisService,$scope){
    	console.log("Home Controller is intialised");   
        var vm = this;

        // public methods and variables
    	vm.init = init;
        vm.organisationUnits = undefined;
        vm.dataElements = undefined; 	

        // private method and variables
        var getOrganisationUnits = getOrganisationUnits;
        var getDataElements = getDataElements; 

    	function init(){
    		getOrganisationUnits();
            getDataElements();
    	}

        function getOrganisationUnits(){
            var promise = dhisService.getOrganisationUnits();

            promise.then(function(response){
                vm.organisationUnits = response["organisationUnits"];
            },function(error){
                console.log(error);
            });
        }

        function getDataElements(){
            var promise = dhisService.getDataElements();

            promise.then(function(response){
                vm.dataElements = response["dataElements"];
            },function(error){
                console.log(error);
            });
        }
    } // end of "homeController" 
})();
