/*
 * Specific handler for checkout actions
 *
 */

 // Dependencies
 var _data = require('../data');
 var config = require('../config');
 var tokenHelper = require('../helpers/token');
 var genericHelper = require('../helpers/generic');
 var orderHelper = require(./order);

 // Define the checkoutHandler
 var checkoutHandler = {};

 // Checkout
 checkoutHandler.checkout = function(data, callback){
   var acceptableMethods = ['post'];
   if(acceptableMethods.indexOf(data.method) > -1){
     checkoutHandler._checkout[data.method](data,callback);
   } else {
     callback(405);
   }
 }

 // Container for the checkout submethod
 checkoutHandler._checkout = {};

 // Checkout - post
 // Required data on header: token, userIdentifier
 // Required data on payload: token
 // Optional data: none
 checkoutHandler._checkout.post = function(data, callback){
   // Get tokenId and userIdentifier from header
   var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
   var userIdentifier = typeof(data.headers.userid) == 'string' ? data.headers.userid : false;

   if(token && userIdentifier){
     tokenHelper.verifyToken(token, userIdentifier, function(tokenIsValid){
       if(tokenIsValid){

         // Let's get the stripe token from the body
         var stripeToken = typeof(data.payload.stripeToken) == 'string' && data.payload.stripeToken.trim().length > 0 ? data.payload.stripeToken : false;

         if(stripeToken){
           _data.read('users', userIdentifier, function(err, userData){
             // Let's calculate the total amount of the order based on the shopping cart items
             if(!err && userData && userData.shoppingcart.length > 0){

               var totalPrice = 0;
               userData.shoppingcart.forEach(function(itemName, i){
                 _data.read('menuitems', itemName, function(err, itemData){
                    if(!err && itemData)
                    {
                      totalPrice += itemData.price;
                      if(++i == userData.shoppingcart.length){
                        var stripeRequestObject = {
                            amount: (totalPrice*100),
                            currency: 'usd',
                            description: userData.name+'_'+Date.now(),
                            source: stripeToken
                        };

                        genericHelper.sendRequest('https',
                          443,
                          'api.stripe.com',
                          'POST',
                          '/v1/charges',
                          'application/x-www-form-urlencoded',
                          'Bearer ' + config.stripe.secretApiKeyTest,
                          5,
                          stripeRequestObject,
                            function(err, data){
                              if(!err && data.status == 'succeeded'){
                                // Since checkout is complete, time to place an order in the system and email the user.


                                callback(200, data);
                              }else{
                                callback(400, {'Error': 'There was an error processing your order'});
                              }
                            });
                      }
                    } else {
                      callback(400, {'Error': 'There was an error getting the data of the item '+ itemName+' in the system.'});
                    }
                 });
               });
             } else {
                callback(400, {'Error': 'In order to make an order you need to add items on the shopping cart.'});
             }
           });
         } else {
           callback(400, {'Error': 'Invalid or empty stripe token, please try again.'});
         }
       } else {
         callback(403, {'Error': 'Missing required token in header, or token is invalid. Please try to login again.'});
       }
     });
   } else {
     callback(403, {'Error': 'Missing required token in header or userIdentifer. Please try again.'});
   }
 };

 module.exports = checkoutHandler;
