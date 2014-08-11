/*!F
* 		Filename: app/utilities.js
*		Methods: getTemplate() - gets template HTML from mustache files
				 resetEl() - resets form elements
*/

/*
* Stream line simple template getting
*/
function getTemplate(templateObject, templateFilter){
  var tmp = '';
  tmp = $(templateObject).filter(templateFilter).html();
  return tmp;
}


/*
* Resetter function for when a parent input is changed that will affect it's children
*/

	// Example
	// resetEl(country, region, org, suborg);
    // resetEl('country');

function resetEl(country, region, org, suborg){
	
	// Makes all args options and sets to 'false' if not specified
	country = (typeof country === "undefined") ? false : country;
	region = (typeof region === "undefined") ? false : region;
	org = (typeof org === "undefined") ? false : org;
	suborg = (typeof suborg === "undefined") ? false : suborg;
	
	if(country){
		console.log('resetting the country');
	}
	
	if(region){
		console.log('resetting the country');
	}
	
	if(org){
		console.log('resetting the country');
	}
	
	if(suborg){
		console.log('resetting the country');
	}	
	
	
}


/*
* Console.log wraper for IE
*/
window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){console.log(Array.prototype.slice.call(arguments))}};
