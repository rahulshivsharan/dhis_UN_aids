(function(){
	'use strict';
	angular.module('DureDHIS').controller('mainController', mainController);

	mainController.$inject = ["$scope","$i18next","$timeout","$rootScope","dhisService","$q"];

	function mainController($scope,$i18next,$timeout,$rootScope,dhisService,$q){
		var vm = this;
		vm.init = init;
		vm.changeLang = changeLang;


		function changeLang(lng){
			var setupMetadataList = undefined,
				setupMetadataAnchor = undefined,
				UploadDataFileList = undefined,
				UploadDataFileAnchor = undefined,
				AssociateDataElementList = undefined,
				AssociateDataElementAnchor = undefined,
				AssociateOrgUnitsList = undefined,
				AssociateOrgUnitsAnchor = undefined,
				ImportDataList = undefined,
				ImportDataAnchor = undefined;

			console.log("Selected Language ",lng);
			$i18next.changeLanguage(lng);

			if(lng === "es"){ // if language is spanish
				// the below properties are css properties defined in main.less
				// used to adjust breadcrumb at language selection
				setupMetadataList = "160px";
				setupMetadataAnchor = "162px";
				UploadDataFileList = "230px";
				UploadDataFileAnchor = "214px";
				AssociateDataElementList = "250px";
				AssociateDataElementAnchor = "230px";
				AssociateOrgUnitsList = "292px";
				AssociateOrgUnitsAnchor = "275px";
				ImportDataList = "265px";
				ImportDataAnchor = "230px";
			}
			else if(lng === "fr"){ // if language is french
				// the below properties are css properties defined in main.less
				// used to adjust breadcrumb at language selection
				setupMetadataList = "165px";
				setupMetadataAnchor = "180px";
				UploadDataFileList = "230px";
				UploadDataFileAnchor = "214px";
				AssociateDataElementList = "260px";
				AssociateDataElementAnchor = "242px";
				AssociateOrgUnitsList = "292px";
				AssociateOrgUnitsAnchor = "275px";
				ImportDataList = "265px";
				ImportDataAnchor = "230px";
			}
			else if(lng === "pt"){ // if language is Portugues

				// the below properties are css properties defined in main.less
				// used to adjust breadcrumb at language selection
				setupMetadataList = "165px";
				setupMetadataAnchor = "180px";
				UploadDataFileList = "245px";
				UploadDataFileAnchor = "225px";
				AssociateDataElementList = "270px";
				AssociateDataElementAnchor = "250px";
				AssociateOrgUnitsList = "292px";
				AssociateOrgUnitsAnchor = "275px";
				ImportDataList = "265px";
				ImportDataAnchor = "230px";
			}
			else{ // if language is English				
				// the below properties are css properties defined in main.less
				// used to adjust breadcrumb at language selection
				setupMetadataList = "160px";
				setupMetadataAnchor = "160px";
				UploadDataFileList = "205px";
				UploadDataFileAnchor = "188px";
				AssociateDataElementList = "250px";
				AssociateDataElementAnchor = "230px";
				AssociateOrgUnitsList = "256px";
				AssociateOrgUnitsAnchor = "240px";
				ImportDataList = "200px";
				ImportDataAnchor = "165px";
			}

			less.modifyVars({
				"setupMetadataList" : setupMetadataList,
				"setupMetadataAnchor" : setupMetadataAnchor,
				"UploadDataFileList" : UploadDataFileList,
				"UploadDataFileAnchor" : UploadDataFileAnchor,
				"AssociateDataElementList" : AssociateDataElementList,
				"AssociateDataElementAnchor" : AssociateDataElementAnchor,
				"AssociateOrgUnitsList" : AssociateOrgUnitsList,
				"AssociateOrgUnitsAnchor" : AssociateOrgUnitsAnchor,
				"ImportDataList" : ImportDataList,
				"ImportDataAnchor" : ImportDataAnchor
			});			
		}

		/*
		$timeout(function () {
			console.log('Force $digest!');
			$rootScope.$apply();
		});
		*/
		
		function init(){
			$i18next.changeLanguage("es");			
			$i18next.changeLanguage("fr");
			$i18next.changeLanguage("pt");
			$i18next.changeLanguage("en");									
		} // end of init

	}// end of mainController
})();