/*!
//	Filename: app/controllers/suborg.js
//
// Methods: init()
//  - Manages sub organization selection
*/

define([
  // These are path alias that we configured in our bootstrap
  "jquery",
  "app/config",
  "views/suborg",
  "controllers/product",
  "models/org",
  "controllers/messaging",
  "app/reset",
  "app/global"
  ], function($,config, v_suborg, c_product, m_org, c_messaging, reset, global){
  
    function init(orgType, data, orgId, cCode){
      //*
	  // orgType = 'multiple' should be passed in this situation
	  // data = the object containing the suborganizations
	  // 	[action] this would be a good place to rmove the parent from the object
	  // orgId = the institution ID of the parent
	  // cCode = Country code for calls to the API 
	  //*/
      
      
      console.log('* Data :');
      console.log(data);
      console.log('Parent orgId : ');
      console.log(orgId);
      
      //*
      // Confirm the parent org is in the returned results along with the subOrgs
      // Assign the parents name and create an object with it's data
      //*/
      var parentOrg = "";
      var parentObj = null;
      for(var i = 0; i < data.length; i++){
          if(data[i].InstitutionID == orgId){
              parentObj = data[i];
              parentOrg = parentObj.WebStoreName;
			  break;
          }
      }
      
	    // If the was found in the array, show it's products and select on dropdown
        if (parentObj !== null){
            if(parentObj.AllowUnauthenticatedBrowsing === true && parentObj.ProductMajorVersions !== null && parentObj.ProductMajorVersions.length !== 0){
            	console.log('Parent has things to show');
                c_messaging.init('parent-open', parentObj);
                c_product.init(parentObj);
            }
            else{
            	console.log('auth | or length 0');
                c_messaging.init('parent-auth', parentObj);
            }

            $('#suborg-list').siblings('.current').html(parentOrg);

	
			//* Incase the parentOrg is the first on the list of the subOrgs
			// we want to set it so that we dont do a second
			//*/ request for data we already have selected
            var suborg = parentOrg;
            ga_suborg = parentOrg;
        }
        else{
            $(".pmv-cover").show();
            $(".pmv-message").html("Select your departmental WebStore above to access exclusive software deals!");
            // $(".pmv-message").show();
            // c_product.customPmvLoader(sfConfig.othEstoreId);
        }

      //*
	  //	Make the Sub Org Drop Down
	  //*/
      v_suborg.init(orgType, data);
       
      $("#suborg-list").change( function() {
			
		  var currSub = $("#suborg-list :selected");
          var selectedSuborg = currSub.attr("data-id");
          var selectedSuborgName = currSub.val();	
			
          /*
          * Check if sub org is same as one selected
          */
          if (suborg !== selectedSuborg){
              suborg = selectedSuborg; // Change ID to the new selected org Id
              reset.init("messaging");
              $(".suborg-list").addClass("set");

			  // Start: Checking if parent was selected
              if (orgId === selectedSuborg && parentObj !== null){
                  if (parentObj.WebStoreUrl.length === 0){
     	             c_messaging.init('undefined', data[i]);
                     c_product.customPmvLoader(sfConfig.othEstoreId);
                  }
				  //*
				  // You've selcted the parent and we want to show it's data as a subOrg.
				  // So we do not discuss it's children
				  //*/
                  else if(parentObj.AllowUnauthenticatedBrowsing === true && parentObj.ProductMajorVersions !== null && parentObj.ProductMajorVersions.length !== 0){
                  	  console.log('* You\'ve selected the parent org and it has PMVs Available ')
                      c_messaging.init('sub-pmvs', parentObj);
                      c_product.init(parentObj);
                      console.log(parentObj);
                  }
                  else{
					console.log('* Assuming the again selected org does not allow un auth browsing');
					console.log('auth org')
					c_messaging.init('parent-auth', parentObj);
                  }
              } // End: Checking if parent was selected

              // Non-parent selected
              else{
                  for(var i = 0; i < data.length; i++){ // Start: Suborg for loop
					  /*
					  * Check how many org the response contains.
					  *	Make sure to select the correct Object.
					  */
					  
					 // Checking against both the name and the ID
 					 if(data[i].InstitutionID === selectedSuborg || data[i].WebStoreName === selectedSuborgName){ // Start : Check for selected org in API response
                      
	                      // @ Special Case
	                      // Custom check for k12 eStore schools which have unless 'child' orgs which are just affiliates. Not actual orgs. Because fo this we send the user hard coded k12 eStore data
	                      var k12eStoreTitle = 'Elementary and High School Teacher Discounts on Microsoft Office and Windows 8';
	                      // New If [action]
	                      // If there are more then two and k12 is one of them only link them to the other.....
	                      // If there is only one Use that...
	                      // If it's a k12 search and there are non then show the k12 one anyways and make it look like its the store for you
	                      
						  if(selectedSuborgName===k12eStoreTitle){ // @ Special case for k12 eStore
							    c_messaging.init('k12eStore', data[i], parentObj);
	                           // [action] - This isnt working because I cannot get the PMVs for it
	                            c_product.customPmvLoader(sfConfig.k12EstoreId);
	                            console.log('k12 sub');
	                            break;
	                      }
	                      else if (data[i].WebStoreUrl.length === 0){ // There is no webStore for this Org
	                          if (parentObj !== null){ // It has a parent with a webStore
	                          	  onsole.log('empty store show the parent');
	                              c_messaging.init('suborg-empty-parent', data[i], parentObj);
	                              c_product.init(parentObj);
	                              break;
	                          }
	                          else{ // Parent exists but has no webstore URL
	                          	  console.log('Parent exists but has no webstore URL')
	                              c_messaging.init('undefined', data[i]);
	                              c_product.customPmvLoader(sfConfig.othEstoreId);
	                              break;
	                          }
	                      }
	                      /*
	                      * If unauthenticated browsing is permitted on selected suborg and it is null.
	                      */
	                      else if(data[i].AllowUnauthenticatedBrowsing === true){ // Start : UnAuth is True
	                      // removeed :  && data[i].ProductMajorVersions === null to test
                        
	                        // Making New API call on subOrg Selected
	                        var promise = m_org.init(data[i].InstitutionID, cCode);
	                        $(".autocomplete-wrap > .loading").show();
	
	                        promise.success(function(subData){
	                            reset.init("messaging");
								
							/*
							* Make sure you select the selected org from the API response
							*/
								for(var i = 0; i < subData.length; i++){ // Start: New suborg for loop
									if(subData[i].InstitutionID === selectedSuborg || subData[i].WebStoreName === selectedSuborgName){
												
										if(subData[i].ProductMajorVersions === null){ // [action] Comes up null might need to do a third call if it can bring in the PMVs
											console.log('* PMVs came up null once again');
											break;
										}
										else if(subData[i].ProductMajorVersions.length === 0){ // No PMVs available for your selected sub org
											c_messaging.init('single-auth', subData[i]);
											console.log('* No PMVs available for your selected sub org');
											break;
											
										}else if(subData[i].ProductMajorVersions.length > 0){ // There are PMVs to display
											console.log('There are PMVs to display');
											c_messaging.init('sub-pmvs', subData[i]);
											c_product.init(subData[i]);
											break;
											
										}
										/*
										* We cannot find any sort of useful data on the sub org
										* so we are going to try to show the parent
										* Otherwise show the eStore (Big fail)
										*/
										else{
										    if (parentObj !== null){ // Try to show parent
										        c_messaging.init('suborg-empty-parent', data[i], parentObj);
										        c_product.init(parentObj);
										        break;
										    }   
										    else{ // [might want to make it dynamic to show k12 or eStore] Show eStore data
										        c_messaging.init('undefined', data[i]);
										        c_product.customPmvLoader(sfConfig.othEstoreId);
										        break;
										    }
										    break;
										}
									}
								}
								$(".autocomplete-wrap > .loading").hide();	
	                        });
	                      } // End : UnAuth is True
						  else if(data[i].AllowUnauthenticatedBrowsing === false){
		                      console.log('* The webStore does not allow unauth Browsing')
	                          c_messaging.init('suborg-auth', data[i], parentObj);
	                      }else{
		                      console.log('we\'ve lost you');
	                      }
	                      break;
                      } // End: Check for selected org in API response
                      else{
                      // The selected subOrg was not found in the response:
                      // [action] fail an send to eStore
                      console.log('* Org was not found in the org query. Please verify why this is'); 
                      } 
                  } // End : Suborg for loop
              }
          }
      });
	}
  
  	

  // Return the above defined function so it can be called in the global global scope
  return {
	  init:init
  }
  
//  console.log(country.test);
  
  // What we return here will be used by other modules
});