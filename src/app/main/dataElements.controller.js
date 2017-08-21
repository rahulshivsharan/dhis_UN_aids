(function(){
	'use strict'

	angular.module('DureDHIS').controller("dataElementsController",dataElementsController);

	dataElementsController.$inject = ["$scope","dhisService","$state"];

	function dataElementsController($scope,dhisService,$state){
		console.log("'dataElementsController' is initialised");

		var vm = this;        

        // public variables
		vm.isVisible = "gridHidden";		
        vm.isLoading = false; // flag to display loading image
        vm.tableHeaders = []; // contains table headers
        vm.tableRowData = []; // contains row data i.e. and array of array [[],[]... ]        
        vm.selectedFile = undefined; // map to file Object for file uploader        

        
		// private methods
        var handleFileSelect = handleFileSelect;   

        // private variables
        var fileContent = undefined;
        var dataElementMap = undefined;
		
		// public methods 
        vm.navigateToMapDataElements = navigateToMapDataElements;
        vm.init = init;
        vm.uploadFiles = uploadFiles;
        vm.processFileContentForDisplay = processFileContentForDisplay;

        function init(){
            dhisService.resetValues();
        }

        function processFileContentForDisplay(){                       
            var statements = fileContent.split("\n");
            var rowData = undefined;
            var rowDataSet = undefined;
            var tableHeaders = [];
            var tableRowData = [];
            var $key = undefined;
            var $value = undefined;
            var orgUnits = {}; // create set of organisationUnits so that it holds unique organisationUnit names
            var ou_Name = "";

            dataElementMap = {};
            for(var index = 0; index < statements.length; index++){
                rowData = statements[index];    
                rowDataSet = rowData.split(",");

                if(index === 0){
                    angular.forEach(rowDataSet,function(value,idx){
                        tableHeaders.push(value); // data to be shown in table header
                    });
                    dhisService.tableHeaders = tableHeaders; // set table headers in controller
                }else{
                    tableRowData.push(rowDataSet); // data to be shown in table row
                                        
                    $key = rowDataSet[1];
                    $value = rowDataSet[0];
                    
                    if(angular.isDefined(rowDataSet[3])){
                        ou_Name = rowDataSet[3];
                        ou_Name =  ou_Name.trim();
                        orgUnits[ou_Name] = ou_Name;    
                    }
                    
                    if(angular.isDefined(rowDataSet[1]) && angular.isDefined(rowDataSet[0])){
                        dataElementMap[$key] = $value;    
                    }                    
                }                
            } // end of for

            //$scope.$apply(function(){
                vm.tableHeaders = tableHeaders;
                vm.tableRowData = tableRowData;
                vm.isLoading = false;
                vm.isVisible = "gridVisible";
                dhisService.setDataElementObject(dataElementMap);
                dhisService.setTableRowData(vm.tableRowData);
                dhisService.setOU(orgUnits);
            //});
        }// end of processFileContentForDisplay

        function navigateToMapDataElements(){
            $state.go("mapDataElements");
        }


        function uploadFiles(file, errFiles){
            vm.isLoading = true; // to display loading image                        
            vm.selectedFile = file;
            var reader = new FileReader();

            reader.onloadend = function(event){
                fileContent = reader.result;
                //processFileContentForDisplay();                
            }
            if(vm.selectedFile){
                //console.log(" File Upload Pluggin ",vm.selectedFile);
                reader.readAsText(vm.selectedFile);
            }
        }
	} // end of 'dataElementsController'
})();