/*!
//	Filename: app/controllers/suborg.js
//
// Methods: init()
//  - Manages reset of form inputs - resets specified input and all that are utilized after it
*/

define(["jquery", "app/global"], function($, global){
  
  	function init(element){
    		switch(element){
            case "region":
                $('#suborg-list').siblings('.current').html("Select your State/Province");
                $(".region-list").removeClass("set");
                $(".region-list").addClass("disabled");
                region = "";

      			case "typeahead":
      			 	 $('#autocomplete').typeahead('destroy');
    		   		 $('#autocomplete').attr('disabled', 'disabled');
               $('#autocomplete').val("");
               $(".autocomplete-wrap > .search-btn").removeClass("set");
               institution = "";

      			case "suborg":
      				  $('#suborg-row').hide();
      				  $('#suborg-list').html("");
                $('#suborg-list').siblings('.current').html("Select a sub organization");
                $(".suborg-list").removeClass("set");
                suborg = "";

      			case "messaging":
      				  $("#messaging").html("");
                // Hide cover and message (if it is not first search)
                if (firstSearch === false){
                    $(".pmv-cover").hide();
                    $(".pmv-message").hide();
                    $(".pmv-message").html("");
                    $("#pmv-list").html("");
                    $("#pmv-row").hide();
                }

                blockEnter = false;

      				  break;
    		}
  	}

  	return {
  		  init:init
  	};

});