/*!F
* 		Filename: app/views/region.js
*		Methods: init()
				 preSelectRegion();
*/

define([
  // These are path alias that we configured in our bootstrap
  "jquery",
  "app/config",
  "vendor/mustache/mustache",
  "text",
  "text!templates/components.mustache",
  "text!templates/region.mustache",
  ], function($,config, mustache, text, tmpComponents, tmpRegion){
  // Above we passed all deps
  // They will be accessible in the global scope
  
  function init(data){
    // console.log(' * Running views/region init()');

	  // Get The Bare Template needed
	if(!$('.region-wrap').length){
		var tmp='';
		tmp = getTemplate(tmpRegion,'#region-drop-down');
		// Apply the Template to the DOM
		var html='';
		html = mustache.render(tmp, {});
		$('.kcsf-content form fieldset').append(html);
	}else{
		tmp = getTemplate(tmpRegion,'#region-drop-down-options');
		// Apply the Template to the DOM
		var html='';
		html = mustache.render(tmp, {options: data});
		$('#region-list').empty().html(html);
		$('.region-list .current').text('Select your State/Province');
	}
	//preSelectRegion(data);
  }
  //end init()

	function preSelectRegion(data){
		if (setRegion !== "" && setRegion !== null){
			for (var i = 0; i < data.length; i++){
				if (data[i].ProvinceName === setRegion){
					$(".region-list .current").html(setRegion);
					$("#region-list").children().removeClass("selected");
					$("#region-list li").each(function(){
						if ($(this).html() === setRegion){
							$(this).addClass("selected");
							$(this).trigger('click');
						}
					});
					break;
				}
			}
		}
	}


  // Return the above defined function so it can be called in the global global scope
  return {
	  init:init
  };

});