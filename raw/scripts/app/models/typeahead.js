/*!
// Filename: app/models/typeahead.js
// 
// Methods: init(), orgNameSort(), instSearch()
//	- Assembles query and gets JSON, also searches through array for institutions based on substring
*/

define([
  // These are path alias that we configured in our bootstrap
  "jquery",
  "app/config"
  ], function($,config){
  

	  function init(countrySelect, regionSelect){
		// CHECK IF THE COUNTRY HAS A PROVINCE AND CREATE THE API QUERY ACCORDINGLY
		var subsector = "";
		if (typeof instType != "undefined"){
			if (instType != ""){
				subsector = '&subsectorCode=' + instType;
			}
		}
		if(regionSelect){
			var jsoncall = apiURL +'institutions?countryCode='+countrySelect+'&provinceCode='+regionSelect+subsector;
		}else{
			var jsoncall = apiURL +'institutions?countryCode='+countrySelect+subsector;
		}

		return $.getJSON(jsoncall+'&callback=?');
	}

	// Sorting function by organization name (ascending)
	function orgNameSort(a, b){
		var nameA = a.OrganizationName.toLowerCase();
		var nameB = b.OrganizationName.toLowerCase();
		if (nameA < nameB){
			return -1;
		}
		else if (nameA > nameB){
			return 1;
		}
		return 0;
	}

  	function instSearch(enteredName){
  		var results = Array();

	  	for(var i = 0; i < instList.length; i++){
	  		if (results.length < 5){
				if (instList[i].OrganizationName.toLowerCase().indexOf(enteredName.toLowerCase()) !== -1){
		    		results.push(instList[i]);
		    	}
		    }
		    else{
		    	break;
		    }
	    }

	    return results;
	}
	
  // Return the above defined function so it can be called in the global global scope
  return {
	  init:init,
	  orgNameSort:orgNameSort,
	  instSearch:instSearch
  };

});