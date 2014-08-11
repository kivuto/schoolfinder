/*!F
* 		Filename: app/views/country.js
*		Methods: init()
				 preSelectCountry()
*/

define([
  // These are path alias that we configured in our bootstrap
  "jquery",
  "app/config",
  "vendor/mustache/mustache",
  "text",
  "models/country",
  "text!templates/components.mustache",
  "text!templates/country.mustache",
  ], function($,config, mustache, text, m_country, tmpComponents, tmpCountry){
  // Above we passed all deps
  // They will be accessible in the global scope

  function init(){

	  // Init FOundation JS
	  // Disclaimer: I have no idea why it works here and not in lib/app/app.js
	 //$(document).foundation();

	 // Logic to determine which HTML elements to create
	   if(!$('#countryWrap').length){
		   create_append_country_list();
	   }else{
		   append_country_list();
	   }
	}

  	// Reset the variables used
	// Get the data from the model/country data() function
	// Set the template content from the app/config getTemplate() function
	// Combine the data with the template with mustache
	// Append the newly created HTML block to the dom

	function create_append_country_list(){
		var promise = m_country.countryApiCall();
			promise.success(function (data) {
			   var tmp = '';
			   var html = '';
			   var tmp =  getTemplate(tmpCountry,'#countryDropDown');	
		       html = mustache.render(tmp, {options: data});
		       $('.kcsf-content fieldset').append(html);
		       $('.country-list').trigger('change');
			   //preSelectCountry(data);
		})
	}
	   
	   
	function append_country_list(){
		var promise = m_country.countryApiCall();
		promise.success(function (data) {
		   var tmp = '';
		   var html = '';
		   var tmp =  getTemplate(tmpCountry,'#countryDropDownOptions');	
	       html = mustache.render(tmp, {options: data});
	       $('#country-list').append(html);
	    	//preSelectCountry(data);
	    })
	}

	function preSelectCountry(data){
		if (setCountry !== "" && setCountry !== null){
			for (var i = 0; i < data.length; i++){
				if (data[i].CountryName === setCountry){
					$(".countryList .current").html(setCountry);
					$("#country-list").children().removeClass("selected");
					$("#country-list li").each(function(){
						if ($(this).html() === setCountry){
							$(this).addClass("selected");
							$(this).trigger('click');
						}
					});
					break;
				}
			}
		}
	}

  // Return the above defined function so it can be called in the global global scope
  return {
	  init:init
  };

});