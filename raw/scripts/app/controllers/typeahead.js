/*!
// Filename: app/controllers/typeahead.js
// 
// Methods: init()
//			preSelectInstitution()
//			trySearch()
//
*/

define([
  // These are path alias that we configured in our bootstrap
  "jquery",
  "app/config",
  "vendor/mustache/mustache",
  "text",
  "vendor/bootstrap/typeahead",
  "text!templates/typeahead.mustache",
  "controllers/product",
  "controllers/org",
  "models/typeahead",
  "app/reset",
  "app/global",
  "controllers/messaging",
  "text!templates/typeahead-footer.mustache"
  ], function($,config, mustache, text, bsTypeahead, tmpTypeahead, c_product, c_org, m_typeahead, reset, global, c_messaging,tmpTypeaheadFoot){

  	var cCode = "";  

	// Prepares event handler for typeahead selection
	$(document).on('typeahead:selected', function(e, objInfo){
		var selInst = $('#autocomplete').val();

		// Do The Logic for the Organization type if organization was not already selected
		if (institution !== selInst){
			institution = selInst;
			reset.init("suborg");
			c_org.init(objInfo.InstitutionID, cCode);
			firstSearch = false;
			blockEnter = true;
			$(".autocomplete-wrap > .search-btn").addClass("set");
		}
	});


	$(document).on("click", ".search-btn", function(event){
		//console.log('* btn clicked');
		trySearch();
	});


	// Prepares event handler for search item selection
	$(document).on("click", ".search-item a", function(event){
		event.preventDefault();
		$('#autocomplete').val($(this).html());
		trySearch();
	});

	function init(countrySelect, regionSelect){
		// console.log('* running app/controllers/typeahead.js');
		cCode = countrySelect;

	    $('#autocomplete').off("keydown");
		// Apply typeahead functionality
		// https://github.com/twitter/typeahead.js

		// Waits for JSON to be returned
		$(".autocomplete-wrap > .loading").show();
		var dataPromise = m_typeahead.init(countrySelect, regionSelect);
		
		dataPromise.done(function(data){

			// Creating HTML for the type ahead footer
			var orgCount = {'orgCount' : data.length};
			//console.log(orgCount);
			tmp = getTemplate(tmpTypeaheadFoot,'#typahead-footer');
			var resultsFooter='';
			resultsFooter = mustache.render(tmp, orgCount);
		
			$('#autocomplete').typeahead('destroy').typeahead({
				valueKey: 'OrganizationName',
				local: data,
				footer: resultsFooter
			});


			// Storing and sorting data for later use
			instList = data;
			instList.sort(m_typeahead.orgNameSort);

			$('#autocomplete').removeAttr('disabled');
			$(".autocomplete-wrap > .loading").hide();

			//preSelectInstitution(data);

			// Detects Enter key press
			$('#autocomplete').on("keydown", function (e){
			
				// Update the number of results showing on Key Press
				setTimeout(function(){
					var autoSuggestions = $('.tt-suggestion').length;
					$('.typeahead-count-showing').html(autoSuggestions);
				},50);
			
				var enteredName = $('#autocomplete').val();
				if(e.keyCode == 13 && !blockEnter && enteredName.split(" ")[0].length !== 0 && enteredName !== institution){
					$('#autocomplete').blur();
					if(gaTracking){
						_gaq.push(["_trackEvent", "SchoolFinder", "Institution Search", "Enter"]);
					}
					// Global track
					if (typeof globalGa != "undefined" && typeof gaOpts != "undefined"){
						_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Institution Search", "Enter"]);
					}
					trySearch(true);
			    }
			});
		});
		
     	// End Init
	}

	function preSelectInstitution(data){
		if (setInstitution !== "" && setInstitution !== null){
			for (var i = 0; i < data.length; i++){
				if (data[i].OrganizationName === setInstitution){
					$("#autocomplete").val(setInstitution);
					trySearch(false);
					break;
				}
			}
		}
	}

	function trySearch(isEnter){
		// Default value for numProducts with ternary operator
		isEnter = typeof isEnter !== 'undefined' ? isEnter : false;

		var enteredName = $('#autocomplete').val();

		// Checking for actual input, and non-redundant search
		if (enteredName.split(" ")[0].length !== 0 && enteredName !== institution){

			// Hide dropdrown
			$(".tt-dropdown-menu").hide();

	        // Searches through schools to find a match to input value
	        var matchFound = false;

	        for(var i = 0; i < instList.length; i++){
	        	if (instList[i].OrganizationName.toLowerCase() === enteredName.toLowerCase()){
	        		institution = instList[i].OrganizationName;
					reset.init("suborg");
					c_org.init(instList[i].InstitutionID, cCode);
					firstSearch = false;
					matchFound = true;

					if (isEnter && gaTracking){
						_gaq.push(["_trackEvent", "SchoolFinder", "Institution Chosen", "Enter"]);
					}
					// Global track
					if (typeof globalGa != "undefined" && typeof gaOpts != "undefined"){
						_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Institution Chosen", "Enter"]);
					}

					$(".autocomplete-wrap > .search-btn").addClass("set");
	        		break;
	        	}
	        }

	        // Substring search
	    	if (matchFound !== true){
	    		var searchResults = m_typeahead.instSearch(enteredName);		        		

				firstSearch = false;
				reset.init("suborg");
				c_messaging.searchMsg(searchResults, enteredName);
	    	}
	    }

	    // Setting institution equal to last searched entry
	    institution = enteredName;
	}
	 	  
	
  // Return the above defined function so it can be called in the global global scope
  return {
	  init:init,
	  trySearch:trySearch
  };
  
});