/*!
// Filename: app/models/suborg.js
// 
// Methods: init()
//
*/

define(["jquery","app/config"],function(e,t){function n(t,n){var r="";typeof userGroup!="undefined"&&userGroup!=""&&(r="UserGroupCode="+userGroup+"&");var i="";typeof programType!="undefined"&&programType!=""&&(i="ProgramCode="+programType+"&");var s=apiURL+"institutions/"+t+"/webstores?countryCode="+n+"&"+r+i+"callback=?";return e.getJSON(s)}return{init:n}});