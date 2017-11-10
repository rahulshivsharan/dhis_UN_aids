(function(){
	'use strict';
	angular.module('DureDHIS').controller('mainController', mainController);

	mainController.$inject = ["$scope","$i18next","$timeout","$rootScope","dhisService","$q"];

	function mainController($scope,$i18next,$timeout,$rootScope,dhisService,$q){
		var vm = this;
		vm.init = init;
		vm.changeLang = changeLang;


		function changeLang(lng){
			console.log("Selected Language ",lng);
			$i18next.changeLanguage(lng);			
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