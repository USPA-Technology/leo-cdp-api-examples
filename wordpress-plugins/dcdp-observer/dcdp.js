(function() {
    // (1) CDP EVENT OBSERVER: load JavaScript code

    if (typeof dcdpProfileInfo !== 'undefined') {
        // Observer ID
        window.leoObserverId = dcdpProfileInfo.observer_id || '';
        
        // CDN of JS
        window.leoObserverLogDomain = dcdpProfileInfo.observer_log_domain || '';

        if(window.leoObserverId.length === 0 || window.leoObserverLogDomain.length === 0) {
            return;
        }

        window.leoObserverCdnDomain = "cdn.jsdelivr.net/gh/USPA-Technology/leo-cdp-static-files@v0.8.9.27";
        
        // Data Touchpoint Metadata 
        window.srcTouchpointName = encodeURIComponent(document.title);
        window.srcTouchpointUrl = encodeURIComponent(location.href);

        // the main proxy CDP JS
        var leoproxyJsPath = '/js/leo-observer/leo.proxy.min.js';
        var src = location.protocol + '//' + window.leoObserverCdnDomain + leoproxyJsPath;
        var jsNode = document.createElement('script');
        jsNode.async=true; jsNode.defer=true; jsNode.src = src;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(jsNode, s);
    }
})();


var parseDataUTM = window.parseDataUTM || function () {
    if (location.search.indexOf('utm_') > 0) {
        var search = location.search.substring(1);
        var json = decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"');
        return JSON.parse('{"' + json + '"}');
    }
}
	
// (2) CDP EVENT OBSERVER: set-up all event tracking functions
var LeoObserver = {};

// (2.1) function to track View Event "AdImpression"
LeoObserver.recordEventAdImpression = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("ad-impression",eventData);
}

// (2.2) function to track View Event "PageView"
LeoObserver.recordEventPageView = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("page-view",eventData);
}

// (2.3) function to track View Event "AcceptTracking"
LeoObserver.recordEventAcceptTracking = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("accept-tracking",eventData);
}

// (2.4) function to track View Event "EngagedSession"
LeoObserver.recordEventEngagedSession = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("engaged-session",eventData);
}

// (2.5) function to track Action Event "Like"
LeoObserver.recordEventLike = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("like",eventData);
}

// (2.6) function to track View Event "ContentView"
LeoObserver.recordEventContentView = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("content-view",eventData);
}

// (2.7) function to track Action Event "Search"
LeoObserver.recordEventSearch = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("search",eventData);
}

// (2.8) function to track View Event "ItemView"
LeoObserver.recordEventItemView = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("item-view",eventData);
}

// (2.9) function to track Action Event "ClickDetails"
// LeoObserver.recordEventClickDetails = function(eventData) {
// 	eventData = eventData ? eventData : {};
// 	LeoObserverProxy.recordActionEvent("click-details",eventData);
// }

// (2.10) function to track Action Event "PlayVideo"
LeoObserver.recordEventPlayVideo = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("play-video",eventData);
}

// (2.11) function to track Action Event "SubmitContact"
LeoObserver.recordEventSubmitContact = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("submit-contact",eventData);
}

// (2.12) function to track Action Event "AdminView"
LeoObserver.recordEventAdminView = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("admin-view",eventData);
}

// (2.13) function to track Action Event "FileDownload"
LeoObserver.recordEventFileDownload = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("file-download",eventData);
}

// (2.14) function to track Action Event "RegisterAccount"
LeoObserver.recordEventRegisterAccount = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("register-account",eventData);
}

// (2.15) function to track Action Event "UserLogin"
LeoObserver.recordEventUserLogin = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("user-login",eventData);
}

// (2.16) function to track Action Event "ShortLinkClick"
LeoObserver.recordEventShortLinkClick = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("short-link-click",eventData);
}

// (2.17) function to track Action Event "AskQuestion"
LeoObserver.recordEventAskQuestion = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("ask-question",eventData);
}

// (2.18) function to track Action Event "ProductTrial"
LeoObserver.recordEventProductTrial = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("product-trial",eventData);
}

// (2.19) function to track Conversion Event "Purchase"
LeoObserver.recordEventPurchase = function(eventData, shoppingCartItems, transactionId, transactionValue, currencyCode) {
	// need 5 params
	eventData = typeof eventData === "object" ? eventData : {};
	shoppingCartItems = typeof shoppingCartItems === "object" ? shoppingCartItems : [];
	transactionId = typeof transactionId === "string" ? transactionId : "";
	transactionValue = typeof transactionValue === "number" ? transactionValue : 0;
	currencyCode = typeof currencyCode === "string" ? currencyCode : "USD";
	LeoObserverProxy.recordConversionEvent("purchase", eventData , transactionId, shoppingCartItems, transactionValue, currencyCode);
}

