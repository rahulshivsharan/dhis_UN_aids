(function() {
    'use strict';
    angular.module('DureDHIS').controller('homeController', homeController);
    homeController.$inject = ["dhisService","$scope","$state"]

    function homeController(dhisService,$scope,$state){
    	console.log("Home Controller is intialised");   
        var vm = this;
        vm.isVisible = "gridHidden";
        vm.isLoading = false;

        // private methods
        var handleFileSelect = handleFileSelect;
        var checkIfDataElementsExists = checkIfDataElementsExists;

        // public methods and variables
    	vm.init = init;
        $scope.data = [];

        $scope.gridOptions = {
            enableColumnResizing : true,
            enableGridMenu: false,
            data: 'data',
            importerDataAddCallback: function (grid, newObjects){                
              $scope.data = $scope.data.concat( newObjects );              
            },
            onRegisterApi: function(gridApi){
              $scope.gridApi = gridApi;
            }
        }
        
    	function init(){
    	   vm.isLoading = true; 
           checkIfDataElementsExists();
    	} // end of init


        var fileChooser = document.querySelectorAll('.file-chooser');
  
        if (fileChooser.length !== 1){
            console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
        }else{   
            fileChooser[0].addEventListener('change', handleFileSelect, false);   
        }

        function handleFileSelect(event){            
            var target = event.srcElement || event.target;
            vm.isVisible = "gridVisible";
            
            if (target && target.files && target.files.length === 1) {
                
                var fileObject = target.files[0];              
                $scope.gridApi.importer.importFile( fileObject );
                target.form.reset();          
              
            }// end of if
        };

        function checkIfDataElementsExists(){
            var promise = dhisService.getDataElements("filter=id:eq:rhXstKVfvvj");
            promise.then(successFn,errorFn);

            function successFn(response){
                var dataElements = undefined;
                if(angular.isDefined(response["dataElements"]) 
                        && angular.isArray(response["dataElements"]) 
                        && response["dataElements"].length >= 1){
                    //$state.go("");
                    dataElements = response["dataElements"]; 
                    
                    if(dataElements[0]["id"] === "rhXstKVfvvj"){
                        vm.isLoading = false;
                        $state.go("importMetadata");
                    }                    
                }
            }

            function errorFn(response){
                console.log(response);
            }
        }; // end of checkIfDataElementsExists 
        
    } // end of "homeController" 
})();
