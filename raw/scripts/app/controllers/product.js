/*!
// Filename: app/controllers/product.js
// 
// Methods: init(), checkImg(), eqHeight(), showOthPmv(), prodOver(), prodOut()
//	- Main controller for loading products, equalizes heights of product boxes following load, also pre-loads placeholder products
//	- Also handles hover over/out of products
*/

define(["jquery",
	"models/product",
	"views/product",
	"app/config",
	"vendor/mustache/mustache",
	"text",
	"text!templates/product.mustache"
	], function($, m_product, v_product, config, mustache, text, tmpl){

    // Setting block heights equal when possibly needed (on window resize)
    $(window).resize(function() {
    	eqHeight();
    });

    // Prepares event handler for hover of products
   	$(document).on("mouseenter", ".item-link", prodOver);
    $(document).on("mouseleave", ".item-link", prodOut);

	function init(data){
		// console.log('* Running app/controllers/product.js');

		// Writing products to array
		var products = new Array();
		for(var i = 0; i < data.ProductMajorVersions.length; i++){
			products[i] = data.ProductMajorVersions[i];
		}

		// Storing store/tracking information
		var encodedName = encodeURIComponent(data.WebStoreName);
		var storeInfo = {
			WebStoreUrl: data.WebStoreUrl,
			WebStoreName: data.WebStoreName,
			UtmTrack: utmStr,
			UtmStoreName: encodedName
		};		
		
		// Selecting/rendering products
		var renderArray = m_product.getLooseNamedProducts(products, featured);
		for (var i = 0; i < renderArray.length; i++){
			// Catching any errors if image data was not returned
			if (renderArray[i].SmallImageUrl == null){
				renderArray[i].SmallImageUrl = sfConfig.baseUrl + "img/no-boxshot.jpg";
			}
			else{
				renderArray[i].LargeImageUrl = renderArray[i].LargeImageUrl.replace("http:", "");
				renderArray[i].SmallImageUrl = renderArray[i].SmallImageUrl.replace("http:", "");
			}
			renderArray[i].OfferingListUrl = renderArray[i].OfferingListUrl.replace("http:", "");
		}
		v_product.init(renderArray, storeInfo);

		// Calculate heights once images have (presumably) loaded
		setTimeout(checkImg, 750);
		
		// Update AppState
		// sfAppState.action = 'previewing';
		// sfAppState.ready = true;
	}


	// Loads webstore specific products into the product preview pane
	function customPmvLoader(customId){
	
		var pmvPromise = m_product.init(apiURL + 'institutions/' + customId + '/webstores?countryCode=CAN&callback=?');
		pmvPromise.done(function(data){
			// Writing products to array
			var products = new Array();
			for(var i = 0; i < data[0].ProductMajorVersions.length; i++){
				products[i] = data[0].ProductMajorVersions[i];
			}

			// Storing store information
			var storeInfo = {
				WebStoreUrl: data[0].WebStoreUrl,
				WebStoreName: data[0].WebStoreName,
				UtmTrack: utmStr,
				UtmStoreName: "onthehub-estore"
			};

			// Selecting/rendering products
			var renderArray = m_product.getLooseNamedProducts(products, featured);
			v_product.init(renderArray, storeInfo);

			// Calculate heights once images have (presumably) loaded
			setTimeout(checkImg, 750);
			
		});

		// Update AppState
		sfAppState.action = 'previewing';
		sfAppState.ready = true;
		
		// Adding a call to a SPECIAL function when the finder is being loaded as an iframe (on the same domain only)
		// The Function 'sfIsReady' MUST be found in the parent in the same domain to work
		if (typeof(parent.sfIsReady) === "function") { 
			parent.sfIsReady();
		}
	}

	// Checks to see if all product images have been loaded
	function checkImg(){
		var allLoaded = true;

		// Checking each image for dimensions
		$("#pmv-list > li > div > a > img").each(function(){
			if ($(this).height() > 0 && $(this).width() > 0){
				// Image is loaded with dimensions, proceed
			}
			else{
				allLoaded = false;
			}
		});

		// If all images are loaded, equalize the heights of the product panes
		if (allLoaded){
			eqHeight();
		}
		else{
			// Schedule another check
			setTimeout(checkImg, 750);
		}

	}

	// Equalizes height of product panes
	function eqHeight(){
		var maxHeight = 0;

		// Finding maximum height
		$("#pmv-list > li > div").each(function(){
			if ($(this).height() > maxHeight){
				maxHeight = $(this).height();
			}
		});

		// In event of bug, set minimum allowable height
		if (maxHeight < 135){
			maxHeight = 135;
		}

		// Setting heights
		$("#pmv-list > li > div").each(function(){
			$(this).height(maxHeight);
		});
	}

	// Manages hover states of product pane
	function prodOver(){
		$(this).children(".item-hover").fadeIn(200, "swing", false);
	}
	function prodOut(){
		$(this).children(".item-hover").fadeOut(200, "swing", false);
	}


	// Returning function for access on global scope
	return {
	  init:init,
	  eqHeight:eqHeight,
	  prodOver:prodOver,
	  prodOut:prodOut,
	  customPmvLoader:customPmvLoader
	};

});