// (2.20) function to track Action Event "AddToCart"
LeoObserver.recordEventAddToCart = function(eventData) {
    eventData = eventData ? eventData : {};
    LeoObserverProxy.recordActionEvent("add-to-cart",eventData);
}

// (2.21) function to track Action Event "Dislike"
LeoObserver.recordEventRemoveLike = function(eventData) {
    eventData = eventData ? eventData : {};
    LeoObserverProxy.recordActionEvent("remove-like",eventData);
}

// (2.22) function to track Action Event "RemoveFromCart"
LeoObserver.recordEventRemoveFromCart = function(eventData) {
    eventData = eventData ? eventData : {};
    LeoObserverProxy.recordActionEvent("remove-from-cart",eventData);
}

// (2.23) function to track Action Event "UpdateCart"
LeoObserver.recordEventUpdateCart = function(shoppingCartItems) {
	shoppingCartItems = typeof shoppingCartItems === "object" ? shoppingCartItems : [];
    LeoObserverProxy.recordConversionEvent("update-cart", {} , "", shoppingCartItems, -1, "USD");
}



// (3) CDP EVENT OBSERVER is ready
function leoObserverProxyReady(session) {
   	// auto tracking when CDP JS is ready
   	LeoObserver.recordEventPageView(parseDataUTM()) ;
    
    // woocommerce tracking
    setUpWooCommerceTrackingEvents();
   	
   	// set tracking CDP web visitor ID into all a[href] nodes
	LeoObserverProxy.synchLeoVisitorId(function(vid){
		var aNodes = document.querySelectorAll('a');
		[].forEach.call(aNodes, function(aNode) {
			var hrefUrl = aNode.href || "";
            var check = hrefUrl.indexOf('http') >= 0 && hrefUrl.indexOf(location.host) < 0 ;
			if(check) {
				if(hrefUrl.indexOf('?') > 0) hrefUrl += ("&leosyn=" + vid);
				else hrefUrl += ("?leosyn=" + vid);
				aNode.href = hrefUrl;
			}
		});
		if(typeof window.synchLeoCdpToGA4 === "function") {
			window.synchLeoCdpToGA4(vid)
		}
	});

    // update user profile to CDP
    LeoObserver.updateProfile(dcdpProfileInfo.first_name, dcdpProfileInfo.last_name, dcdpProfileInfo.email, dcdpProfileInfo.phone);
}

// track users when they click any link in the web-page
LeoObserver.addTrackingAllLinks = function(){
    setTimeout(function(){
        document.querySelectorAll('a').forEach(function (e) {
            e.addEventListener('click',function(){
                var url = e.getAttribute('href') || "";
                var data = {'url': url, 'link-text' : e.innerText };
                LeoObserver.recordEventClickDetails(data)
            })
        })
    },1500);
}

// track users when they click any button in the web-page
LeoObserver.addTrackingAllButtons = function(){
    setTimeout(function(){
        document.querySelectorAll('button').forEach(function (e) {
            e.addEventListener('click',function(){
                var data = {'button-text' : e.innerText };
                LeoObserver.recordEventClickDetails(data)
            })
        })
    },1600);
}

LeoObserver.updateProfile = function(firstName, lastName, email, phone) {
    var isValid = (typeof email === 'string' && email.length > 0) || (typeof phone === 'string' && phone.length > 0);
    if(typeof window.LeoObserverProxy ==='object' &&  isValid) {
        var userData = {'firstName': firstName, 'lastName': lastName, 'email':email, 'phone': phone, loginId : "" ,loginProvider: location.host};
        setTimeout(function(){
            LeoObserverProxy.updateProfileBySession(userData);
        },2000)
    } else {
        console.log("LeoObserverProxy is not defined");
    }
}


