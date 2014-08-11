/*!
// Filename: app/controllers/org.js
// 
// Methods: init()
//
*/

define(["jquery",
	"models/org",
    "controllers/orgtype",
    "controllers/messaging",
    "controllers/suborg",
    "controllers/product",
    "app/reset"
	], function($, m_org, c_orgtype, c_messaging, c_suborg, c_product, reset){

	function init(orgId, cCode){
		// console.log('* Running app/controllers/org.js');

		// Getting JSONP object from given URL
		var promise = m_org.init(orgId, cCode);
		$(".autocomplete-wrap > .loading").show();

		// On success, use data
		promise.success(function(data){
			reset.init("messaging");

			//console.log(orgId);
			//console.log(cCode);
			//console.log(data);

			// Get organization type, and act accordingly
			var orgType = c_orgtype.init(orgId, data);

			if (orgType === "multiple"){
				c_suborg.init(orgType, data, orgId, cCode);
			}
			else if (orgType === "single-auth"){
				c_messaging.init(orgType, data);
			}
			else if (orgType === "single-open"){
				c_messaging.init(orgType, data[0]);
				c_product.init(data[0]);
			}
			else if (orgType === "single-affiliated"){
				c_messaging.init(orgType, data[0]);
			}
			else if (orgType === "defaultk12"){
				c_messaging.init(orgType, data);
				// c_product.customPmvLoader(sfConfig.k12EstoreId);
			}
			else{
				c_messaging.init(orgType, data);
				c_product.customPmvLoader(sfConfig.othEstoreId);
			}

			$(".autocomplete-wrap > .loading").hide();
		});
	}

	// Returning function for access on global scope
	return {
	  init:init
	};

});
