/*!F
* 		Filename: app/views/suborg.js
*		Methods: init()
*/

define([
  // These are path alias that we configured in our bootstrap
  "jquery",
  "app/config",
  "vendor/mustache/mustache",
  "text",
  "text!templates/suborg.mustache",
  ], function($,config, mustache, text, tmpSuborg){
  
  
  function init(orgType, data){
    
     //   console.log(' * Running app/views/suborg.js');
		
	   var subOrgs = new Array();
        
		var tmp='';
		tmp = getTemplate(tmpSuborg, '#suborg-block');
		// Apply the Template to the DOM
		var html='';
		html = mustache.render(tmp, {options: data});
		$('#suborg-list').html(html);
    
    if (!disableSub){
      $('#suborg-row').show();
    }

    $("#suborg-list li").each(function(){
      if ($(this).html() === suborg){
        $(this).addClass("selected");
      }
    });

//		$('#suborg-list').empty().html(html);
//		$('.region-list .current').text('Select your State/Province');
	}
	
  //end init()


  // Return the above defined function so it can be called in the global global scope
  return {
	  init:init
  };

});