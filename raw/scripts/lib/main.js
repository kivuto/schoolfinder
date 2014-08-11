//This is our main applicatoon boot loader or bootstrap
//here we are loading necessary scripts dependencies like
//jquery, jqm.config, mobile, text

// Creating paths variable
var tempPaths = {
        app: '../app',
        assets: '../assets',
        views: '../app/views',
        templates: '../app/templates',
        controllers: '../app/controllers',
        models: '../app/models',
        vendor: 'vendor',
        lib: '.',
        // jquery: "jquery-1.9.1"
    };

// Check for existing jQuery
;var jQuery = window.jQuery;
if (!jQuery) {
    // Set path to load local jQuery file
    console.log('* breakpoint: not already loaded');
    tempPaths.jquery = "jquery-1.9.1";
} else {
    console.log('* breakpoint: already loaded');
    // Register the current jQuery if one is already loaded
    define('jquery-1.9.1', [], function() { return jQuery; });
}

require.config({
    baseUrl: '//localhost/schoolfinder/Working/raw/scripts/lib/',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: tempPaths,
    // shim can be used to establish dependencies, and hence load order
    shim: {
       "vendor/foundation/foundation.min": ["jquery"],
       "app/thirdparty/gat": ["app/config"]
    },
    urlArgs: "bust=" +  (new Date()).getTime(),
    enforceDefine: false
});

/*// Wrap Mustache for AMD ?? Unsure if needed
define('mustache', ['libs/vendor/mustache/mustache'], function(){
    // Tell Require.js that this module returns a reference to Mustache
    return Mustache; // from global
});
//*/

//
// Loading all the neccessary scripts for the app
//
require(["jquery", "app/app"],
	function($, app) {
    $(function() {
        // Start up the application
        app.init();

    });
});
