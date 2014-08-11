/*!
// Filename: app/controllers/gatevent.js
//
// Methods: init()
//	- Manages Google Analytics events by adding multiple event handlers
//	- Note: Enter key press submits events manually (see controllers/typeahead) until better solution may be found
*/

define(["jquery",
	"app/thirdparty/gat",
	"app/global",
	"app/config"
	], function($, gat, global, config){

	function init(){

		if(gaTracking){

			// Tracks country selection
			$(document).on('click','#country-list li',function() {
				var currCountryCheck = $(this).text();
				if(currCountryCheck !== 'Select your country' && ga_country !== currCountryCheck && !$(this).hasClass("disabled")){
					ga_country = currCountryCheck;
					_gaq.push(["othSchoolFinderUser._trackEvent", "SchoolFinder", "Country Select", currCountryCheck]);

					// Global track
					if (typeof globalGa != "undefined" && typeof gaOpts != "undefined"){
						_gaq.push(['othSchoolFinderGlobal._trackEvent', gaOpts, "Country Select", currCountryCheck]);
					}
				}
			});

		  	// Tracks region selection
		  	$(document).on('click','#region-list li',function() {
				var regionTxt = $(this).text();
				if( regionTxt !== 'Select your State/Province' && regionTxt !== ' ' && ga_region !== regionTxt && !$(this).hasClass("disabled")){
					ga_region = regionTxt;
					_gaq.push(["othSchoolFinderUser._trackEvent", "SchoolFinder", "Region Select", regionTxt]);

					// Global track
					if (typeof globalGa != "undefined" && typeof gaOpts != "undefined"){
						_gaq.push(['othSchoolFinderGlobal._trackEvent', gaOpts, "Region Select", regionTxt]);
					}
				}
			});

			// Tracks typeahead selection
			$(document).on('typeahead:selected', function(e, objInfo){
				var selInst = $('#autocomplete').val();

				if (ga_institution !== selInst){
					ga_institution = selInst;
					_gaq.push(["othSchoolFinderUser._trackEvent", "SchoolFinder", "Institution Search", "Typeahead"]);
					_gaq.push(["othSchoolFinderUser._trackEvent", "SchoolFinder", "Institution Chosen", "Typeahead"]);
					_gaq.push(["othSchoolFinderUser._trackEvent", "SchoolFinder", "Institution Select", selInst]);

					// Global track
					if (typeof globalGa != "undefined" && typeof gaOpts != "undefined"){
						_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Institution Search", "Typeahead"]);
						_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Institution Chosen", "Typeahead"]);
						_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Institution Select", selInst]);
					}
				}
			});

			// Tracks search button click
			$(document).on("click", ".search-btn", function(event){

				var enteredName = $('#autocomplete').val();

				// Checking for actual input, and non-redundant search
				if (enteredName.split(" ")[0].length !== 0){
					_gaq.push(["othSchoolFinderUser._trackEvent", "SchoolFinder", "Institution Search", "Button"]);

					// Global track
					if (typeof globalGa != "undefined" && typeof gaOpts != "undefined"){
						_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Institution Search", "Button"]);
					}
				}
				
			});

			// Tracks search item selection (clicking on link in search result)
			$(document).on("click", ".search-item a", function(event){
				var chosenName = $(this).html()

				_gaq.push(["othSchoolFinderUser._trackEvent", "SchoolFinder", "Institution Chosen", "SearchItem"]);
				_gaq.push(["othSchoolFinderUser._trackEvent", "SchoolFinder", "Institution Select", chosenName]);

				// Global track
				if (typeof globalGa != "undefined" && typeof gaOpts != "undefined"){
					_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Institution Chosen", "SearchItem"]);
					_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Institution Select", chosenName]);
				}
			});

			// Tracks suborg selection
			$(document).on("click", "#suborg-list li", function() {
			  	var selectedSuborg = $(this).text();

				if (ga_suborg !== selectedSuborg){
				    ga_suborg = selectedSuborg;
				    _gaq.push(["othSchoolFinderUser._trackEvent", "SchoolFinder", "SubOrganization Select", selectedSuborg]);

					// Global track
					if (typeof globalGa != "undefined" && typeof gaOpts != "undefined"){
						_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "SubOrganization Select", selectedSuborg]);
					}
			  	}
			});

			// Tracks WebStore link click
			$(document).on("click", "#messaging .msg-wrap p:not(.search-item) a", function(event){
				event.preventDefault();
				var instName = $(this).attr("title");

				if (instName){
					_gaq.push(["othSchoolFinderUser._trackEvent", "SchoolFinder", "WebStoreLink Click", instName]);

			  		// Global track
					if (typeof globalGa != "undefined" && typeof gaOpts != "undefined"){
						_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "WebStoreLink Click", instName]);
					}
				}

				var targetUrl = $(this).attr("href");

				// Wait, then send to URL
			  	setTimeout(function(){
			  		// window.location.href = targetUrl;
			  		top.window.location = targetUrl;
			  	}, 250);
			});


			// Tracks product (and More) link click
			$(document).on("click", "#pmv-list > li > div > a", function(event) {
				event.preventDefault();

			  	// If See More
			  	if($(this).parent().parent().hasClass("more-li")){
			  		var instName = $(this).parent().attr("title");
			  		_gaq.push(["othSchoolFinderUser._trackEvent", "SchoolFinder", "More Click", instName]);

			  		// Global track
					if (typeof globalGa != "undefined" && typeof gaOpts != "undefined"){
						_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "More Click", instName]);
					}
			  	}
			  	// If product link
			  	else{
			  		var prodName = $(this).children(".title").html();
			  		_gaq.push(["othSchoolFinderUser._trackEvent", "SchoolFinder", "Product Click", prodName]);

			  		// Global track
					if (typeof globalGa != "undefined" && typeof gaOpts != "undefined"){
						_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Product Click", prodName]);
					}
			  	}

			  	var targetUrl = $(this).attr("href");

			  	// Wait, then send to URL
			  	setTimeout(function(){
			  		// window.location.href = targetUrl;
			  		top.window.location = targetUrl;
			  	}, 250);
			});
		}

		// Global trackers alone
		else if (typeof globalGa != "undefined" && typeof gaOpts != "undefined"){

			// Tracks country selection
			$(document).on('click','#country-list li',function() {
				var currCountryCheck = $(this).text();
				if(currCountryCheck !== 'Select your country' && ga_country !== currCountryCheck && !$(this).hasClass("disabled")){
					ga_country = currCountryCheck;
					_gaq.push(['othSchoolFinderGlobal._trackEvent', gaOpts, "Country Select", currCountryCheck]);
				}
			});

		  	// Tracks region selection
		  	$(document).on('click','#region-list li',function() {
				var regionTxt = $(this).text();
				if( regionTxt !== 'Select your State/Province' && regionTxt !== ' ' && ga_region !== regionTxt && !$(this).hasClass("disabled")){
					ga_region = regionTxt;
					_gaq.push(['othSchoolFinderGlobal._trackEvent', gaOpts, "Region Select", regionTxt]);
				}
			});

			// Tracks typeahead selection
			$(document).on('typeahead:selected', function(e, objInfo){
				var selInst = $('#autocomplete').val();

				if (ga_institution !== selInst){
					ga_institution = selInst;
					_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Institution Search", "Typeahead"]);
					_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Institution Chosen", "Typeahead"]);
					_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Institution Select", selInst]);
				}
			});

			// Tracks search button click
			$(document).on("click", ".search-btn", function(event){

				var enteredName = $('#autocomplete').val();

				// Checking for actual input, and non-redundant search
				if (enteredName.split(" ")[0].length !== 0){
					_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Institution Search", "Button"]);
				}
				
			});

			// Tracks search item selection (clicking on link in search result)
			$(document).on("click", ".search-item a", function(event){
				var chosenName = $(this).html()

				_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Institution Chosen", "SearchItem"]);
				_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Institution Select", chosenName]);
			});

			// Tracks suborg selection
			$(document).on("click", "#suborg-list li", function() {
			  	var selectedSuborg = $(this).text();

				if (ga_suborg !== selectedSuborg){
				    ga_suborg = selectedSuborg;
				    _gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "SubOrganization Select", selectedSuborg]);
			  	}
			});

			// Tracks WebStore link click
			$(document).on("click", "#messaging .msg-wrap p:not(.search-item) a", function(event){
				event.preventDefault();
				var instName = $(this).attr("title");

				if (instName){
					_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "WebStoreLink Click", instName]);
				}

				var targetUrl = $(this).attr("href");

				// Wait, then send to URL
			  	setTimeout(function(){
			  		// window.location.href = targetUrl;
			  		top.window.location = targetUrl;
			  	}, 250);
			});


			// Tracks product (and More) link click
			$(document).on("click", "#pmv-list > li > div > a", function(event) {
				event.preventDefault();

			  	// If See More
			  	if($(this).parent().parent().hasClass("more-li")){
			  		var instName = $(this).parent().attr("title");
			  		_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "More Click", instName]);
			  	}
			  	// If product link
			  	else{
			  		var prodName = $(this).children(".title").html();
			  		_gaq.push(["othSchoolFinderGlobal._trackEvent", gaOpts, "Product Click", prodName]);
			  	}

			  	var targetUrl = $(this).attr("href");

			  	// Wait, then send to URL
			  	setTimeout(function(){
			  		// window.location.href = targetUrl;
			  		top.window.location = targetUrl;
			  	}, 250);
			});
		}
	}

	// Returning function for access on global scope
	return {
	  init:init
	};

});