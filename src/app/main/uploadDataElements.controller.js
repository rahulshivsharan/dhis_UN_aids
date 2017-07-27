(function(){
	'use strict'

	angular.module('DureDHIS').controller("uploadDataElementsController",uploadDataElementsController);

	uploadDataElementsController.$inject = ["$scope","dhisService","$state"];

	function uploadDataElementsController($scope,dhisService,$state){
		console.log("'uploadDataElementsController' is initialised");
		var vm = this;		

		// private methods
        var handleFileSelect = handleFileSelect;
        var processFileContentForDisplay = processFileContentForDisplay;

        // private variables
        var fileContent = undefined;
		
		// public methods and variables
    	vm.init = init;
        $scope.data = [];
        vm.isVisible = "gridHidden";
        vm.isLoading = false;
        vm.navigateToMapDataElements = navigateToMapDataElements;

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
        };


        var fileChooser = document.querySelectorAll('.file-chooser');
  
        if (fileChooser.length !== 1){
            console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
        }else{   
            fileChooser[0].addEventListener('change', handleFileSelect, false);   
        }

        function handleFileSelect(event){            
            var target = event.srcElement || event.target;
            vm.isVisible = "gridVisible";
            var reader = new FileReader();
            
            if (target && target.files && target.files.length === 1) {
                
                var fileObject = target.files[0];              
                $scope.gridApi.importer.importFile(fileObject);
                target.form.reset();          
              
            }// end of if

            reader.onloadend = function(event){
                fileContent = reader.result;
                processFileContentForDisplay();                
            }

            reader.readAsText(fileObject);

        }; // end of 'handleFileSelect'

        function init(){
        	
        }

        function processFileContentForDisplay(){
            var statements = fileContent.split("\n");
            var rowData = undefined;
            var metadataNames = undefined;
            var rowDataSet = undefined;
            var dataElementObject = undefined;
            var dataElementObjectList = [];
            var dataElementObjectCollection = new Object();
            
            for(var index = 0; index < statements.length; index++){
                rowData = statements[index];
                rowDataSet = rowData.split(",");

                // first row contains meta-data names
                // hence capturing them
                if(index === 0){
                    metadataNames = angular.copy(rowDataSet);
                    dataElementObjectCollection["metadata"] = metadataNames; 
                }else{
                    
                    dataElementObject = {}; // reinitialise                    
                    
                    // iterate through row data to get the column values
                    angular.forEach(rowDataSet,function(value,idx){
                        var propertyName = metadataNames[idx]; // get the metadata Name for perticular index i.e idx                         
                        dataElementObject[propertyName] = value; // add metadata as property name of object assign value to it                          
                    }); // end of for each
                    
                    dataElementObjectList.push(dataElementObject); // adding data elements object to list
                }// end of else 
            }// end of for
            
            dataElementObjectCollection["dataElements"] = dataElementObjectList
            //console.log(dataElementObjectCollection);
            dhisService.setDataElementObject(dataElementObjectCollection);
        } // end of 'processFileContentForDisplay'

        function navigateToMapDataElements(){
            $state.go("mapDataElements");
        }

	} // end of 'uploadDataElementsController'
})();