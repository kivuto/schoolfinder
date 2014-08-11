({
    appDir: "../",
    baseUrl: "scripts/lib",
    dir: "../../build",

    paths: {
    	app: '../app',
    	config: '../app/config',
    	templates: '../app/templates',
        models: '../app/models',
        views: '../app/views',
        controllers: '../app/controllers',
        jquery: "jquery-1.9.1"
    },

    uglify: {
        reserved_names:"apiURL, gaTracking, liveDomain, gaLive, gaStage, globalGa, gaOpts, utmStr, disableCountry, disableRegion, disableInst, disableSub, entryCountry, entryRegion, entryInst, entrySub, instType, userGroup, programType, featured, firstSearch, instList, country, region, institution, suborg, ga_country, ga_region, ga_institution, ga_suborg, blockEnter"},
    
    // Eliminates combined files from output directory
    removeCombined: true,
    modules: [
        //Optimize the application files. jQuery is not 
        //included since it is already in require-jquery.js
        {
        	jquery: "jquery-1.9.1",
            name: "main"
        }
    ]
})
