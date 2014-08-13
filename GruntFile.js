module.exports = function(grunt) {
	grunt.initConfig({
 	 removelogging: {
   	 dist: {
 	  src: "build/scripts/lib/main.js",
    	  dest: "build/scripts/lib/main-nolog.js",
   	   options: {
      	 	 // see below for options. this is optional.
      	   }
	  }
	 }	
	});
};

// Load the console log removed
grunt.loadNpmTasks("grunt-remove-logging");
