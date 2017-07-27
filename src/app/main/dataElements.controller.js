(function(){
	'use strict'

	angular.module('DureDHIS').controller("dataElementsController",dataElementsController);

	dataElementsController.$inject = ["$scope","dhisService"];

	function dataElementsController($scope,dhisService){
		console.log("'dataElementsController' is initialised");

		var vm = this;
        vm.data = [];
		vm.isVisible = "gridHidden";
		vm.isLoading = false;
        vm.tableHeaders = []; // contains table headers
        vm.tableRowData = []; // contrains row data i.e. and array of array [[],[]... ]
        vm.dataElements = undefined;
        vm.isEditTable = 1;
        vm.selectedDataElement = [];
		

		// private methods
        var handleFileSelect = handleFileSelect;
        var processFileContentForDisplay = processFileContentForDisplay;
        var loadDataElements = loadDataElements;

        // private variables
        var fileContent = undefined;
		
		// public methods and variables
    	vm.init = init;        
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
            vm.isVisible = "gridVisible";
            


            if (target && target.files && target.files.length === 1) {                
                var fileObject = target.files[0];                 
            }// end of if

            reader.onloadend = function(event){
                fileContent = reader.result;
                processFileContentForDisplay();                
            }

            reader.readAsText(fileObject);    
        }; // end of 'handleFileSelect'

        function init(){
        	loadDataElements();   
        }

        // fetch data elements to be shown in table
        function loadDataElements(){
            dhisService.getDataElements().then(successFn,errorFn);

            function successFn(response){
                console.log(" DataElements loaded ",response);
                vm.dataElements = response["dataElements"]
            }

            function errorFn(response){
                console.log(response);
            }
        } // end of loadDataElements

        function editMapping(){
            vm.isEditTable = 0;
        } // end of editMapping

        function processFileContentForDisplay(){
            var statements = fileContent.split("\n");
            var rowData = undefined;
            var rowDataSet = undefined;
            var tableHeaders = [];
            var tableRowData = [];
            
            for(var index = 0; index < statements.length; index++){
                rowData = statements[index];    
                rowDataSet = rowData.split(",");

                if(index === 0){
                    angular.forEach(rowDataSet,function(value,idx){
                        tableHeaders.push(value); // data to be shown in table header
                    });
                }else{
                    tableRowData.push(rowDataSet); // data to be shown in table row
                }                
            } // end of for

            $scope.$apply(function(){
                vm.tableHeaders = tableHeaders;
                vm.tableRowData = tableRowData;
            });
        }// end of processFileContentForDisplay

	} // end of 'uploadDataElementsController'
})();