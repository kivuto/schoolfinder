/*!
* 		Filename: app/models/country.js
*		Methods: data();
*		
*		This model is used to collect the API data and return it
*/

define([
  "jquery",
  ], function($){

 
  function countryApiCall(){
	  return $.ajax({
	  	dataType: 'jsonp',
	    url: apiURL+"countries"
	  });
  }	    	
  
  return {
	  countryApiCall: countryApiCall
  };
  
});