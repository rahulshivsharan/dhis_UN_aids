(function(){
	'use strict';
	angular.module('DureDHIS').controller('mainController', mainController);

	mainController.$inject = ["$scope","$i18next","$timeout","$rootScope","dhisService","$q"];

	function mainController($scope,$i18next,$timeout,$rootScope,dhisService,$q){
		var vm = this;
		vm.init = init;
		vm.changeLang = changeLang;


		function changeLang(lng){
			var setupMetadataList = "160px",
				setupMetadataAnchor = "160px",
				UploadDataFileList = "205px",
				UploadDataFileAnchor = "188px",
				AssociateDataElementList = "250px",
				AssociateDataElementAnchor = "230px",
				AssociateOrgUnitsList = "256px",
				AssociateOrgUnitsAnchor = "240px",
				ImportDataList = "200px",
				ImportDataAnchor = "165px";

			console.log("Selected Language ",lng);
			$i18next.changeLanguage(lng);

			if(lng === "en"){
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

			else if(lng === "es"){
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