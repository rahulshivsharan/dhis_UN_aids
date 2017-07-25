(function(){
	'use strict'

	angular.module('DureDHIS').controller("uploadDataElementsController",uploadDataElementsController);

	uploadDataElementsController.$inject = ["$scope","dhisService"]

	function uploadDataElementsController($scope,dhisService){
		console.log("'uploadDataElementsController' is initialised");

		var vm = this;
		vm.isVisible = "gridHidden";
		vm.isLoading = false;
		

		// private methods
        var handleFileSelect = handleFileSelect;
		
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
            
            if (target && target.files && target.files.length === 1) {
                
                var fileObject = target.files[0];              
                $scope.gridApi.importer.importFile(fileObject);
                target.form.reset();          
              
            }// end of if
        }; // end of 'handleFileSelect'

        function init(){
        	
        }

	} // end of 'uploadDataElementsController'
})();