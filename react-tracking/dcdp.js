const booking_url = 'https://pos.facialbar.vn/send_request?model=vmt.loyalty.booking';
const create_booking_url = 'https://api-gateway.facialbar.vn/booking/booking/create-booking';
const sign_in_url = 'https://api-gateway.facialbar.vn/marketing/customer/login';
const sign_up_url = 'https://api-gateway.facialbar.vn/marketing/customer/create-password';
const create_service_details_url = function(serviceName) {return `https://facialbar.vn/_next/data/6nOzGMP03IO8bk7PzUR1v/dich-vu/${serviceName}-.json?id=${serviceName}-`;};
const service_view_url = 'https://facialbar.vn/dich-vu/';
const sign_in_button_id = '#button-login-s';
const sign_up_button_id = '#button-login-s';
const booking_button_id = '#button-login-s';



// (1) CDP EVENT OBSERVER: load JavaScript code for [Facial Bar]
(function() { 	
	// Observer ID
	window.leoObserverId = "m8WL8c75305Tu44a6ozpl";
	
	// CDN of JS
	window.leoObserverLogDomain = "vmt-datahub.dragoncdp.vn";
  	window.leoObserverCdnDomain = "cdn.jsdelivr.net/gh/USPA-Technology/leo-cdp-static-files@v0.8.9.31/";
	
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
};

// (2.2) function to track View Event "PageView"
LeoObserver.recordEventPageView = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("page-view",eventData);
};

// (2.3) function to track View Event "AcceptTracking"
LeoObserver.recordEventAcceptTracking = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("accept-tracking",eventData);
};

// (2.4) function to track View Event "EngagedSession"
LeoObserver.recordEventEngagedSession = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("engaged-session",eventData);
};

// (2.5) function to track Action Event "Like"
LeoObserver.recordEventLike = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("like",eventData);
};

// (2.6) function to track View Event "ContentView"
LeoObserver.recordEventContentView = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("content-view",eventData);
};

// (2.7) function to track Action Event "Search"
LeoObserver.recordEventSearch = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("search",eventData);
};

// (2.8) function to track View Event "ItemView"
LeoObserver.recordEventItemView = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordViewEvent("item-view",eventData);
};

// (2.9) function to track Action Event "ClickDetails"
LeoObserver.recordEventClickDetails = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("click-details",eventData);
};

// (2.10) function to track Action Event "PlayVideo"
LeoObserver.recordEventPlayVideo = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("play-video",eventData);
};

// (2.11) function to track Action Event "SubmitContact"
LeoObserver.recordEventSubmitContact = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("submit-contact",eventData);
};

// (2.12) function to track Action Event "AdminView"
LeoObserver.recordEventAdminView = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("admin-view",eventData);
};

// (2.13) function to track Action Event "FileDownload"
LeoObserver.recordEventFileDownload = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("file-download",eventData);
};

// (2.14) function to track Action Event "RegisterAccount"
LeoObserver.recordEventRegisterAccount = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("register-account",eventData);
};

// (2.15) function to track Action Event "UserLogin"
LeoObserver.recordEventUserLogin = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("user-login",eventData);
};

// (2.16) function to track Action Event "ShortLinkClick"
LeoObserver.recordEventShortLinkClick = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("short-link-click",eventData);
};

// (2.17) function to track Action Event "AskQuestion"
LeoObserver.recordEventAskQuestion = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("ask-question",eventData);
};

// (2.18) function to track Action Event "ProductTrial"
LeoObserver.recordEventProductTrial = function(eventData) {
	eventData = eventData ? eventData : {};
	LeoObserverProxy.recordActionEvent("product-trial",eventData);
};

// (2.19) function to track Conversion Event "Purchase"
LeoObserver.recordEventPurchase = function(eventData, shoppingCartItems, transactionId, transactionValue, currencyCode) {
	// need 5 params
	eventData = typeof eventData === "object" ? eventData : {};
	shoppingCartItems = typeof shoppingCartItems === "object" ? shoppingCartItems : [];
	transactionId = typeof transactionId === "string" ? transactionId : "";
	transactionValue = typeof transactionValue === "number" ? transactionValue : 0;
	currencyCode = typeof currencyCode === "string" ? currencyCode : "USD";
	LeoObserverProxy.recordConversionEvent("purchase", eventData , transactionId, shoppingCartItems, transactionValue, currencyCode);
};

