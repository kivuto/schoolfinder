//Filename: app/controllers/region.js

define([
  // These are path alias that we configured in our bootstrap
  "jquery",
  "app/config",
  "vendor/mustache/mustache",
  "text",
  "text!templates/components.mustache",
  "text!templates/region.mustache",
  "models/region",
  "views/region",
  "controllers/typeahead",
  "app/reset",
  "app/global"
  ], function($,config, mustache, text, tmpComponents, tmpRegion, m_region, v_region, c_typeahead, reset, global){
  
  	// Handles region selection
  	$(document).on('change','#region-list',function() {
  	
		var currRegion = $('#region-list :selected');
  	
		var regionTxt = $(currRegion).text();
		var regionSelect = $(currRegion).attr('data-value');
		var countrySelect = $('#country-list :selected').attr('data-value');
		if (countrySelect === "NULL"){
			countrySelect = entryCountry;
		}
		if( regionTxt !== 'Select your State/Province' && regionTxt !== ' ' && region !== regionTxt && !$(currRegion).prop("disabled")){
			region = regionTxt;
			reset.init("typeahead");
			c_typeahead.init(countrySelect, regionSelect);
			$(".region-list").addClass("set");
		}
	});

  	function init(countrySelect){

		if(countrySelect === 'Select your country'){ // check for already configed val
	   		return false;	// dont do it
   		}else{
		var promise = m_region.apiRegion(countrySelect);
		promise.success(function (data) {
			reset.init("region");
		   if(data!=''){
		   		// Reset and visually initialize region
				v_region.init(data);
				$(".region-list").attr("disabled",false);
				$('.region-list').focus();
		  	}else{
		  		// Make the region blank and disable it
		  		$('#region-list').html('');
		  		$('#region-list').prop('disabled', true);
		  		// $('.region-list .current').text('');
		  		reset.init("typeahead");
				c_typeahead.init(countrySelect);
			}
	  	});

  	}

}						
  
  // Return the above defined function so it can be called in the global global scope
  return {
	  init:init
  };

});