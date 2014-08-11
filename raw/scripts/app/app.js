/*!
// Filename: app.js
//
//  - Initializes app
//
*/

define([
  // These are path alias that we configured in our bootstrap
  "jquery",
  "vendor/custom.modernizr",
  "app/config",
  "vendor/mustache/mustache",
/*   "vendor/bootstrap/bootstrap", */
  "text",
  "async",
  "vendor/foundation/foundation.min",
  "app/utilities",
  "text!templates/app-base.mustache",
  "controllers/country",
  "controllers/product",
  "app/thirdparty/gat",
  "controllers/gatevent",
  "controllers/region",
  "controllers/typeahead",
  "controllers/org",
  "app/thirdparty/fb"
  ], function($, modernizer, config, mustache, /* bootstrap,*/text, async, foundation, utilities, tmpAppBase, c_country, c_product, gat, gatevent, c_region, c_typeahead, c_org, fb){
  // Above we passed all deps

  $(document).foundation();

  // The following function is defined so that it is accessible by main.js when it is returned  
  function init(){  
    var tmp = '';
    tmp = $(tmpAppBase).filter('#app-base-full').html();
    html = mustache.render(tmp, {});
    //ani    tmp =  getTemplate(tmpAppBase,'#app-base-full');	
  	$('#oth-schoolfinder-wrapper').append(html);


  	// init selectbox fix
  	$(document).foundation();
	$('form.awesome select:not(.is-wrapped)')
	    .addClass('is-wrapped')
	    .wrap('<div class="custom dropdown select" />')
	    .after('<span class="selector"></span>');


    // Checks to display country/region/typeahead fields
    if(!disableSub){
      if (!disableInst){
        if (!disableRegion){
          if (!disableCountry){
            $("#countryWrap").css('display','block');
            $(".region-wrap").css('display','block');
            $(".autocomplete-wrap").css('display','block');
            $(".suborg-wrap").css('display','block');
          }
          else{
            $(".region-wrap").removeClass("large-6");
            $(".region-wrap").addClass("large-12");
            $(".region-wrap").css('display','block');
            $(".autocomplete-wrap").css('display','block');
            $(".suborg-wrap").css('display','block');
          }
        }
        else{
          $(".autocomplete-wrap").css('display','block');
          $(".suborg-wrap").css('display','block');
        }
      }
      else{
        $(".suborg-wrap").css('display','block');
      }
    }

    // Prepares user for wait if background loading needs to occur
    if (disableInst){
      $("#messaging").html('<div class="msg-wrap"><p>Please wait while we find the academically discounted software available to members of your institution.</p></div>');
      $(".pmv-cover").hide();
      $(".pmv-message").hide();
      $(".pmv-message").html("");
      firstSearch = false;
    }
    else{
      // Loads placeholder products
      c_product.customPmvLoader(sfConfig.othEstoreId);
    }

    // Run the appropriate init code, based on available information
    var fallThrough = true;
    if (typeof entrySub != "undefined" && typeof entryCountry != "undefined"){
      if (entrySub != "empty" && entryCountry != "empty"){
        c_org.init(entrySub, entryCountry);
        fallThrough = false;
      }
    }
    if (typeof entryInst != "undefined" && typeof entryCountry != "undefined" && fallThrough){
      if (entryInst != "empty" && entryCountry != "empty"){
        c_org.init(entryInst, entryCountry);
        fallThrough = false;
      }
    }
    if (typeof entryRegion != "undefined" && typeof entryCountry != "undefined" && fallThrough){
      if (entryRegion != "empty" && entryCountry != "empty"){
        c_typeahead.init(entryCountry, entryRegion);
        fallThrough = false;
      }
    }
    if (typeof entryCountry != "undefined" && fallThrough){
      if (typeof entryCountry != "empty"){
        c_region.init(entryCountry);
        fallThrough = false;
      }
    }
    if(fallThrough){
      c_country.init();
    }

    // Preparing Google Analytics events
    gatevent.init();
  }

  // Return the above defined function so it can be called in the global global scope
  return {
	  init:init
  };
  
  // What we return here will be used by other models
});