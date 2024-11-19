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

// (2.1) function to track View Event "PageView"
LeoObserver.recordEventPageView = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("page-view",eventData);
}

// (2.2) function to track Action Event "Like"
LeoObserver.recordEventLike = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("like",eventData);
}

// (2.3) function to track View Event "ContentView"
LeoObserver.recordEventContentView = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("content-view",eventData);
}

// (2.4) function to track Action Event "Search"
LeoObserver.recordEventSearch = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("search",eventData);
}

// (2.5) function to track View Event "ItemView"
LeoObserver.recordEventItemView = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("item-view",eventData);
}

// (2.6) function to track Action Event "SubmitContact"
LeoObserver.recordEventSubmitContact = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("submit-contact",eventData);
}

// (2.7) function to track Action Event "RegisterAccount"
LeoObserver.recordEventRegisterAccount = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("register-account",eventData);
}

// (2.8) function to track Action Event "UserLogin"
LeoObserver.recordEventUserLogin = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("user-login",eventData);
}

// (2.9) function to track Conversion Event "Purchase"
LeoObserver.recordEventPurchase = function(eventData, shoppingCartItems, transactionId, transactionValue, currencyCode) {
	// need 5 params
	eventData = typeof eventData === "object" ? eventData : {};
	shoppingCartItems = typeof shoppingCartItems === "object" ? shoppingCartItems : [];
	transactionId = typeof transactionId === "string" ? transactionId : "";
	transactionValue = typeof transactionValue === "number" ? transactionValue : 0;
	currencyCode = typeof currencyCode === "string" ? currencyCode : "USD";
	LeoObserverProxy.recordConversionEvent("purchase", eventData , transactionId, shoppingCartItems, transactionValue, currencyCode);
}

// (2.10) function to track accept-tracking
LeoObserver.recordEventAcceptTracking = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("accept-tracking",eventData);
}

// (3) CDP EVENT OBSERVER is ready
function leoObserverProxyReady(session) {
   	// auto tracking when CDP JS is ready
   	LeoObserver.recordEventPageView(parseDataUTM()) ;

    // ext tracking
    if(typeof callCustomTrackingEvents === 'function'){
        callCustomTrackingEvents();
    }
   	
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
    var d = dcdpProfileInfo;
    LeoObserver.updateProfile(d.first_name, d.last_name, d.email, d.phone, d.user_login);
}


// update web visitor profile 
LeoObserver.updateProfile = function(firstName, lastName, email, phone, loginId) {
    var isValid = (typeof email === 'string' && email.length > 0) || (typeof phone === 'string' && phone.length > 0);
    if(typeof window.LeoObserverProxy ==='object' &&  isValid) {
        var userData = {'firstName': firstName, 'lastName': lastName, 'email':email, 'phone': phone, 'loginId' : loginId || "" , 'loginProvider': location.host};
        setTimeout(function(){
            LeoObserverProxy.updateProfileBySession(userData);
        },1900)
    } else {
        console.log("LeoObserverProxy is not defined");
    }
}