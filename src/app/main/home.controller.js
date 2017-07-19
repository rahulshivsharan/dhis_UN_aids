(function() {
    'use strict';
    angular.module('DureDHIS').controller('homeController', homeController);
    homeController.$inject = ["dhisService","$scope"]

    function homeController(dhisService,$scope){
    	var vm = this;
    	vm.init = init;
    	vm.organisationUnits = undefined;

    	console.log("Home Controller is intialised");

    	function init(){
    		var promise = dhisService.getOrganisationUnits();

    		promise.then(function(response){
    			vm.organisationUnits = response["organisationUnits"];
    		},function(error){
    			console.log(error);
    		});


    	}

    } // end of "homeController" 
})();
