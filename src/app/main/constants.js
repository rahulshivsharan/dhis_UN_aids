(function(){
	'use strict'
	angular.module("DureDHIS").value("DHIS_BACKEND","http://localhost:8187"); // development
	
	/*
	angular.module("DureDHIS").config(function($provide){
		$provide.decorator("DHIS_BACKEND",function($delegate,$window){
			
			var paths = $window.location.pathname.split("/");
			var contextPath = "";
			
			if(angular.isDefined(paths) && paths !== null && angular.isArray(paths) && paths.length > 0){
				
				
				for(var x = 0; x < paths.length; x++){
					
					if(paths[x].trim() === "api"){
						break;
					}

					if(paths[x].trim() !== ""){
						contextPath += "/" + paths[x]; 	
					}	
				} // end of for
				

				
			} // end of if-condition

			return contextPath;
		});
	});*/
		
})();