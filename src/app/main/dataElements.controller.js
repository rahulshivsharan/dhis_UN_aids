(function(){
	'use strict'

	angular.module('DureDHIS').controller("dataElementsController",dataElementsController);

	dataElementsController.$inject = ["$scope","dhisService","$state"];

	function dataElementsController($scope,dhisService,$state){
		console.log("'dataElementsController' is initialised");

		var vm = this;
        vm.data = [];
		vm.isVisible = "gridHidden";		
        vm.isLoading = "hideContent";
        vm.tableHeaders = []; // contains table headers
        vm.tableRowData = []; // contains row data i.e. and array of array [[],[]... ]        
        vm.isEditTable = 1;
        vm.selectedDataElement = [];
		vm.navigateToMapDataElements = navigateToMapDataElements;

		// private methods
        var handleFileSelect = handleFileSelect;
        var processFileContentForDisplay = processFileContentForDisplay;
        

        // private variables
        var fileContent = undefined;
        var dataElementMap = undefined;
		
		// public methods and variables    	      
        vm.editMapping = editMapping;

        


        var fileChooser = document.querySelectorAll('.file-chooser');
  
        if (fileChooser.length !== 1){
            console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
        }else{   
            fileChooser[0].addEventListener('change', handleFileSelect, false);   
        }

        function handleFileSelect(event){
            var target = event.srcElement || event.target;
            var reader = new FileReader();
            
            
            $scope.$apply(function(){                
                vm.isLoading = "showContent";
                console.log("Display loading image ",vm.isLoading);
            }); 


            if (target && target.files && target.files.length === 1) {                
                var fileObject = target.files[0];                 
            }// end of if

            reader.onloadend = function(event){
                fileContent = reader.result;
                processFileContentForDisplay();                
            }

            reader.readAsText(fileObject);    
        }; // end of 'handleFileSelect'


        function editMapping(){
            vm.isEditTable = 0;
        } // end of editMapping

        function processFileContentForDisplay(){               
            var statements = fileContent.split("\n");
            var rowData = undefined;
            var rowDataSet = undefined;
            var tableHeaders = [];
            var tableRowData = [];
            var $key = undefined, $value = undefined;
            dataElementMap = {};
            for(var index = 0; index < statements.length; index++){
                rowData = statements[index];    
                rowDataSet = rowData.split(",");

                if(index === 0){
                    angular.forEach(rowDataSet,function(value,idx){
                        tableHeaders.push(value); // data to be shown in table header
                    });
                }else{
                    tableRowData.push(rowDataSet); // data to be shown in table row                    
                    $key = rowDataSet[1];
                    $value = rowDataSet[0];
                    
                    if(angular.isDefined(rowDataSet[1]) && angular.isDefined(rowDataSet[0])){
                        dataElementMap[$key] = $value;    
                    }                    
                }                
            } // end of for

            $scope.$apply(function(){
                vm.tableHeaders = tableHeaders;
                vm.tableRowData = tableRowData;
                vm.isLoading = "hideContent";
                vm.isVisible = "gridVisible";
                dhisService.setDataElementObject(dataElementMap);
            });
        }// end of processFileContentForDisplay

        function navigateToMapDataElements(){
            $state.go("mapDataElements");
        }

	} // end of 'dataElementsController'
})();