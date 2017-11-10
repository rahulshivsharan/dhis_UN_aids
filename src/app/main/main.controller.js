(function(){
	'use strict';
	angular.module('DureDHIS').controller('mainController', mainController);

	mainController.$inject = ["$scope","$i18next","$timeout","$rootScope"];

	function mainController($scope,$i18next,$timeout,$rootScope){
		var vm = this;
		$scope.changeLang = changeLang;

		function changeLang(lng){
			console.log("Selected Language ",lng);
			$i18next.changeLanguage(lng);			
		}

		
		$timeout(function () {
			console.log('Force $digest!');
			$rootScope.$apply();
		});
		

	}// end of mainController
})();