// tracking 
// EXECUTE TRACKING EVENTS  
function setUpWooCommerceTrackingEvents() {
    // KBEDDING EVENTS
    // Add product to cart from a list
    var wishlist_add_to_cart_event = function(event) {
        // event.preventDefault();
        var product_id = event.target.getAttribute('data-product_id') || 'Unknown Product ID';
        var action_name = event.target.getAttribute('aria-label') || 'Unknown Action';
        var cartItems = document.querySelectorAll('.woocommerce-cart-form__cart-item');
        var quantity = '0';
    
        cartItems.forEach(function(cartItem) {
            var quantityInput = cartItem.querySelector('.quantity input[name*="[qty]"]');
            var productName = cartItem.querySelector('.product-name a').textContent.trim();
            
            if(action_name.includes(productName)) {
                quantity = quantityInput ? quantityInput.value : '0';
            }
        });
    
        var data = {
            'Product ID': product_id,
            'Action Name': action_name,
            'Quantity': quantity
        };
    
        console.log(data);
    
        // remove_from_wishlist_event_kbedding(event);
        // LeoObserver.recordEventAddToCart(data);

        // setTimeout(function() {
        //     console.log("Redirecting after 2 seconds delay.");
        //     window.location.href = event.target.getAttribute('href'); 
        // }, 2000);
    };
    
    // Add product to cart from Kbedding product's details screen
    var single_view_add_to_cart_event_kbedding = function(event) {
        event.preventDefault();
        console.log(event);
        console.log("Tracking adding to cart event on product details screen");
    
        const table = document.querySelector('.variations');
        let selectedRadioValues = [];
    
        if (table) {
            const variationLabels = table.querySelectorAll('label[class="radio-btn-variation"]');
            const colorAtributeInputs = table.querySelectorAll('input[name="attribute_mau-sac"]');
            
            variationLabels.forEach(function(label) {
                const radio = label.querySelector('input[type="radio"]');

                if (radio.checked) {
                    selectedRadioValues.push(label.textContent);
                }
            });

            colorAtributeInputs.forEach(function(radio) {
                if (radio.checked) {
                    selectedRadioValues.push(radio.value);
                }
            });
        }

        var selectedVariations = "";
        selectedRadioValues.forEach(function(variation) {
            selectedVariations += variation + '   ';
        });

        var productPrice = document.querySelector('.price');
    
        var productId = document.querySelector('.variations_form')?.dataset.product_id;
        var productName = document.querySelector('.product_title')?.textContent.trim();
        var quantityInput = document.querySelector('.quantity input[name="quantity"]');
        var quantity = quantityInput ? quantityInput.value : 1; 
        var variation = selectedVariations || null;
        var originalPrice = productPrice.querySelector('del .woocommerce-Price-amount') 
            ? productPrice.querySelector('del .woocommerce-Price-amount').textContent.trim() 
            : null;

        var salePrice = productPrice.querySelector('ins .woocommerce-Price-amount') 
            ? productPrice.querySelector('ins .woocommerce-Price-amount').textContent.trim() 
            : null;

        if (!salePrice) {
            salePrice = productPrice.querySelector('.woocommerce-Price-amount').textContent.trim();
            originalPrice = null;
        }

        var data = {
            'Product ID': productId,
            'Product Name': productName,
            'Variation': variation,
            'Quantity': quantity,
            'Sale Price': salePrice,
            'Original Price': originalPrice
        };
    
        console.log(data);

        LeoObserver.recordEventAddToCart(data);

        setTimeout(function() {
            console.log("Submitting form after 1,3 second delay.");
            event.target.closest('form').submit();
        }, 1300);   
    };

    // Buy now from Kbedding product's details screen
    var buy_now_event_kbedding = function(event) {
        event.preventDefault();
        console.log(event);
        console.log("Tracking adding to cart event on product details screen");
    
        const table = document.querySelector('.variations');
        let selectedRadioValues = [];
    
        if (table) {
            const variationLabels = table.querySelectorAll('label[class="radio-btn-variation"]')
            
            variationLabels.forEach(function(label) {
                const radio = label.querySelector('input[type="radio"]');

                if (radio.checked) {
                    selectedRadioValues.push(label.textContent);
                }
            });
        }

        var selectedVariations = "";
        selectedRadioValues.forEach(function(variation) {
            selectedVariations += variation + '   ';
        });

        var productPrice = document.querySelector('.price');
    
        var productId = document.querySelector('.variations_form')?.dataset.product_id;
        var productName = document.querySelector('.product_title')?.textContent.trim();
        var quantityInput = document.querySelector('.quantity input[name="quantity"]');
        var quantity = quantityInput ? quantityInput.value : 1; 
        var variation = selectedVariations || null;
        var originalPrice = productPrice.querySelector('del .woocommerce-Price-amount') 
            ? productPrice.querySelector('del .woocommerce-Price-amount').textContent.trim() 
            : null;

        var salePrice = productPrice.querySelector('ins .woocommerce-Price-amount') 
            ? productPrice.querySelector('ins .woocommerce-Price-amount').textContent.trim() 
            : null;

        if (!salePrice) {
            salePrice = productPrice.querySelector('.woocommerce-Price-amount').textContent.trim();
            originalPrice = null;
        }

        var data = {
            'Product ID': productId,
            'Product Name': productName,
            'Variation': variation,
            'Quantity': quantity,
            'Sale Price': salePrice,
            'Original Price': originalPrice
        };
    
        console.log(data);

        LeoObserver.recordEventAddToCart(data);

        setTimeout(function() {
            console.log("Submitting form after 1 second delay.");
            event.target.closest('form').submit();
        }, 1000);   
    };

    // Add product to wishlist from a list
    var list_view_add_to_wishlist_event_kbedding = function(event) {
        console.log(event);
        console.log("Tracking adding to wishlist event");
    
        var productId = this.dataset.productId;
        var productItem = document.querySelector('.products .post-' + productId);
    
        if (!productItem) {
            console.log('Không tìm thấy phần tử sản phẩm với ID:', productId);
            return;
        }
    
        var productTitleSelector = productItem.querySelector('.product-title');
        var wcLooPproductTitleSelector = productItem.querySelector('.woocommerce-loop-product__title');
    
        var productName = productTitleSelector != null 
            ? productTitleSelector.textContent.trim() 
            : (wcLooPproductTitleSelector != null 
                ? wcLooPproductTitleSelector.textContent.trim() 
                : null);
    
        var originalPrice = productItem.querySelector('.price del .woocommerce-Price-amount') 
            ? productItem.querySelector('.price del .woocommerce-Price-amount').textContent.trim() 
            : null;
    
        var salePrice = productItem.querySelector('.price ins .woocommerce-Price-amount') 
            ? productItem.querySelector('.price ins .woocommerce-Price-amount').textContent.trim() 
            : null;
    
        if (!salePrice) {
            salePrice = productItem.querySelector('.price .woocommerce-Price-amount').textContent.trim();
            originalPrice = null;
        }
    
        var data = {
            'First Name': dcdpProfileInfo.first_name,
            'Last Name': dcdpProfileInfo.last_name,
            'Email': dcdpProfileInfo.email,
            'Phone': dcdpProfileInfo.phone,
            'Login ID': '',
            'Login Provider': location.host,
            'Product Name': productName,
            'Sale Price': salePrice,
            'Original Price': originalPrice,
        };
    
        console.log(data);
    
        LeoObserver.recordEventLike(data);
    };

    // Remove a product from wishlist on wishlist screen
    var remove_from_wishlist_event_kbedding = function(event) {
        event.preventDefault();
        console.log(event);
        console.log("Tracking removing from wishlist event");
    
        var removed_item = event.target.closest('tr');
    
        var product_name_element = removed_item.querySelector('.product-name');
        var product_name = product_name_element ? product_name_element.textContent.trim() : 'Unknown Product';
    
        var data = {
            'First Name': dcdpProfileInfo.first_name,
            'Last Name': dcdpProfileInfo.last_name,
            'Email': dcdpProfileInfo.email,
            'Phone': dcdpProfileInfo.phone || 'Unknown Phone', 
            'Login ID': '',
            'Login Provider': location.host,
            'Product Name': product_name,
        };
    
        console.log(data);
    
        LeoObserver.recordEventRemoveLike(data);

        setTimeout(function() {
            console.log("Redirecting after 1 second delay.");
            window.location.href = event.target.getAttribute('href'); 
        }, 1000);
    };

    // Update cart items on cart screen (KBedding only)
    var update_cart_event_kbedding = function(event) {
        event.preventDefault();
        console.log(event);
        console.log("Tracking updating cart event");

        var cartItems = document.querySelectorAll('.woocommerce-cart-form__cart-item');
        var items = [];

        cartItems.forEach(function(cartItem) {
            var productName = cartItem.querySelector('.product-name a').textContent.trim();
            var productId = cartItem.querySelector('a[href*="remove_item"]').getAttribute('data-product_id');
            var quantityInput = cartItem.querySelector('input[name*="[qty]"]');
            var quantity = quantityInput ? quantityInput.value : '0';
    
            var cartItemInfo = {
                'itemid': productId,
                'name': productName,
                'quantity': parseInt(quantity),
            };

            items.push(cartItemInfo);
        });

        console.log(items);
    
        LeoObserver.recordEventUpdateCart(items);

        setTimeout(function() {
            console.log("Submitting form after 1 second delay.");
            event.target.closest('form').submit();
        }, 1000);   
    };
    
    // Remove a product from cart screen KBedding
    var remove_from_cart_event_kbedding = function(event) {
        event.preventDefault();
        console.log(event);
        console.log("Tracking removing from cart event")
    
        var product_id = event.target.getAttribute('data-product_id') || 'Unknown Product ID';
        var action_name = event.target.getAttribute('aria-label') || 'Unknown Action';
        var cartItems = document.querySelectorAll('.woocommerce-cart-form__cart-item');
        var quantity = '0';
    
        cartItems.forEach(function(cartItem) {
            var quantityInput = cartItem.querySelector('.quantity input[name*="[qty]"]');
            var productName = cartItem.querySelector('.product-name a').textContent.trim();
            
            if(action_name.includes(productName)) {
                quantity = quantityInput ? quantityInput.value : '0';
            }
        });
    
        var data = {
            'Product ID': product_id,
            'Action Name': action_name,
            'Quantity': quantity
        };
    
        console.log(data);
    
        LeoObserver.recordEventRemoveFromCart(data);

        setTimeout(function() {
            console.log("Redirecting after 1 second delay.");
            window.location.href = event.target.getAttribute('href'); 
        }, 1000);
    };



    // KINGKOIL EVENTS
    // Add product to cart from Kingkoil product's details screen
    var single_view_add_to_cart_event_kingkoil = function(event) {
        if(document.querySelectorAll('.out-of-stock').length == 0) {
            event.preventDefault();
            console.log(event);
            console.log("Tracking adding to cart event on product details screen");
        
            const table = document.querySelector('.variations');
            let selectedVariationValue = null;
        
            if (table) {
                const select = table.querySelector('select');
                selectedVariationValue = select ? select.value : null;
            }

            var productPrice = document.querySelector('.price');
        
            var productId = event.target.value || document.querySelector('.variations_form')?.dataset.product_id || 'Unknown';
            var productName = document.querySelector('.product_title')?.textContent.trim()|| 'Unknown' ;
            var quantityInput = document.querySelector('.quantity input[name="quantity"]') || 'Unknown';
            var quantity = quantityInput ? quantityInput.value : 1; 
            var variation =  selectedVariationValue || 'Unknown';
            var originalPrice = productPrice.querySelector('del .woocommerce-Price-amount') 
                ? productPrice.querySelector('del .woocommerce-Price-amount').textContent.trim() 
                : null;

            var salePrice = productPrice.querySelector('ins .woocommerce-Price-amount') 
                ? productPrice.querySelector('ins .woocommerce-Price-amount').textContent.trim() 
                : null;

            if (!salePrice) {
                salePrice = productPrice.querySelector('.woocommerce-Price-amount').textContent.trim();
                originalPrice = null;
            }

            var data = {
                'Product ID': productId,
                'Product Name': productName,
                'Variation': variation,
                'Quantity': quantity,
                'Sale Price': salePrice,
                'Original Price': originalPrice
            };
        
            console.log(data);

            LeoObserver.recordEventAddToCart(data);

            setTimeout(function() {
                console.log("Submitting form after 1.5 second delay.");
                event.target.closest('form').submit();
            }, 1500);   
        }
        else {
            console.log('Can not add to cart because this product is out of stock');
        }
    };

    // Buy now from Kingkoil product's details screen
    var single_view_buy_now_event_kingkoil = function(event) {
        if(document.querySelectorAll('.out-of-stock').length == 0) {
            console.log(event);
            console.log("Tracking buy now event on product details screen");
        
            const table = document.querySelector('.variations');
            let selectedVariationValue = null;
        
            if (table) {
                const select = table.querySelector('select');
                selectedVariationValue = select ? select.value : null;
            }

            var productPrice = document.querySelector('.price');
        
            var productId = event.target.value || document.querySelector('.variations_form')?.dataset.product_id || 'Unknown';
            var productName = document.querySelector('.product_title')?.textContent.trim()|| 'Unknown' ;
            var quantityInput = document.querySelector('.quantity input[name="quantity"]') || 'Unknown';
            var quantity = quantityInput ? quantityInput.value : 1; 
            var variation =  selectedVariationValue || 'Unknown';
            var originalPrice = productPrice.querySelector('del .woocommerce-Price-amount') 
                ? productPrice.querySelector('del .woocommerce-Price-amount').textContent.trim() 
                : null;

            var salePrice = productPrice.querySelector('ins .woocommerce-Price-amount') 
                ? productPrice.querySelector('ins .woocommerce-Price-amount').textContent.trim() 
                : null;

            if (!salePrice) {
                salePrice = productPrice.querySelector('.woocommerce-Price-amount').textContent.trim();
                originalPrice = null;
            }

            var data = {
                'Product ID': productId,
                'Product Name': productName,
                'Variation': variation,
                'Quantity': quantity,
                'Sale Price': salePrice,
                'Original Price': originalPrice
            };
        
            console.log(data);

            LeoObserver.recordEventAddToCart(data);
        }
        else {
            console.log('Can not buy because this product is out of stock');
        }
    };

    // Remove a product from cart screen Kingkoil
    var remove_from_cart_event_kingkoil = function(event) {
        event.preventDefault();
        
        console.log(event);
        console.log("Tracking removing from cart event")
    
        var product_id = event.target.getAttribute('data-product_id') || 'Unknown Product ID';
        var action_name = event.target.getAttribute('aria-label') || 'Unknown Action';
        var cartItems = document.querySelectorAll('.woocommerce-cart-form__cart-item');
        var quantity = '0';
    
        cartItems.forEach(function(cartItem) {
            var quantityInput = cartItem.querySelector('.quantity input[name*="[qty]"]');
            var productName = cartItem.querySelector('.box-info-price a[href*="/product"]').textContent.trim();
            
            if(action_name.includes(productName)) {
                quantity = quantityInput ? quantityInput.value : '0';
            }
        });
    
        var data = {
            'Product ID': product_id,
            'Action Name': action_name,
            'Quantity': quantity
        };
    
        console.log(data);
    
        LeoObserver.recordEventRemoveFromCart(data);

        setTimeout(function() {
            console.log("Redirecting after 1.5 second delay.");
            window.location.href = event.target.getAttribute('href'); 
        }, 1500);
    };
    


    // KBEDDING - have to wait until finishing initiation
    if(window.location.href.includes('kbedding.vn')) {
        // remove from wishlist - ok
        document.querySelectorAll('a[href*="remove_from_wishlist="]').forEach(function(button) {
            button.addEventListener('click', remove_from_wishlist_event_kbedding)
        });

        // add to wishlist - ok
        document.querySelectorAll('a[href*="add_to_wishlist"]').forEach(function(button) {
            button.addEventListener('click', list_view_add_to_wishlist_event_kbedding);
        });
        
        // add to cart from wishlist - testing
        document.querySelectorAll('a[href*="remove_from_wishlist_after_add_to_cart"]').forEach(function(button) {
            button.addEventListener('click', wishlist_add_to_cart_event)
        });

        // add to cart from single view - ok
        if(document.querySelector('.product .single_add_to_cart_button') != null) {
            document.querySelector('.product .single_add_to_cart_button').addEventListener('click', single_view_add_to_cart_event_kbedding);
        }

        // buy now - testing
        if(document.querySelector('button[name="wsb-buy-now"]') != null) {
            document.querySelector('button[name="wsb-buy-now"]').addEventListener('click', buy_now_event_kbedding);
        }

        // remove from cart - ok
        document.querySelectorAll('a[href*="remove_item"]').forEach(function(button) {
            button.addEventListener('click', remove_from_cart_event_kbedding);
        });

        // update cart - get full data ok, but can not show these data to UI -> Mr Trieu will fix this
        document.querySelectorAll('.woocommerce-cart-form button[name*="update_cart"]').forEach(function(button) {
            button.addEventListener('click', update_cart_event_kbedding);
        });
    }
    


    // KINGKOIL - have to wait until finishing initiation
    if(window.location.href.includes('kingkoil.vn')) {
        // add to cart - ok
        if(document.querySelector('.single_add_to_cart_button.bt-add-cart') != null) {
            document.querySelector('.single_add_to_cart_button.bt-add-cart').addEventListener('click', single_view_add_to_cart_event_kingkoil);
        }

        // remove from cart - ok
        document.querySelectorAll('a[href*="remove_item"]').forEach(function(button) {
            button.addEventListener('click', remove_from_cart_event_kingkoil);
        });
        
        // buy now - ok
        if(document.querySelector('.product button[name*="buy-now"]') != null) {
            document.querySelector('.product button[name*="buy-now"]').addEventListener('click', single_view_buy_now_event_kingkoil);
        }
    }

    // document.body.addEventListener('added_to_wishlist', list_view_add_to_wishlist_event_kbedding);
}