/*!F
* 		Filename: app/models/country.js
*		Methods: data();
*		
*		This model is used to collect the API data and return it
*/

define([
  "jquery"
  ], function($){

  function apiRegion(country){
	  return $.ajax({
	  	dataType: 'jsonp',
	      url: apiURL+"provinces?countryCode=" + country
	  });
  }	    	
  
  // Return all the functions
  return {
	  apiRegion: apiRegion
  };
  
});