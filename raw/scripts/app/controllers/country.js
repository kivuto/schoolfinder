/*!
* 		Filename: app/controllers/country.js
*		Methods: init();
*/

define([
  // These are path alias that we configured in our bootstrap
  "jquery",
  "app/config",
  "vendor/mustache/mustache",
  "text",
/*  "models/country", */
  "views/country",
  "controllers/region",
  "app/global"
  ], function($,config, mustache, text, /* m_country, */ v_country, c_region, global){
  // Above we passed all deps
  // They will be accessible in the global scope

 	function init(){
 		// Do initial set up with view/country init();
	  	v_country.init();
	}
	
	// Add event listener for when the Country dropdown is changed
	// If the country has regions run the region dropdown script
	// If not create the search box or make it accessible

	$(document).on('click','#country-list option',function() {
		
	});

	$(document).on('change','#country-list',function() {
		//var lastCountry = $('#country-list .selected').text();
		var curSelect = $('#country-list option:selected');
	
		var currCountryCheck = curSelect.text();

		if(currCountryCheck !== 'Select your country' && country !== currCountryCheck && !curSelect.prop("disabled")){
			country = currCountryCheck;

			var countrySelect = curSelect.attr('data-value');
			c_region.init(countrySelect);
			$(".countryList").addClass("set");
			// Run the controllers/region init() Funct
		}else{
			// Do nothing
		}	
	});

  
  // Return the above defined function so it can be called in the global global scope
  return {
	  init:init
  };
 
});