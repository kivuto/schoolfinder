/***
//
// Configuration file for School Finder Web Application
// 
***/

//
//	Managed Variables
//

// App State
var sfAppState = {'action':'loading',
				'ready':false
				};

if (typeof(parent.sfiFrameHeight) === "function") {
	window.setInterval(function(){
		var sfHeight = $('.kcsf-wrap').height()
		parent.sfiFrameHeight(sfHeight);
		}, 250);
}	

// Important WebStore Ids
sfConfig.othEstoreId = '46817193-1960-4ce3-925c-8556e8dc7b93';
sfConfig.k12EstoreId = 'c1bd84e4-41b9-e111-ad8d-f04da23e67f6';

	
//
//	User managed variables with fall backs
//	

// API URL
if(sfConfig.apiURL!==null&&sfConfig.apiURL!==undefined&&sfConfig.apiURL!=='null'){
	var apiURL = sfConfig.apiURL;
}else{
	var apiURL = '//e5webservices.onthehub.com/data/v2/';
}



//
// To use for detection of staging/live app usage
//

// Google Analytics Tracking
if(sfConfig.gaTracking!==null&&sfConfig.gaTracking!==undefined&&sfConfig.gaTracking!=='null'){
	var gaTracking = sfConfig.gaTracking;
}else{
	var gaTracking = true;
}

// Live domain for tracking
if(sfConfig.liveDomain!==null&&sfConfig.liveDomain!==undefined&&sfConfig.liveDomain!=='null'){
	var liveDomain = sfConfig.gaTracking;
}else{
	var liveDomain = 'onthehub.com';
}

// Live GA code
if(sfConfig.gaLive!==null&&sfConfig.gaLive!==undefined&&sfConfig.gaLive!=='null'){
	var gaLive = sfConfig.gaLive;
}else{
	var gaLive = 'UA-2768482-19';
}

// Staging GA code
if(sfConfig.gaStage!==null&&sfConfig.gaStage!==undefined&&sfConfig.gaStage!=='null'){
	var gaStage = sfConfig.gaStage;
}else{
	var gaStage = 'UA-2768482-23';
}

// Global event tracking code
if(sfConfig.globalGa!==null&&sfConfig.globalGa!==undefined&&sfConfig.globalGa!=='null'){
	var globalGa = sfConfig.globalGa;
}else{
	var globalGa = 'UA-2768482-23';
}



//
// GA Options
//

// Event Label
if(sfConfig.gaOpts!==null&&sfConfig.gaOpts!==undefined&&sfConfig.gaOpts!=='null'){
	var gaOpts = sfConfig.gaOpts;
}else{
	var gaOpts = 'Schoolfinder | OTH-Custom';
}

// GA UTM tracking
if(sfConfig.utmStr!==null&&sfConfig.utmStr!==undefined&&sfConfig.utmStr!=='null'){
	var utmStr = sfConfig.utmStr;
}else{
	var utmStr = 'utm_campaign=oth-widgets&utm_medium=school-finder';
}



//
// Determine hidden fields, and as such point of entry into search process
//

// Disable Country Control
if(sfConfig.disableCountry!==null&&sfConfig.disableCountry!==undefined&&sfConfig.disableCountry!=='null'){
	var disableCountry = sfConfig.disableCountry;
}else{
	var disableCountry = false;
}

// Disable Region Control
if(sfConfig.disableRegion!==null&&sfConfig.disableRegion!==undefined&&sfConfig.disableRegion!=='null'){
	var disableRegion = sfConfig.disableRegion;
}else{
	var disableRegion = false;
}

// Disable Institution Control
if(sfConfig.disableInst!==null&&sfConfig.disableInst!==undefined&&sfConfig.disableInst!=='null'){
	var disableInst = sfConfig.disableInst;
}else{
	var disableInst = false;
}

// Disable Institution Control
if(sfConfig.disableSub!==null&&sfConfig.disableSub!==undefined&&sfConfig.disableSub!=='null'){
	var disableSub = sfConfig.disableSub;
}else{
	var disableSub = false;
}



//
// Create a set of data for entry into the app
//

// Set the entryCountry
if(sfConfig.entryCountry!==null&&sfConfig.entryCountry!==undefined&&sfConfig.entryCountry!=='null'){
	var entryCountry = sfConfig.entryCountry;
}

// Set the entryRegion
if(sfConfig.entryRegion!==null&&sfConfig.entryRegion!==undefined&&sfConfig.entryRegion!=='null'){
	var entryRegion = sfConfig.entryRegion;
}

// Set the entryInst
if(sfConfig.entryInst!==null&&sfConfig.entryInst!==undefined&&sfConfig.entryInst!=='null'){
	var entryInst = sfConfig.entryInst;
}

// Set the entrySub
if(sfConfig.entrySub!==null&&sfConfig.entrySub!==undefined&&sfConfig.entrySub!=='null'){
	var entrySub = sfConfig.entrySub;
}



//
// Used to implement configureable filtering
//

// Filter:  Institution Type
if(sfConfig.instType!==null&&sfConfig.instType!==undefined&&sfConfig.instType!=='null'){
	var instType = sfConfig.instType;
}

// Filte: UserGroups
if(sfConfig.userGroup!==null&&sfConfig.userGroup!==undefined&&sfConfig.userGroup!=='null'){
	var userGroup = sfConfig.userGroup;
}

// Filter: Program Code Filters
if(sfConfig.programType!==null&&sfConfig.programType!==undefined&&sfConfig.programType!=='null'){
	var programType = sfConfig.programType;
}

// Used to set products to feature in PMVs (a filter)
if(sfConfig.featured!==null&&sfConfig.featured!==undefined&&sfConfig.featured!=='null'){
	var featured = sfConfig.featured;
}else{
	var featured = ["Microsoft Office 2013",
				"Microsoft Office 2011 for Mac",
				"Office 365 Home Premium",
				"Office 365 University",
				"Microsoft Windows 8",
				"Parallels Desktop 8 for Mac",
				"IBM® SPSS® Statistics 21",
				"Minitab 16",
				"Microsoft Visual Studio 2012",
				"Microsoft Visio Professional 2013",
				"Vmware Workstation 9",
				"VMware Fusion 5",
				"Multisim v12 Student Edition",
				"EndNote X7",
				"Trend Micro Titanium Antivirus+ 2013"];
}


// Below line is used when building for oth-toolkit purposes.

var configVarPlaceholder;