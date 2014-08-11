/*!
// Filename: app/views/product.js
// 
// Methods: init()
//
*/

define(["jquery",
	"vendor/mustache/mustache",
	"text",
	"text!templates/product.mustache"
	], function($, mustache, text, tmpl){

	function init(renderArray, storeInfo){
		var moreHtml = "";
		var adobeHtml = "";

		// Create SEE MORE element
		// If there are too many products and the main URL is returned, then render
		if (renderArray.length >= 12 && storeInfo !== null){
			renderArray.pop();
			var moreTmp = $(tmpl).filter('#more').html();
			moreHtml = mustache.render(moreTmp, {options: storeInfo});
		}
		
		// Create Adobe CC HTML element - only if it is not already present
		/*
		
		REMOVED HARDCODING ADOBE CC AS IT WAS NO LONGETR RELIVANT
		
		var hasAdobeCC = false;
		for (var i = 0; i < renderArray.length; i++){
			if (renderArray[i].ProductMajorVersionName.toLowerCase() == "adobe creative cloud"){
				hasAdobeCC = true;
			}
		}
		if (!hasAdobeCC){
			renderArray.pop();
			var adobeTmp = $(tmpl).filter('#adobecc').html();
			adobeHtml = mustache.render(adobeTmp, {options: sfConfig.baseUrl + 'img/adobe-cc-boxshot.jpg'});
		}
		*/
		// Output products	
		var prodTmp = $(tmpl).filter('#product').html();
		var productsHtml = mustache.render(prodTmp, {options: renderArray, info: storeInfo});
		// productsHtml += adobeHtml;
		productsHtml += moreHtml;

	
		$("#pmv-list").html(productsHtml);
		$("#pmv-row").show();
		
	}

	return {
		init:init
	};

});