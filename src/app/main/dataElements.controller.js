(function(){
	'use strict'

	angular.module('DureDHIS').controller("dataElementsController",dataElementsController);

	dataElementsController.$inject = ["$scope","dhisService","dataCache","$state","$q","$uibModal","_"];

	function dataElementsController($scope,dhisService,dataCache,$state,$q,$uibModal,_){
		console.log("'dataElementsController' is initialised");

		var vm = this;        

        // public variables
		vm.isVisible = "gridHidden";		
        vm.isLoading = false; // flag to display loading image
        vm.tableHeaders = []; // contains table headers
        vm.tableRowData = []; // contains row data i.e. and array of array [[],[]... ]        
        vm.selectedFile = undefined; // map to file Object for file uploader        
        vm.dataElementsMap = undefined;
        vm.orgUnitMap = undefined;
        vm.tRowData = undefined; // holds firt 20 dataElements row data of vm.tableRowData; its to be displayed on UI for fast rendering
        vm.showError = false;  
        
		// private methods
        var handleFileSelect = handleFileSelect;         

        // private variables
        var fileContent = undefined;
        
		
		// public methods 
        vm.gotBackTo = gotBackTo; 
        vm.navigateToMapDataElements = navigateToMapDataElements;
        vm.initDataElements = initDataElements;
        vm.uploadFiles = uploadFiles;
        vm.processFileContentForDisplay = processFileContentForDisplay;

        //////////////////// mapDataElements ////////////////////////

        // public variables
        vm.mapDE_COC = undefined; // map of DataElements(DE) and CategoryOptionCombo (COC)
        
        // this is key value where key is "(DE)Id_(COC)Id" and value is boolean flag
        // this map will be used to disable option while selection 
        vm.mapSelectionFlag = undefined; 

        // stores array of selected "(DE)Id_(COC)Id" as value
        vm.selectedValueList = undefined;

        // its a flag used as confirmation for Data-Elements-Mapping page
        // to display confirm button
        vm.isDataElementsMappingDone = false; 

        // public methods
        vm.initMapDataElements = initMapDataElements;
        vm.disableDE_COC_Options = disableDE_COC_Options;
        vm.remapDataElements = remapDataElements;
        vm.confirmDataElementsMapping = confirmDataElementsMapping;

        // private methods
        var loadCategoryOptionCombos = loadCategoryOptionCombos;
        var createDE_COC_Map = createDE_COC_Map;

        // private variables
        var oldNew_DE_Map = {};

        ////////////////////////////////////////////////////////////////////////////////////


        ////////////////////////////////// mapOrgUnits //////////////////////////////////////

        // public methods
        vm.initMapOrgUnits = initMapOrgUnits;
        vm.loadAnOuLevel = loadAnOuLevel; // fetches a perticular OU Level object 
        vm.mapOuId = mapOuId; // this method is invoked on typeAhead select
        vm.goToRemapData = goToRemapData;

        // public variables
             
        vm.ouLevelList = undefined; // list displayed in OU level select box
        vm.selectedOULevel = "";
        vm.filteredOuList = []; // this list is feed in typeAhead as options        
        vm.mappedOrgUnits = undefined; // old organisationUnits to mapped to new organisationUnits (key,value)
        vm.isMappingTableForOrgUnitVisible = false; // this flag is used to display or hide the table for OrgUnit mapping's

        // private method
        var fetchSelectedOrgUnits = fetchSelectedOrgUnits; // fetch unique list of organisation Units to be replaced
        var fetchOrganisationLevels = fetchOrganisationLevels;
        var fetchOrganisationUnitTree = fetchOrganisationUnitTree;
        var copyOU = copyOU;
        var clearSelectedOU = clearSelectedOU; 
        var mapUnmappedOrgUnits = mapUnmappedOrgUnits;

        // private variables
        var mainOrgUnitsObj = undefined; // key-value pair of all OU, where key is ouId and value is OU object
        var completelistOfOU = undefined; // array of all organisationUnits
        var currentUserOrgRoots = undefined; 		
        var selectedLevelNo = undefined;

        /////////////////////////////////////////////////////////////////////////////////////
        // public methods
        vm.initMappedValues = initMappedValues;
        vm.importData = importData;

        // public variables
        vm.responseObject = undefined; // to be display in UI once data is imported
        vm.isDataImported = false; // this flag is used to hide and show table data
        

        // private methods
        var processData = processData;
        //////////////////////////////////// confirmMappedValues //////////////////////////////



        /////////////////////////////////////////////////////////////////////////////////////////

        function initDataElements(){
            vm.showError = false;
            
            /*
                the condition below is used to handle back button
                navigating back from step 'map data element' to
                step 'upload File' 
            */
            if(dataCache.getImportDataStep() !== "dataelement.uploadDataElements"){
                vm.tableHeaders = []; // contains table headers
                vm.tableRowData = []; // contains row data i.e. and array of array [[],[]... ]
                vm.tRowData = [];   
                vm.orgUnitMap = undefined;     
            }    
            
                   
        }

        

        function processFileContentForDisplay(){  
            vm.isLoading = true; // to display loading image
            //console.log(" in processFileContentForDisplay ",vm.isLoading);    
            var statements = undefined;    
            
            try{
                statements = fileContent.split("\n");
                vm.showError = false;
            }catch(e){
                vm.showError = true;
                vm.isLoading = false;
            }                 
            
            var rowData = undefined;
            var rowDataSet = undefined;
            var tableHeaders = [];
            var tableRowData = [];
            var $key = undefined;
            var $value = undefined;
            var orgUnits = {}; // create set of organisationUnits so that it holds unique organisationUnit names
            var ou_Name = "";
            var date = new Date();


            vm.dataElementsMap = {};
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
                                        
                    $key = rowDataSet[1]; // dataElementId
                    $value = rowDataSet[0]; // dataElementName
                    
                    // the below condition is a quick fix if dataElementId is space than key id dataELementName
                    if(angular.isDefined($key) && $key !== null && angular.isString($key) && $key.trim() === ""){
                        $key = rowDataSet[0].trim();
                    }
                    
                    if(angular.isDefined(rowDataSet[3])){
                        ou_Name = rowDataSet[3];
                        ou_Name =  ou_Name.trim();
                        orgUnits[ou_Name] = ou_Name;    
                    }
                    
                    if(angular.isDefined(rowDataSet[1]) && angular.isDefined(rowDataSet[0])){

                        // vm.dataElementsMap contains key-value pair
                        // where key is dataElementId and value is dataElementName
                        // the below condition checks if dataElementId 
                        // which is not blank space and is already present
                        // as key, if yes than append the reccurring key with Time string 
                        // so that the key is different
                        if(angular.isDefined(rowDataSet[1]) && (rowDataSet[1].trim() !== "") && ($key in vm.dataElementsMap)){
                           $key = $key +"^"+ date.getTime();
                        }
                        vm.dataElementsMap[$key] = $value; 
                    }                    
                }                
            } // end of for

            
            vm.tableHeaders = tableHeaders;
            vm.tableRowData = tableRowData;
            vm.tRowData = _.first(vm.tableRowData,20);
            vm.orgUnitMap = orgUnits;
            vm.isLoading = false;
            vm.isVisible = "gridVisible";                
            
        }// end of processFileContentForDisplay

        function navigateToMapDataElements(){            
            $state.go("dataelement.mapDataElements");
        }


        function uploadFiles(file, errFiles){                                    
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


        ////////////////////////////////////////// mapDataElements //////////////////////////////////

        function confirmDataElementsMapping(){
            vm.isDataElementsMappingDone = false;
            var modalInstance = $uibModal.open({
                animation : true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/main/modalConfirmDataElementsMapping.html',
                controller: 'modalConfirmDataElementsMappingController',
                controllerAs : 'vm'                
            });

            modalInstance.result.then(function (flag) {
                vm.isDataElementsMappingDone = flag;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
            
        } //end of confirmDataElementsMapping

        function initMapDataElements(){

            console.log("in init of 'mapDataElements' function");

            vm.isDataElementsMappingDone = false;

            if(angular.isUndefined(vm.tableRowData) || _.isNull(vm.tableRowData) || (_.isArray(vm.tableRowData) && vm.tableRowData.length === 0)){
                $state.go("home");    
            }

            vm.selectedValueList = [];

            for(var prop in vm.dataElementsMap){
                vm.selectedValueList.push("");
            }

            //console.log("loading combos");
            loadCategoryOptionCombos();
            
        } // end of initMapDataElements

        function loadCategoryOptionCombos(){
            var promiseTwo = dhisService.getCategoryOptionCombos();
            var promiseOne = dhisService.getDataElements('filter=name:ilike:HIV%20Den');
            var success = success, error = error;

            $q.all([promiseOne,promiseTwo]).then(success,error);

            function success(values){
                
                var dataElementsList = values[0]["dataElements"];
                var categoryOptionComboList = values[1]["categoryOptionCombos"];

                //console.log("dataElementsList ",dataElementsList);
                //console.log("categoryOptionComboList ",categoryOptionComboList);
                createDE_COC_Map(dataElementsList,categoryOptionComboList);

                //console.log("vm.mapDE_COC ",vm.mapDE_COC);
            } // end of success

            function error(values){
                 console.log("error ",values);
            } // end of error

        } // end of loadCategoryOptionCombos

        // this method creates a key-Value pair where 
        // key is (DE)Id_(COC)Id and value is Label(DE)_Label(COC)
        function createDE_COC_Map(deList,cocList){
            var index1 = 0, index2 = 0, de = undefined, coc = undefined, key = undefined, value = undefined;

            vm.mapDE_COC = {};
            vm.mapSelectionFlag = {};
            
            for(index1 = 0; index1 < deList.length; index1++){
                for(index2 = 0; index2 < cocList.length; index2++){
                    de = deList[index1];
                    coc = cocList[index2];
                    key = de["id"] + "_" + coc["id"];
					var cocDisplayName = "";
					cocDisplayName = coc["displayName"];
					if(cocDisplayName == "default")
					{
						cocDisplayName = "Male+Female";
					}
					
					value = de["displayName"] + "_" + cocDisplayName;
					if(key == "PjLBZcVwRnr_LwoUpOaVGnN")
					{
							value = de["displayName"];
					}					
					if(key == "PjLBZcVwRnr_OmL59ldRIVV" || key == "PjLBZcVwRnr_HllvX50cXC0")
					{
						// Do nothing
						//PjLBZcVwRnr_OmL59ldRIVV
					}
					else
					{
						
						vm.mapDE_COC[key] = value;
						vm.mapSelectionFlag[key] = false; 
					}
                }
            } 
        } // end of createDE_COC_Map

        // this method is invoked on change event of selection box
        // present in mapDataElements.html
        function disableDE_COC_Options(idx,oldDataElementId){
            //console.log("Selected Value ",vm.selectedValueList[idx]," map to ",oldDataElementId);
            var selectedValue = vm.selectedValueList[idx], 
                index = 0,
                key = undefined,
                prop = undefined;

            vm.mapSelectionFlag[selectedValue] = true;
            oldNew_DE_Map[oldDataElementId] = selectedValue;

            for(prop in vm.mapSelectionFlag){
                if(!_.contains(vm.selectedValueList,prop)){
                    vm.mapSelectionFlag[prop] = false;
                }
            } // end of for
        } // end of disableDE_COC_Options


        function remapDataElements(){
            //console.log("oldNew_DE_Map ",oldNew_DE_Map);
            //console.log("vm.mapDE_COC ",vm.mapDE_COC);
            
            angular.forEach(vm.tableRowData,function(rowData,index){
                var oldDEId = rowData[1];
                var new_de_coc_value = undefined;
                
                // the below condition is a quick fix if dataElementId is space than key id dataELementName
                if(angular.isDefined(oldDEId) && oldDEId !== null && angular.isString(oldDEId) && oldDEId.trim() === ""){
                    oldDEId = rowData[0].trim();
                    new_de_coc_value = oldNew_DE_Map[oldDEId];
                }else{
                    new_de_coc_value = oldNew_DE_Map[oldDEId];
                }
                
                var new_COC_ID = undefined;
                rowData[0] = vm.mapDE_COC[new_de_coc_value];

                if(angular.isDefined(new_de_coc_value)){ //DEID_COCID 
                    rowData[1] = new_de_coc_value.split("_")[0]; // DEID 
                    new_COC_ID = new_de_coc_value.split("_")[1]; // COCID   
                }
                
                
                if(angular.isDefined(rowData[0]) && angular.isDefined(new_COC_ID)){
                    rowData[4] = {
                        "label" : rowData[0].split("_")[1],
                        "value" : new_COC_ID
                    };  // COC_label
                }               
                                
            });
            
            
            $state.go("dataelement.mapOrgUnits");
        } // end of remapData

        ///////////////////////////////////////////////////////////////////////////////////


        ////////////////////////////////// mapOrgUnits //////////////////////////////////////

        function initMapOrgUnits(){  

            if(angular.isUndefined(vm.tableRowData) || _.isNull(vm.tableRowData) || (_.isArray(vm.tableRowData) && vm.tableRowData.length === 0)){
                $state.go("home");    
            }

            fetchSelectedOrgUnits();            
            fetchOrganisationLevels();
            fetchOrganisationUnitTree();            
        }// end of init
        
        // fetch unique list of organisation Units to be replaced
        function fetchSelectedOrgUnits(){            
            vm.mappedOrgUnits = {};
            
            angular.forEach(vm.orgUnitMap,function(value,key){
                vm.mappedOrgUnits[key] = {
                    "label" : "",
                    "value" : ""
                }   
            });         
        } // end of fetchSelectedOrgUnits

        function fetchOrganisationLevels(){
            var success = success, error = error;
            dhisService.getOrgUnitLevels().then(success,error);

            function success(response){
                vm.ouLevelList = response["organisationUnitLevels"];
                //console.log(response["organisationUnitLevels"]);
            }

            function error(response){
                console.log(response);
            }
        } // fetchSelectedOrgUnits

        function fetchOrganisationUnitTree(){
            var success = success, error = error;
            
            dhisService.getOrgUnitsTree().then(success,error);

            function success(response){
                mainOrgUnitsObj = response["organisationUnits"];
                completelistOfOU = _.values(mainOrgUnitsObj);  
				currentUserOrgRoots	= response["roots"];			
            }

            function error(response){
                console.log(response);
            }
        } // end of fetchOrganisationUnitTree

        

        // this method is invoked on change of select box of
        // organisation levels in organisation Units mapping step
        function loadAnOuLevel(){
            var success = success,
                error = error;
            
            vm.isMappingTableForOrgUnitVisible = (vm.selectedOULevel !== "" && !_.isNull(vm.selectedOULevel)) ? true : false;

            if(vm.selectedOULevel !== "" && !_.isNull(vm.selectedOULevel)){
                clearSelectedOU(); // clear all selected OrganisationUnits
                dhisService.getAnOrgUnitLevel(vm.selectedOULevel).then(success,error);  
            }
            

            function success(response){
                selectedLevelNo = response["level"];
                var filteredOuList = _.where(completelistOfOU,{ "l" : selectedLevelNo });
                
                //console.log("filteredOuList ",filteredOuList);
                //console.log("currentUserOrgRoots ",currentUserOrgRoots);

                
				// var filteredOuListByUser = _.filter(filteredOuList, function (obj) {
				// 	return _.contains(currentUserOrgRoots,obj.id);
				// });
				//console.log(filteredOuListByUser);
				
                // vm.filteredOuList = filteredOuListByUser;
                

                vm.filteredOuList = filteredOuList; 
            } // end of success

            function error(response){
                console.log(response);
            }
        } // end of loadAnOuLevel

        function clearSelectedOU(){
            angular.forEach(vm.mappedOrgUnits,function(value,key){
                value["label"] = "";
                value["value"] = "";
            });
        }

        // this method is invoked on typeAhead select
        function mapOuId($item, $model, $label, $event,key){
            vm.mappedOrgUnits[key]["value"] = $item["id"];          
        }

        // this method is responsible to map those organisationUnits 
        // which are not been mapped to new values.
        // Here it gets the value mapped to previous Organisation Unit and assigns 
        // to the current one.
        function mapUnmappedOrgUnits(){
            var prevOuName = undefined, index = 0;
            for(var ouName in vm.mappedOrgUnits){
                
                if(index > 0){

                    if(vm.mappedOrgUnits[ouName]["label"] === "" || vm.mappedOrgUnits[ouName]["value"] === ""){
                       vm.mappedOrgUnits[ouName]["label"] = vm.mappedOrgUnits[prevOuName]["label"];
                       vm.mappedOrgUnits[ouName]["value"] = vm.mappedOrgUnits[prevOuName]["value"]; 
                    } 

                } // end of if

                prevOuName = ouName;
                index++;
            } // end of for
        } // end of mapUnmappedOrgUnits

        // this will be invoked on click of 'next' button,
        // navigate  to next page to display
        // the newly mapped dataelements and orgUnits
        function goToRemapData(){
            //mapUnmappedOrgUnits(); // copy previous dataElements
            //console.log("Navigate to next page "+JSON.stringify(vm.mappedOrgUnits));             
            $state.go("dataelement.confirmMappedValues");
        } // end of goToRemapData



        /////////////////////////////////////////////////////////////////////////////////////


        ///////////////////////////////// confirmMappedValues //////////////////////////////
        function initMappedValues(){            
            vm.isLoading = false;   
            vm.tRowData = _.first(vm.tableRowData,20);

            if(angular.isUndefined(vm.tableRowData) || _.isNull(vm.tableRowData) || (_.isArray(vm.tableRowData) && vm.tableRowData.length === 0)){
                $state.go("home");    
            }
            
        }

        function importData(){
            vm.isDataImported = false;
            vm.isLoading = true; // show loading image
            
            var data = processData();
            var success = success, error = error;
            

            dhisService.importDataElements(data).then(success,error);

            function success(response){
                //console.log(response);
                vm.responseObject = {};
                vm.isDataImported = true;
                vm.isLoading = false;
                vm.responseObject["status"] = response["status"];
                vm.responseObject["importCount"] = response["importCount"];
                vm.responseObject["conflicts"] = response["conflicts"];
            }

            function error(response){
                console.log(response);
            }
        } // end of importData

        function processData(){
            var data = {
                "dataValues" : []
            };

            angular.forEach(vm.tableRowData,function(rowData,index){
                var dataValueObject = {}, 
                    dataElementId = undefined, 
                    period = undefined,
                    orgUnitLabel = undefined,
                    categoryOptionsComboId = undefined,
                    value = undefined;

                if(angular.isDefined(rowData[1])){
                    dataValueObject["dataElement"] = rowData[1];    
                }
                
                if(angular.isDefined(rowData[2])){
                    dataValueObject["period"] = rowData[2];
                }
                
                if(angular.isDefined(rowData[3])){
                    orgUnitLabel = rowData[3].trim();                    
                    dataValueObject["orgUnit"] = vm.mappedOrgUnits[orgUnitLabel]["value"];  
                }
                
                if(angular.isDefined(rowData[4])){
                    dataValueObject["categoryoptioncombo"] = rowData[4]["value"];
                }
                
                if(angular.isDefined(rowData[6])){
                    dataValueObject["value"] = parseInt(rowData[6]);    
                }
                
                data.dataValues.push(dataValueObject);
            });

            return data;
        } // end of processData
        ///////////////////////////////////////////////////////////////////////////////////


        function gotBackTo(stateName){   
            dataCache.setImportDataStep(stateName);         
            $state.go(stateName);
        }
	} // end of 'dataElementsController'
})();