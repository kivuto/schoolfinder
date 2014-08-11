/*!
// Filename: app/models/product.js
// 
// Methods: init(), getNamedProducts(), getPublishedProducts(), getPricedProducts(), getRandProducts()
//	- Used to filter given array of product objects by given parameters, also gets JSON object
*/

define(['jquery'
	], function($){

	// Return getJSON call
	function init(prodUrl){
		return $.getJSON(prodUrl);
	}


	// Gets products based on given product names (array of names)
	function getNamedProducts(productList, productNames, numProducts){
		// Default value for numProducts with ternary operator
		numProducts = typeof numProducts !== 'undefined' ? numProducts : 0;

		var chosenItems = Array();
		var currIndex = 0;

		for (var i = 0; i < productNames.length; i++){
			if (numProducts > 0){
				if(currIndex == numProducts){
					break;
				}
			}
			for (var j = 0; j < productList.length; j++){
				if (numProducts > 0){
					if(currIndex == numProducts){
						break;
					}
				}
				if (productList[j].ProductMajorVersionName == productNames[i]){
					chosenItems[currIndex] = productList[j];
					currIndex++;
					break;
				}
			}
		}

		return chosenItems;
	}

	// Gets products based on given product names (array of name), matches loose search terms and fills remainder of products with random ones
	function getLooseNamedProducts(productList, keyWords, numProducts){
		// Default value for numProducts with ternary operator
		numProducts = typeof numProducts !== 'undefined' ? numProducts : 12;

		var selector;
		var tempProducts = productList.slice(0);
		var chosenItems = Array();
		var currIndex = 0;

		for (var i = 0; i < keyWords.length; i++){
			if (numProducts > 0){
				if(currIndex == numProducts){
					break;
				}
			}
			for (var j = tempProducts.length - 1; j >= 0; j--){
				if (numProducts > 0){
					if(currIndex == numProducts){
						break;
					}
				}
				if (tempProducts[j].ProductMajorVersionName.toLowerCase().indexOf(keyWords[i].toLowerCase()) !== -1){
					chosenItems[currIndex] = tempProducts[j];
					tempProducts.splice(j, 1);
					currIndex++;
				}
			}
		}

		// Filling remainder of array with random products
		if (chosenItems.length < numProducts){
			for (var i = chosenItems.length; i < numProducts; i++){

				// In case numProducts actually exceeds the length of the product list
				if (tempProducts.length > 0){
					selector = Math.floor(Math.random() * tempProducts.length);
					chosenItems[i] = tempProducts[selector];
					tempProducts.splice(selector, 1);
				}
				else{
					break;
				}
			}
		}

		// Check for lowest price of 0 if so set the formatted price to 'Free'
		for (var i = 0; i < chosenItems.length; i++){
				if (chosenItems[i].LowestPriceOfferingPriceUnformatted == 0){
					chosenItems[i].LowestPriceOfferingPriceFormatted = 'Free'
				}
			}

		return chosenItems;
	}

	// Gets products based on publisher name
	function getPublishedProducts(productList, publisherName, numProducts){
		// Default value for numProducts with ternary operator
		numProducts = typeof numProducts !== 'undefined' ? numProducts : 0;

		var chosenItems = Array();
		var currIndex = 0;

		for (var i = 0; i < productList.length; i++){
			if (numProducts > 0){
				if(currIndex == numProducts){
					break;
				}
			}
			if (productList[i].ProducerOrganizationName == publisherName){
				chosenItems[currIndex] = productList[i];
				currIndex++;
			}
		}

		return chosenItems;
	}

	// Gets products based on given maximum price
	function getPricedProducts(productList, maxPrice, numProducts){
		// Default value for numProducts with ternary operator
		numProducts = typeof numProducts !== 'undefined' ? numProducts : 12;

		var tempProducts = productList.slice(0);
		var chosenItems = Array();
		var currIndex = 0;

		tempProducts.sort(priceSort);
		
		for (var i = 0; i < numProducts && i < tempProducts.length; i++){
			if (tempProducts[i].LowestPriceOfferingPriceUnformatted <= maxPrice){
				chosenItems[i] = tempProducts[i];
			}
			else{
				break;
			}
		}

		return chosenItems;
	}

	// Sorting function by price (lowest price goes to front of array)
	function priceSort(a, b){
		if (a.LowestPriceOfferingPriceUnformatted < b.LowestPriceOfferingPriceUnformatted){
			return -1;
		}
		else if (a.LowestPriceOfferingPriceUnformatted > b.LowestPriceOfferingPriceUnformatted){
			return 1;
		}
		return 0;
	}

	// Gets a specific number of products (essentially) randomly from a list of products
	function getRandProducts(productList, numProducts){
		// Default value for numProducts with ternary operator
		numProducts = typeof numProducts !== 'undefined' ? numProducts : 12;

		var tempProducts = productList.slice(0);
		var selector;
		var chosenItems = Array();
		
		for (var i = 0; i < numProducts; i++){

			// In case numProducts actually exceeds the length of the product list
			if (tempProducts.length > 0){
				selector = Math.floor(Math.random() * tempProducts.length);
				chosenItems[i] = tempProducts[selector];
				tempProducts.splice(selector, 1);
			}
			else{
				break;
			}
		}

		return chosenItems;
	}

	// Return functions for access on global scope
	return 	{ 	
				init:init,
				getNamedProducts:getNamedProducts,
				getPublishedProducts:getPublishedProducts,
				getPricedProducts:getPricedProducts,
				getRandProducts:getRandProducts,
				getLooseNamedProducts:getLooseNamedProducts
			};

});