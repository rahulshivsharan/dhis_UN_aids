(function(){
	'use strict';
	
	if(window.i18next){
		window.i18next
		.use(window.i18nextXHRBackend);

		
		window.i18next.init({
			debug: true,
			lng: 'fr', 
			fallbackLng: 'fr', 			
			backend: {
				loadPath: '/assets/locale/{{lng}}/{{ns}}.json'
			},
			useCookie: false,
			useLocalStorage: false
		}, function (err, t) {
			console.log('resources loaded');
		});	
	} // end of if

	


})();