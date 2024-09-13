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
LeoObserver.recordEventClickDetails = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("click-details",eventData);
}

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

LeoObserver.recordEventAddToCart = function(shoppingCartItems, currencyCode) {
	// need 5 params
	eventData = typeof eventData === "object" ? eventData : {};
	shoppingCartItems = typeof shoppingCartItems === "object" ? shoppingCartItems : [];
	transactionId = typeof transactionId === "string" ? transactionId : "";
	transactionValue = typeof transactionValue === "number" ? transactionValue : 0;
	currencyCode = typeof currencyCode === "string" ? currencyCode : "USD";
	LeoObserverProxy.recordConversionEvent("purchase", {} , "", shoppingCartItems, 0, currencyCode);
}


// (3) CDP EVENT OBSERVER is ready
function leoObserverProxyReady(session) {
   	// auto tracking when CDP JS is ready
   	LeoObserver.recordEventPageView(parseDataUTM()) ;
   	
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


jQuery(function($) {

	var a = function(event, fragments, cart_hash, $button) {
        var product_id = $button.data('product_id');   
        var product_name = $button.closest('.product').find('.woocommerce-loop-product__title').text();  
        LeoObserver.recordEventAddToCart({
            product_id: product_id,
            product_name: product_name
        });
    };

	$(document.body).on('added_to_cart', a);
	
	$('.single_add_to_cart_button').on('click', function(event) {
        event.preventDefault(); 
        
        var product_id = $(this).val(); 
        var product_name = $(this).closest('.product').find('.woocommerce-loop-product__title').text();  

        LeoObserver.recordEventAddToCart({
            product_id: product_id,
            product_name: product_name
        });
    });


	 // Lắng nghe sự kiện "added_to_cart" của WooCommerce
	 $(document.body).on('init_checkout', function(event, fragments, cart_hash, button) {
        // Lấy thông tin sản phẩm từ nút "Add to Cart"
        console.log(event);
    });
});