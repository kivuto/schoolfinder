/*!
// Filename: app/controllers/messaging.js
// 
// Methods: init()
//
*/

define(["jquery",
	"app/config",
	"vendor/mustache/mustache",
	"text",
	"views/messaging",
	"controllers/product"
	], function($, config, mustache, text, v_messaging, c_product){

	function init(orgType, data, parentObj){
		// console.log('* Running app/controllers/messaging.js')
		
		// Stores product information
		//console.log('* org Type is : ' + orgType);
		v_messaging.init(orgType, data, parentObj);
	}

	function searchMsg(searchResults, subString){
		v_messaging.showResults(searchResults, subString);
	}


	// Returning function for access on global scope
	return {
	  init:init,
	  searchMsg:searchMsg
	};


});
