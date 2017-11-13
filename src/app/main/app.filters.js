(function(){
	'use strict';
	angular.module('DureDHIS').filter("handleSpecialCharaterOnTranslation",handleSpecialCharaterOnTranslation);

	handleSpecialCharaterOnTranslation.$inject = ["$i18next"];

	function handleSpecialCharaterOnTranslation($i18next){

		return function(keyString){
			
			var strArray = undefined;
			var separator = undefined;
			var translatedString = "";

			if(keyString.includes(":")){
				separator = ":";
				strArray = keyString.split(":");
			}

			if(angular.isDefined(strArray) && angular.isArray(strArray)){
				angular.forEach(strArray,function(value,index){
					value = value.trim();

					translatedString += $i18next.t(value);
					
					if(index !== strArray.length - 1){
						translatedString += ": ";	
					}
				});
			}else{
				translatedString = $i18next.t(keyString);
			}

			return translatedString;
		}
	}
})();