// (2.20) function to track Action Event "ProductTrial"
LeoObserver.recordEventAddToCart = function(eventData) {
    eventData = eventData ? eventData : {};
    LeoObserverProxy.recordActionEvent("add-to-cart",eventData);
};

// (2.21) function to track Action Event "Dislike"
LeoObserver.recordEventRemoveLike = function(eventData) {
    eventData = eventData ? eventData : {};
    LeoObserverProxy.recordActionEvent("remove-like",eventData);
};

// (2.22) function to track Action Event "RemoveFromCart"
LeoObserver.recordEventRemoveFromCart = function(eventData) {
    eventData = eventData ? eventData : {};
    LeoObserverProxy.recordActionEvent("remove-from-cart",eventData);
};

// (2.23) function to track Action Event "UpdateCart"
LeoObserver.recordEventUpdateCart = function(shoppingCartItems) {
	shoppingCartItems = typeof shoppingCartItems === "object" ? shoppingCartItems : [];
    LeoObserverProxy.recordConversionEvent("update-cart", {} , "", shoppingCartItems, -1, "USD");
};

// (2.24) function to track Action Event "Book"
LeoObserver.recordEventBook = function(eventData) {
    eventData = eventData ? eventData : {};
    LeoObserverProxy.recordActionEvent("book",eventData);
};



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
};

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
};

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
};

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
};




// track service view event
(function() { 	
	function extractServiceName(url) {
        console.log(url);
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1].split('-')[0];
        return lastPart;
    }
    
    if(window.location.href.includes(service_view_url)) {
        var serviceName = extractServiceName(window.location.href);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', create_service_details_url(serviceName), true);
                
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                var eventData = {};
                var resJson = JSON.parse(xhr.responseText);

                eventData['ID'] = resJson.pageProps.dataDetail._id || 'Unknown';
                eventData['Name'] = resJson.pageProps.dataDetail.seo.title || 'Unknown';
                eventData['Keyword'] = resJson.pageProps.dataDetail.seo.keyword || 'Unknown';
                eventData['Description'] = resJson.pageProps.dataDetail.seo.description || 'Unknown';
                eventData['Content'] = resJson.pageProps.dataDetail.content || 'Unknown';
                eventData['Price'] = resJson.pageProps.dataDetail.price || 'Unknown';

                console.log('Final Event Data:', eventData);
                LeoObserver.recordEventItemView(eventData)
            } else {
                console.error("Request failed with status:", xhr.status);
            }
        };
        
        xhr.onerror = function () {
            console.error("Request failed");
        };
        
        xhr.send();
    }
})();



