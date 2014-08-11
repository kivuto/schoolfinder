/*!
// Filename: app/thirdparty/fb.js
//
//  - Sets up Facebook SDK
//
*/

window.fbAsyncInit = function() {
// init the FB JS SDK
FB.init({
  appId      : '129161770613719',                        // App ID from the app dashboard
  channelUrl : '//apps.onthehub/channel.html', // Channel file for x-domain comms
  status     : true,                                 // Check Facebook Login status
  xfbml      : true                                  // Look for social plugins on the page
});


  FB.Canvas.setAutoGrow();

};

// Load the SDK asynchronously
(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/all.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));