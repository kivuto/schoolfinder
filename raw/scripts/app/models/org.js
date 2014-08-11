/*!
// Filename: app/models/org.js
// 
// Methods: init()
//
*/

define(['jquery',
		"app/config"
	], function($, config){

	// Return getJSON call
	function init(orgId, cCode){
		var user = "";
		if (typeof userGroup != "undefined"){
			if (userGroup != ""){
				user = "UserGroupCode=" + userGroup + "&";
			}
		}
		var program = "";
		if (typeof programType != "undefined"){
			if (programType != ""){
				program = "ProgramCode=" + programType + "&";
			}
		}
		var orgURL = apiURL + 'institutions/' + orgId + '/webstores?countryCode=' + cCode + "&" + user + program + "callback=?";
		// console.log(orgURL);
		return $.getJSON(orgURL);
	}


	// Return functions for access on global scope
	return 	{ 	
		init:init
	};


});