// track event via request and response after clicking a component
document.addEventListener('DOMContentLoaded', function() {
    // get current formattedDate
    function getCurrentFormattedDate() {
        const now = new Date();
    
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    // reformat data to yyyy-MM-dd HH:mm
    var formatDate = function(dateString) {
        const date = new Date(dateString);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    // get service list and add to eventData
    var get_services_info_on_click = function() {   
        const serviceNameList = document.querySelectorAll('.text-\\[\\#6D8A63\\]');
        const servicePriceList = document.querySelectorAll('.text-\\[\\#667973\\]');
        const length = Math.min(serviceNameList.length, servicePriceList.length);

        var eventData = {}

        for (let i = 0; i < length - 1; i++) {
            const serviceName = serviceNameList[i].textContent.trim();
            const servicePrice = servicePriceList[i+1].textContent.trim();

            eventData["Service " + (i+1).toString()] = `Name: ${serviceName}, Price: ${servicePrice}`;
        }

        console.log(eventData);

        return eventData;
    }

    // track booking event
    var booking_event = function() {    
        const originalSend = XMLHttpRequest.prototype.send;
        const originalOpen = XMLHttpRequest.prototype.open;
        
        var requestBody = null;
        var firstRequestDone = false;
        var secondRequestDone = false;
    
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url.includes(booking_url)) {
                this.isLoyaltyBooking = true;
            } else {
                this.isLoyaltyBooking = false;
            }
            originalOpen.apply(this, arguments);
        };
    
        XMLHttpRequest.prototype.send = function(body) {
            const xhr = this;
            const originalOnReadyStateChange = xhr.onreadystatechange;
    
            if (xhr.isLoyaltyBooking && body) {
                try {
                    requestBody = JSON.parse(body); 
                } catch (error) {
                    console.error('Request body is not valid JSON:', error);
                }
            }
    
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) { 
                    const url = xhr.responseURL;
                    
                    if (url.includes(create_booking_url) || url.includes(booking_url)) {
                        try {
                            var resJson = JSON.parse(xhr.responseText);
                            var eventData = {};
                            console.log('Response JSON:', resJson);
    
                            if (url.includes(create_booking_url) && resJson != null && xhr.status == 200) {
                                eventData['Bed ID'] = resJson.data.bedId;
                                eventData['Bed Name'] = resJson.data.bedName;
                                eventData['Created Date'] = getCurrentFormattedDate();
                                eventData['Phone Number'] = resJson.data.phoneNumber;
                                firstRequestDone = true;
                            }
    
                            if (url.includes(booking_url) && resJson != null && xhr.status == 200) {
                                eventData['Salon'] = resJson.data.salon;
                                eventData['Start Time'] = resJson.data.start_time;
                                eventData = {...eventData, ...get_services_info_on_click()};
                                eventData['People Amount'] = requestBody.values.people;
                                secondRequestDone = true;
                            }
    
                            if (firstRequestDone && secondRequestDone) {
                                console.log('Final Event Data:', eventData);
                                LeoObserver.recordEventBook(eventData);
                            }
    
                        } catch (error) {
                            console.error('Response is not valid JSON:', error);
                        }
                    }
                }
    
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(xhr, arguments);
                }
            };
    
            originalSend.apply(xhr, arguments);
        };
    }

    // track signing in event
    var sign_in_event = function() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        var requestBody = null;
    
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url.includes(sign_in_url)) {
                this.isLoginRequest = true;  
            } else {
                this.isLoginRequest = false;
            }
            originalOpen.apply(this, arguments);
        };
    
        XMLHttpRequest.prototype.send = function(body) {
            const xhr = this;
            const originalOnReadyStateChange = xhr.onreadystatechange;
    
            if (xhr.isLoginRequest && body) {
                try {
                    requestBody = JSON.parse(body); 
                } catch (error) {
                    console.error('Request body is not valid JSON:', error);
                }
            }
    
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) { 
                    const url = xhr.responseURL;
    
                    if (xhr.isLoginRequest && url.includes(sign_in_url)) {
                        try {    
                            if (xhr.status === 200) {
                                var eventData = { 
                                    "User Name": requestBody.username,
                                    "Password": requestBody.password,
                                };
                                console.log('Final Event Data:', eventData);
                                LeoObserver.recordEventUserLogin(eventData); 
                            }
    
                        } catch (error) {
                            console.error('Response is not valid JSON:', error);
                        }
                    }
                }
    
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(xhr, arguments);
                }
            };
    
            originalSend.apply(xhr, arguments);
        };
    };

    // track signing up event
    var sign_up_event = function(event) {
        const originalSend = XMLHttpRequest.prototype.send;
    
        XMLHttpRequest.prototype.send = function(body) {
            const xhr = this;
            const originalOnReadyStateChange = xhr.onreadystatechange;
    
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    const url = xhr.responseURL;
    
                    if (url.includes(sign_up_url)) {
                        try {
                            var resJson = JSON.parse(xhr.responseText);

                            if (xhr.status === 200 && resJson.statusCode === 200) { 
                                var eventData = {};

                                eventData['Phone'] = resJson.data.phone;
                                eventData['Created At'] = formatDate(resJson.data.created_at);
    
                                console.log('Final Event Data:', eventData);
                                LeoObserver.recordEventRegisterAccount(eventData); 
                            }
    
                        } catch (error) {
                            console.error('Response is not valid JSON:', error);
                        }
                    }
                }
    
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(xhr, arguments);
                }
            };
    
            originalSend.apply(xhr, arguments);
        };
    };
    

    // Tracking button clicking
    document.querySelector(booking_button_id).addEventListener('click', booking_event);
    document.querySelector(sign_in_button_id).addEventListener('click', sign_in_event);
    document.querySelector(sign_up_button_id).addEventListener('click', sign_up_event);
});
