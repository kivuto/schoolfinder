/*!
//	Filename: app/thirdparty/gat.js
//
//  - Sets up Google Analytics tracking
*/

var _gaq = _gaq || [];

if(gaTracking){
	if (document.URL.toLowerCase().indexOf(liveDomain.toLowerCase()) !== -1){
		_gaq.push(['othSchoolFinderUser._setAccount', gaLive]);
	}
	else{
		_gaq.push(['othSchoolFinderUser._setAccount', gaStage]);
	}
		_gaq.push(['othSchoolFinderUser._trackPageview']);

	// Global tracker alongside standard
	if (typeof globalGa != "undefined" && typeof gaOpts != "undefined"){
		_gaq.push(['othSchoolFinderGlobal._setAccount', globalGa]);
		_gaq.push(['othSchoolFinderGlobal._trackPageview']);
	}

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
}

// Global tracker alone
else if (typeof globalGa != "undefined" && typeof gaOpts != "undefined"){
	_gaq.push(['othSchoolFinderGlobal._setAccount', globalGa]);
	_gaq.push(['othSchoolFinderGlobal._trackPageview']);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
}