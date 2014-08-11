/*!
// Filename: app/controllers/orgtype.js
// 
// Methods: init()
//	- Identifies and returns organization type based on data given
//
*/

define(["jquery",
	"app/config"
	], function($, config){

	function init(orgId, data){
		var orgType= '';

		if(data.length > 1){
			// Multiple organization returned
			orgType="multiple";
			
		}else if(data.length === 1 && data[0].AllowUnauthenticatedBrowsing === false){
			// Single organization, hidden products - check if it is parent
			if (data[0].InstitutionID != orgId){
				orgType="multiple";
			}
			else{
				orgType="single-auth";
			}

		}else if(data.length === 1 && data[0].AllowUnauthenticatedBrowsing === true&&data[0].ProductMajorVersions === null){
			// Single Org and believe it to be the affiliated org of the originally searched org.
				orgType="single-affiliated";
		}else if(data.length === 1 && data[0].AllowUnauthenticatedBrowsing === true && data[0].ProductMajorVersions.length === 0){
			// The PMVs array was retutned but returned empty. We believe this to be because filters were set nothing was passed
			// [action]  - since this doesn't define an 'org type' but more a state of the org and also requires it's own form of messaging
			// I believe this called fot a new layer of messaging. 
			
			//
			// In the mean time I am going to et this to the same messaging and 'org type' as allow unauth viewing false. ince nothing will return anways.
			//
			orgType="single-filtered";
				
		}else if(data.length === 1 && data[0].AllowUnauthenticatedBrowsing === true && data[0].ProductMajorVersions.length !== 0){
			// Single organization, visible products - check if it is parent
			if (data[0].InstitutionID != orgId){
				orgType="multiple";
			}
			else{		
				orgType="single-open";
			}
			
		}else{
			// In all other cases we send them to a default webStore with k12 or OnTheHub eStore
			// Unsure about the org type and know it doesn't have
			// a web store. We will point them to the k12 portal or
			// the OnTheHub eStore Depending on the education sector chosen
			if(instType === 'education_k_12'){
				orgType="defaultk12";
			}else{
				orgType="defaultOTH";
			}
		}
		return orgType;
	}

	// Returning function for access on global scope
	return {
	  init:init
	};

});
