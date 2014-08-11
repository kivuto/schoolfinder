/*!
// Filename: app/views/messaging.js
// 
// Methods: init(), showResults()
//	- Determines appropriate messaging given conditions, and writes to DOM
*/

define(["jquery",
	"vendor/mustache/mustache",
	"text",
	"text!templates/messaging.mustache",
	"app/config"
	], function($, mustache, text, tmpl, config){

	function init(orgType, data, parentObj){

		// console.log('* Org Type is: ' + orgType);

		var caseTmpl = "";

		if(orgType === 'single-auth'){
			caseTmpl = $(tmpl).filter('#singleAuth').html();
		}
		else if(orgType === 'single-open'){
			caseTmpl = $(tmpl).filter('#singleOpen').html();
		}
		else if (orgType === 'parent-auth'){
			caseTmpl = $(tmpl).filter('#parentAuth').html();
		}
		else if (orgType === 'parent-open'){
			caseTmpl = $(tmpl).filter('#parentOpen').html();
		}
		else if (orgType === 'sub-pmvs'){
			caseTmpl = $(tmpl).filter('#subPMVs').html();
		}
		else if (orgType === 'suborg-empty-parent'){
			caseTmpl = $(tmpl).filter('#parentChildNo').html();
		}
		else if(orgType === 'suborg-open'){
			if (parentObj != null){
				caseTmpl = $(tmpl).filter('#parentChildOpen').html();
			}
			else{
				caseTmpl = $(tmpl).filter('#singleOpen').html();
			}
		}
		else if(orgType === 'suborg-auth'){
			if (parentObj != null){
				caseTmpl = $(tmpl).filter('#parentChildAuth').html();
			}
			else{
				caseTmpl = $(tmpl).filter('#singleAuth').html();
			}
		}
		else if(orgType === 'k12eStore'){
			caseTmpl = $(tmpl).filter('#k12eStore').html();
		}
		else if(orgType === 'single-affiliated'){
			caseTmpl = $(tmpl).filter('#single-affiliated').html();
		}
		else if(orgType === 'single-filtered'){
			caseTmpl = $(tmpl).filter('#single-filtered').html();
		}

		// If its k12 use k12 if it's eStore use eStore
		else if(orgType === 'defaultk12'){
				caseTmpl = $(tmpl).filter('#defaultk12').html();
		}else if(orgType === 'defaultOTH'){
				caseTmpl = $(tmpl).filter('#defaultOTH').html();
		}
		else{
			caseTmpl = $(tmpl).filter('#singleNoWebstore').html();
			data = $("#autocomplete").val();
		}

		var messagingHtml = "";
		if ((orgType === 'suborg-open' || orgType === 'suborg-auth' || orgType === 'suborg-empty-parent') && parentObj != null){

			// Set up UTM tags to append
			var utmTags = utmStr + "&utm_source=" + encodeURIComponent(data.WebStoreName);
			var parUtms = utmStr + "&utm_source=" + encodeURIComponent(parentObj.WebStoreName);

			messagingHtml = mustache.render(caseTmpl, { options: data, parent: parentObj, utm: utmTags, partags: parUtms});
		}
		else{

			// Set up UTM tags to append
			var utmTags = utmStr;
			if (data.WebStoreName != undefined){
				utmTags += "&utm_source=" + encodeURIComponent(data.WebStoreName);
			}
			else{
				utmTags += "&utm_source=onthehub-estore";
			}
			
			
			messagingHtml = mustache.render(caseTmpl, { options: data, utm: utmTags });
		}

		$("#messaging").html(messagingHtml);
	}

	function showResults(searchResults, subString){

		var searchHtml = "";

		// Set up UTM tags to append
		var utmTags = utmStr + "&utm_source=onthehub-estore";

		if (searchResults.length > 0){
			var searchTmpl = $(tmpl).filter('#search').html();
			searchHtml = mustache.render(searchTmpl, { options: searchResults, queryString: subString, utm: utmTags });
		}
		else{
			var failTmpl = $(tmpl).filter('#failedSearch').html();
			searchHtml = mustache.render(failTmpl, { queryString: subString, utm: utmTags });
		}

		$("#messaging").html(searchHtml);
	}

	return {
		init:init,
		showResults:showResults
	};

});