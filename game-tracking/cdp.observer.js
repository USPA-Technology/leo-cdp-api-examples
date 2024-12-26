// CdpObserver.js - Custom Analytics Tracker for Websites & HTML5 Games

// Configuration for Tracking Server

const DEFAULT_OBSERVER_ENDPOINT =
  location.protocol + "/" + location.hostname + "/event-game/put";

// configs of CDP
const CDP_CONFIG = {
  endpoint: window.cdpObserverEndpoint || DEFAULT_OBSERVER_ENDPOINT,
  cdpObserverId: window.cdpObserverId || "default_observer",
};

// Core Analytics Object
const CdpObserver = (function () {
  const SESSION_CACHE_MINUTES = 30;
  const CDP_SESSION_KEY = "cdp_ssid";
  const CDP_VISITOR_KEY = "cdp_vsid";

  // the event queue
  const CDP_TRACKING_QUEUE = [];

  // visitor and session
  let sessionId = null;
  let visitorId = null;
  let fingerprintId = null;

  /**
   * Initialize the Analytics
   * @param {Object} config - Custom configuration
   */
  function init(config = {}) {
    

    var fgCallback = function (fgId) {
      // load all keys
      sessionId = getSessionId();
      visitorId = getVisitorId();
      fingerprintId = fgId;
      
      // for first-time loads
      var queueProcessor = function () {
        var len = CDP_TRACKING_QUEUE.length;
        while (len > 0) {
          var data = CDP_TRACKING_QUEUE.pop();

          // TODO
          console.log(data);

          len = len - 1;
        }
      };
      setInterval(queueProcessor, 799);

      var ids = {
        sessionId,
        visitorId,
        fingerprintId,
      }

      console.log("CdpObserver Initialized:", ids);

      // ----------------- CDP JS is ready ------------------------
      if (typeof window.onCdpJsReady === "function") {
        console.log("--- CdpJsReady ---");
        window.onCdpJsReady(ids);
      }
    };

    // call Fingerprint then do the jobs
    initFingerprint(fgCallback);
  }

  function initFingerprint(callback) {
    var fgid = lscache.get("cdp_fgp");
    if (typeof fgid === "string") {
      if (typeof callback === "function") callback(fgid);
      return;
    }

    // generate a new Fingerprint
    var options = { excludes: { enumerateDevices: true, deviceMemory: true } };
    Fingerprint2.get(options, function (components) {
      var values = components.map(function (component) {
        return component.value;
      });
      var fingerprintId = Fingerprint2.x64hash128(values.join(""), 31);
      lscache.set("cdp_fgp", fingerprintId);

      // callback
      if (typeof callback === "function") callback(fingerprintId);
    });
  }

  function getSessionId() {
    sessionId = lscache.get(CDP_SESSION_KEY);
    if (typeof sessionId !== "string") {
      sessionId = generateUUID();
      lscache.set(CDP_SESSION_KEY, sessionId, SESSION_CACHE_MINUTES);
    }
    return sessionId;
  }

  function getVisitorId() {
    var uuid = lscache.get(CDP_VISITOR_KEY);
    if (typeof uuid !== "string") {
      uuid = generateUUID();
      lscache.set(CDP_VISITOR_KEY, uuid); //cache forever
    }
    return uuid;
  }

  // Utility to generate a unique ID for tracking sessions
  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  /**
   * Collect and send tracking data
   * @param {String} metric - Event name
   * @param {Object} eventdata - Additional event data
   */
  async function trackEvent(metric, eventdata = {}) {
    const payload = {
      utmdata: getUTMData(),
      payload: {
        datetime: new Date().toISOString(),
        obsid: CDP_CONFIG.cdpObserverId,
        mediahost: window.location.host,
        tprefurl: document.referrer || "",
        tprefdomain: new URL(document.referrer || window.location.origin)
          .hostname,
        tpurl: window.location.href,
        tpname: document.title,
        metric,
        eventdata,
        visid: visitorId,
        fgp: fingerprintId,
        ctxsk: sessionId,
      },
    };

    try {
      const response = await fetch(CDP_CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorResponse = await response.json();
        throw new Error(
          `HTTP Error: ${response.status} - ${
            errorResponse.message || "Unknown Error"
          }`
        );
      }

      const responseData = await response.json();
      console.log("CdpObserver Event Sent:", metric, responseData);
    } catch (error) {
      // Enhanced error logging
      console.error("CdpObserver Event Error:", {
        message: error.message,
        stack: error.stack,
        endpoint: CDP_CONFIG.endpoint,
        payload,
      });
    }
  }

  /**
   * Get UTM Parameters from URL
   * @returns {Object} - UTM Data
   */
  function getUTMData() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utmsource: urlParams.get("utm_source") || "",
      utmmedium: urlParams.get("utm_medium") || "",
      utmcampaign: urlParams.get("utm_campaign") || "",
      utmterm: urlParams.get("utm_term") || "",
      utmcontent: urlParams.get("utm_content") || "",
    };
  }



  function mergeObjects(obj1, obj2) {
    return Object.assign({}, obj1, obj2);
  }

  function getBaseEventModel() {
    return {
      phone: "",
      first_name: "",
      living_district: "",
      living_city: "",
      marital_status: "single",
      personal_interests: [],
      gift_code: "",
    };
  }

  /**
   * Track Page View
   */
  function trackPageView() {
    trackEvent("page_view", getBaseEventModel());
  }

  function trackGameLoaded() {
    trackEvent("game_loaded", getBaseEventModel());
  }

  function trackPhoneSubmit(profile) {
    trackEvent("phone_submit", mergeObjects(getBaseEventModel(), profile));
  }

  function trackOtpSubmit(profile) {
    trackEvent("otp_submit", mergeObjects(getBaseEventModel(), profile));
  }

  function trackGameStart(profile) {
    trackEvent("game_start", mergeObjects(getBaseEventModel(), profile));
  }

  function trackGameComplete(profile) {
    trackEvent("game_complete",mergeObjects(getBaseEventModel(), profile));
  }

  function trackUserRegister(profile) {
    trackEvent("user_register", mergeObjects(getBaseEventModel(), profile));
  }

  function trackUserLogin(profile) {
    trackEvent("user_login", mergeObjects(getBaseEventModel(), profile));
  }

  function trackClaimReward(profile) {
    trackEvent("claim_reward", mergeObjects(getBaseEventModel(), profile));
  }

  return {
    init,
    trackEvent,
    trackPageView,
    trackGameLoaded,
    trackPhoneSubmit,
    trackOtpSubmit,
    trackGameStart,
    trackGameComplete,
    trackUserRegister,
    trackUserLogin,
    trackClaimReward
  };
})();

// ------------ BEGIN lscache ------------------
/**
 * lscache library https://github.com/pamelafox/lscache
 * Copyright (c) 2011, Pamela Fox
 */
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module !== "undefined" && module.exports) {
    // CommonJS/Node module
    module.exports = factory();
  } else {
    // Browser globals
    root.lscache = factory();
  }
})(this, function () {
  // Prefix for all lscache keys
  var CACHE_PREFIX = "cdpcache-";

  // Suffix for the key name on the expiration items in localStorage
  var CACHE_SUFFIX = "-cacheexpiration";

  // expiration date radix (set to Base-36 for most space savings)
  var EXPIRY_RADIX = 10;

  // time resolution in milliseconds
  var expiryMilliseconds = 60 * 1000;
  // ECMAScript max Date (epoch + 1e8 days)
  var maxDate = calculateMaxDate(expiryMilliseconds);

  var cachedStorage;
  var cachedJSON;
  var cacheBucket = "";
  var warnings = false;

  // Determines if localStorage is supported in the browser;
  // result is cached for better performance instead of being run each time.
  // Feature detection is based on how Modernizr does it;
  // it's not straightforward due to FF4 issues.
  // It's not run at parse-time as it takes 200ms in Android.
  function supportsStorage() {
    var key = "__lscachetest__";
    var value = key;

    if (cachedStorage !== undefined) {
      return cachedStorage;
    }

    // some browsers will throw an error if you try to access local storage (e.g. brave browser)
    // hence check is inside a try/catch

    try {
      if (typeof window.localStorage !== "object") {
        return false;
      }

      setItem(key, value);
      removeItem(key);
      cachedStorage = true;
    } catch (e) {
      console.error(e);
      // If we hit the limit, and we don't have an empty localStorage then it means we have support
      if (isOutOfSpace(e) && localStorage.length) {
        cachedStorage = true; // just maxed it out and even the set test failed.
      } else {
        cachedStorage = false;
      }
    }
    return cachedStorage;
  }

  // Check to set if the error is us dealing with being out of space
  function isOutOfSpace(e) {
    return (
      e &&
      (e.name === "QUOTA_EXCEEDED_ERR" ||
        e.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
        e.name === "QuotaExceededError")
    );
  }

  // Determines if native JSON (de-)serialization is supported in the browser.
  function supportsJSON() {
    /*jshint eqnull:true */
    if (cachedJSON === undefined) {
      cachedJSON = window.JSON != null;
    }
    return cachedJSON;
  }

  /**
   * Returns a string where all RegExp special characters are escaped with a \.
   * @param {String} text
   * @return {string}
   */
  function escapeRegExpSpecialCharacters(text) {
    return text.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&");
  }

  /**
   * Returns the full string for the localStorage expiration item.
   * @param {String} key
   * @return {string}
   */
  function expirationKey(key) {
    return key + CACHE_SUFFIX;
  }

  /**
   * Returns the number of minutes since the epoch.
   * @return {number}
   */
  function currentTime() {
    return Math.floor(new Date().getTime() / expiryMilliseconds);
  }

  /**
   * Wrapper functions for localStorage methods
   */

  function getItem(key) {
    return localStorage.getItem(CACHE_PREFIX + cacheBucket + key);
  }

  function setItem(key, value) {
    // Fix for iPad issue - sometimes throws QUOTA_EXCEEDED_ERR on setItem.
    localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
    localStorage.setItem(CACHE_PREFIX + cacheBucket + key, value);
  }

  function removeItem(key) {
    localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
  }

  function eachKey(fn) {
    var prefixRegExp = new RegExp(
      "^" + CACHE_PREFIX + escapeRegExpSpecialCharacters(cacheBucket) + "(.*)"
    );
    // Loop in reverse as removing items will change indices of tail
    for (var i = localStorage.length - 1; i >= 0; --i) {
      var key = localStorage.key(i);
      key = key && key.match(prefixRegExp);
      key = key && key[1];
      if (key && key.indexOf(CACHE_SUFFIX) < 0) {
        fn(key, expirationKey(key));
      }
    }
  }

  function flushItem(key) {
    var exprKey = expirationKey(key);

    removeItem(key);
    removeItem(exprKey);
  }

  function flushExpiredItem(key) {
    var exprKey = expirationKey(key);
    var expr = getItem(exprKey);

    if (expr) {
      var expirationTime = parseInt(expr, EXPIRY_RADIX);

      // Check if we should actually kick item out of storage
      if (currentTime() >= expirationTime) {
        removeItem(key);
        removeItem(exprKey);
        return true;
      }
    }
  }

  function warn(message, err) {
    if (!warnings) return;
    if (!("console" in window) || typeof window.console.warn !== "function")
      return;
    window.console.warn("lscache - " + message);
    if (err) window.console.warn("lscache - The error was: " + err.message);
  }

  function calculateMaxDate(expiryMilliseconds) {
    return Math.floor(8.64e15 / expiryMilliseconds);
  }

  var lscache = {
    /**
     * Stores the value in localStorage. Expires after specified number of minutes.
     * @param {string} key
     * @param {Object|string} value
     * @param {number} time
     * @return {boolean} whether the value was inserted successfully
     */
    set: function (key, value, time) {
      if (!supportsStorage()) return false;

      // If we don't get a string value, try to stringify
      // In future, localStorage may properly support storing non-strings
      // and this can be removed.

      if (!supportsJSON()) return false;
      try {
        value = JSON.stringify(value);
      } catch (e) {
        // Sometimes we can't stringify due to circular refs
        // in complex objects, so we won't bother storing then.
        return false;
      }

      try {
        setItem(key, value);
      } catch (e) {
        if (isOutOfSpace(e)) {
          // If we exceeded the quota, then we will sort
          // by the expire time, and then remove the N oldest
          var storedKeys = [];
          var storedKey;
          eachKey(function (key, exprKey) {
            var expiration = getItem(exprKey);
            if (expiration) {
              expiration = parseInt(expiration, EXPIRY_RADIX);
            } else {
              // TODO: Store date added for non-expiring items for smarter removal
              expiration = maxDate;
            }
            storedKeys.push({
              key: key,
              size: (getItem(key) || "").length,
              expiration: expiration,
            });
          });
          // Sorts the keys with oldest expiration time last
          storedKeys.sort(function (a, b) {
            return b.expiration - a.expiration;
          });

          var targetSize = (value || "").length;
          while (storedKeys.length && targetSize > 0) {
            storedKey = storedKeys.pop();
            warn("Cache is full, removing item with key '" + key + "'");
            flushItem(storedKey.key);
            targetSize -= storedKey.size;
          }
          try {
            setItem(key, value);
          } catch (e) {
            // value may be larger than total quota
            warn(
              "Could not add item with key '" +
                key +
                "', perhaps it's too big?",
              e
            );
            return false;
          }
        } else {
          // If it was some other error, just give up.
          warn("Could not add item with key '" + key + "'", e);
          return false;
        }
      }

      // If a time is specified, store expiration info in localStorage
      if (time) {
        setItem(
          expirationKey(key),
          (currentTime() + time).toString(EXPIRY_RADIX)
        );
      } else {
        // In case they previously set a time, remove that info from localStorage.
        removeItem(expirationKey(key));
      }
      return true;
    },

    /**
     * Retrieves specified value from localStorage, if not expired.
     * @param {string} key
     * @return {string|Object}
     */
    get: function (key) {
      if (!supportsStorage()) return null;

      // Return the de-serialized item if not expired
      if (flushExpiredItem(key)) {
        return null;
      }

      // Tries to de-serialize stored value if its an object, and returns the normal value otherwise.
      var value = getItem(key);
      if (!value || !supportsJSON()) {
        return value;
      }

      try {
        // We can't tell if its JSON or a string, so we try to parse
        return JSON.parse(value);
      } catch (e) {
        // If we can't parse, it's probably because it isn't an object
        return value;
      }
    },

    /**
     * Removes a value from localStorage.
     * Equivalent to 'delete' in memcache, but that's a keyword in JS.
     * @param {string} key
     */
    remove: function (key) {
      if (!supportsStorage()) return;

      flushItem(key);
    },

    /**
     * Returns whether local storage is supported.
     * Currently exposed for testing purposes.
     * @return {boolean}
     */
    supported: function () {
      return supportsStorage();
    },

    /**
     * Flushes all lscache items and expiry markers without affecting rest of localStorage
     */
    flush: function () {
      if (!supportsStorage()) return;

      eachKey(function (key) {
        flushItem(key);
      });
    },

    /**
     * Flushes expired lscache items and expiry markers without affecting rest of localStorage
     */
    flushExpired: function () {
      if (!supportsStorage()) return;

      eachKey(function (key) {
        flushExpiredItem(key);
      });
    },

    /**
     * Appends CACHE_PREFIX so lscache will partition data in to different buckets.
     * @param {string} bucket
     */
    setBucket: function (bucket) {
      cacheBucket = bucket;
    },

    /**
     * Resets the string being appended to CACHE_PREFIX so lscache will use the default storage behavior.
     */
    resetBucket: function () {
      cacheBucket = "";
    },

    /**
     * @returns {number} The currently set number of milliseconds each time unit represents in
     *   the set() function's "time" argument.
     */
    getExpiryMilliseconds: function () {
      return expiryMilliseconds;
    },

    /**
     * Sets the number of milliseconds each time unit represents in the set() function's
     *   "time" argument.
     * Sample values:
     *  1: each time unit = 1 millisecond
     *  1000: each time unit = 1 second
     *  60000: each time unit = 1 minute (Default value)
     *  360000: each time unit = 1 hour
     * @param {number} milliseconds
     */
    setExpiryMilliseconds: function (milliseconds) {
      expiryMilliseconds = milliseconds;
      maxDate = calculateMaxDate(expiryMilliseconds);
    },

    /**
     * Sets whether to display warnings when an item is removed from the cache or not.
     */
    enableWarnings: function (enabled) {
      warnings = enabled;
    },
  };

  // Return the module
  return lscache;
});

// ------------ END LocalStorage Cache ------------------

// ------------------- fgp2.js ---------------------------------------------- //
!(function (e, t, a) {
  "undefined" != typeof window && "function" == typeof define && define.amd
    ? define(a)
    : "undefined" != typeof module && module.exports
    ? (module.exports = a())
    : t.exports
    ? (t.exports = a())
    : (t.Fingerprint2 = a());
})(0, this, function () {
  "use strict";
  var d = function (e, t) {
      (e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]]),
        (t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]]);
      var a = [0, 0, 0, 0];
      return (
        (a[3] += e[3] + t[3]),
        (a[2] += a[3] >>> 16),
        (a[3] &= 65535),
        (a[2] += e[2] + t[2]),
        (a[1] += a[2] >>> 16),
        (a[2] &= 65535),
        (a[1] += e[1] + t[1]),
        (a[0] += a[1] >>> 16),
        (a[1] &= 65535),
        (a[0] += e[0] + t[0]),
        (a[0] &= 65535),
        [(a[0] << 16) | a[1], (a[2] << 16) | a[3]]
      );
    },
    g = function (e, t) {
      (e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]]),
        (t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]]);
      var a = [0, 0, 0, 0];
      return (
        (a[3] += e[3] * t[3]),
        (a[2] += a[3] >>> 16),
        (a[3] &= 65535),
        (a[2] += e[2] * t[3]),
        (a[1] += a[2] >>> 16),
        (a[2] &= 65535),
        (a[2] += e[3] * t[2]),
        (a[1] += a[2] >>> 16),
        (a[2] &= 65535),
        (a[1] += e[1] * t[3]),
        (a[0] += a[1] >>> 16),
        (a[1] &= 65535),
        (a[1] += e[2] * t[2]),
        (a[0] += a[1] >>> 16),
        (a[1] &= 65535),
        (a[1] += e[3] * t[1]),
        (a[0] += a[1] >>> 16),
        (a[1] &= 65535),
        (a[0] += e[0] * t[3] + e[1] * t[2] + e[2] * t[1] + e[3] * t[0]),
        (a[0] &= 65535),
        [(a[0] << 16) | a[1], (a[2] << 16) | a[3]]
      );
    },
    f = function (e, t) {
      return 32 === (t %= 64)
        ? [e[1], e[0]]
        : t < 32
        ? [(e[0] << t) | (e[1] >>> (32 - t)), (e[1] << t) | (e[0] >>> (32 - t))]
        : ((t -= 32),
          [
            (e[1] << t) | (e[0] >>> (32 - t)),
            (e[0] << t) | (e[1] >>> (32 - t)),
          ]);
    },
    h = function (e, t) {
      return 0 === (t %= 64)
        ? e
        : t < 32
        ? [(e[0] << t) | (e[1] >>> (32 - t)), e[1] << t]
        : [e[1] << (t - 32), 0];
    },
    m = function (e, t) {
      return [e[0] ^ t[0], e[1] ^ t[1]];
    },
    T = function (e) {
      return (
        (e = m(e, [0, e[0] >>> 1])),
        (e = g(e, [4283543511, 3981806797])),
        (e = m(e, [0, e[0] >>> 1])),
        (e = g(e, [3301882366, 444984403])),
        (e = m(e, [0, e[0] >>> 1]))
      );
    },
    l = function (e, t) {
      t = t || 0;
      for (
        var a = (e = e || "").length % 16,
          n = e.length - a,
          r = [0, t],
          i = [0, t],
          o = [0, 0],
          l = [0, 0],
          s = [2277735313, 289559509],
          c = [1291169091, 658871167],
          u = 0;
        u < n;
        u += 16
      )
        (o = [
          (255 & e.charCodeAt(u + 4)) |
            ((255 & e.charCodeAt(u + 5)) << 8) |
            ((255 & e.charCodeAt(u + 6)) << 16) |
            ((255 & e.charCodeAt(u + 7)) << 24),
          (255 & e.charCodeAt(u)) |
            ((255 & e.charCodeAt(u + 1)) << 8) |
            ((255 & e.charCodeAt(u + 2)) << 16) |
            ((255 & e.charCodeAt(u + 3)) << 24),
        ]),
          (l = [
            (255 & e.charCodeAt(u + 12)) |
              ((255 & e.charCodeAt(u + 13)) << 8) |
              ((255 & e.charCodeAt(u + 14)) << 16) |
              ((255 & e.charCodeAt(u + 15)) << 24),
            (255 & e.charCodeAt(u + 8)) |
              ((255 & e.charCodeAt(u + 9)) << 8) |
              ((255 & e.charCodeAt(u + 10)) << 16) |
              ((255 & e.charCodeAt(u + 11)) << 24),
          ]),
          (o = g(o, s)),
          (o = f(o, 31)),
          (o = g(o, c)),
          (r = m(r, o)),
          (r = f(r, 27)),
          (r = d(r, i)),
          (r = d(g(r, [0, 5]), [0, 1390208809])),
          (l = g(l, c)),
          (l = f(l, 33)),
          (l = g(l, s)),
          (i = m(i, l)),
          (i = f(i, 31)),
          (i = d(i, r)),
          (i = d(g(i, [0, 5]), [0, 944331445]));
      switch (((o = [0, 0]), (l = [0, 0]), a)) {
        case 15:
          l = m(l, h([0, e.charCodeAt(u + 14)], 48));
        case 14:
          l = m(l, h([0, e.charCodeAt(u + 13)], 40));
        case 13:
          l = m(l, h([0, e.charCodeAt(u + 12)], 32));
        case 12:
          l = m(l, h([0, e.charCodeAt(u + 11)], 24));
        case 11:
          l = m(l, h([0, e.charCodeAt(u + 10)], 16));
        case 10:
          l = m(l, h([0, e.charCodeAt(u + 9)], 8));
        case 9:
          (l = m(l, [0, e.charCodeAt(u + 8)])),
            (l = g(l, c)),
            (l = f(l, 33)),
            (l = g(l, s)),
            (i = m(i, l));
        case 8:
          o = m(o, h([0, e.charCodeAt(u + 7)], 56));
        case 7:
          o = m(o, h([0, e.charCodeAt(u + 6)], 48));
        case 6:
          o = m(o, h([0, e.charCodeAt(u + 5)], 40));
        case 5:
          o = m(o, h([0, e.charCodeAt(u + 4)], 32));
        case 4:
          o = m(o, h([0, e.charCodeAt(u + 3)], 24));
        case 3:
          o = m(o, h([0, e.charCodeAt(u + 2)], 16));
        case 2:
          o = m(o, h([0, e.charCodeAt(u + 1)], 8));
        case 1:
          (o = m(o, [0, e.charCodeAt(u)])),
            (o = g(o, s)),
            (o = f(o, 31)),
            (o = g(o, c)),
            (r = m(r, o));
      }
      return (
        (r = m(r, [0, e.length])),
        (i = m(i, [0, e.length])),
        (r = d(r, i)),
        (i = d(i, r)),
        (r = T(r)),
        (i = T(i)),
        (r = d(r, i)),
        (i = d(i, r)),
        ("00000000" + (r[0] >>> 0).toString(16)).slice(-8) +
          ("00000000" + (r[1] >>> 0).toString(16)).slice(-8) +
          ("00000000" + (i[0] >>> 0).toString(16)).slice(-8) +
          ("00000000" + (i[1] >>> 0).toString(16)).slice(-8)
      );
    },
    e = {
      preprocessor: null,
      audio: { timeout: 1e3, excludeIOS11: !0 },
      fonts: {
        swfContainerId: "fingerprintjs2",
        swfPath: "flash/compiled/FontList.swf",
        userDefinedFonts: [],
        extendedJsFonts: !1,
      },
      screen: { detectScreenOrientation: !0 },
      plugins: { sortPluginsFor: [/palemoon/i], excludeIE: !1 },
      extraComponents: [],
      excludes: {
        enumerateDevices: !0,
        pixelRatio: !0,
        doNotTrack: !0,
        fontsFlash: !0,
      },
      NOT_AVAILABLE: "not available",
      ERROR: "error",
      EXCLUDED: "excluded",
    },
    c = function (e, t) {
      if (Array.prototype.forEach && e.forEach === Array.prototype.forEach)
        e.forEach(t);
      else if (e.length === +e.length)
        for (var a = 0, n = e.length; a < n; a++) t(e[a], a, e);
      else for (var r in e) e.hasOwnProperty(r) && t(e[r], r, e);
    },
    s = function (e, n) {
      var r = [];
      return null == e
        ? r
        : Array.prototype.map && e.map === Array.prototype.map
        ? e.map(n)
        : (c(e, function (e, t, a) {
            r.push(n(e, t, a));
          }),
          r);
    },
    a = function () {
      return navigator.mediaDevices && navigator.mediaDevices.enumerateDevices;
    },
    n = function (e) {
      var t = [window.screen.width, window.screen.height];
      return e.screen.detectScreenOrientation && t.sort().reverse(), t;
    },
    r = function (e) {
      if (window.screen.availWidth && window.screen.availHeight) {
        var t = [window.screen.availHeight, window.screen.availWidth];
        return e.screen.detectScreenOrientation && t.sort().reverse(), t;
      }
      return e.NOT_AVAILABLE;
    },
    i = function (e) {
      if (null == navigator.plugins) return e.NOT_AVAILABLE;
      for (var t = [], a = 0, n = navigator.plugins.length; a < n; a++)
        navigator.plugins[a] && t.push(navigator.plugins[a]);
      return (
        u(e) &&
          (t = t.sort(function (e, t) {
            return e.name > t.name ? 1 : e.name < t.name ? -1 : 0;
          })),
        s(t, function (e) {
          var t = s(e, function (e) {
            return [e.type, e.suffixes];
          });
          return [e.name, e.description, t];
        })
      );
    },
    o = function (t) {
      var e = [];
      if (
        (Object.getOwnPropertyDescriptor &&
          Object.getOwnPropertyDescriptor(window, "ActiveXObject")) ||
        "ActiveXObject" in window
      ) {
        e = s(
          [
            "AcroPDF.PDF",
            "Adodb.Stream",
            "AgControl.AgControl",
            "DevalVRXCtrl.DevalVRXCtrl.1",
            "MacromediaFlashPaper.MacromediaFlashPaper",
            "Msxml2.DOMDocument",
            "Msxml2.XMLHTTP",
            "PDF.PdfCtrl",
            "QuickTime.QuickTime",
            "QuickTimeCheckObject.QuickTimeCheck.1",
            "RealPlayer",
            "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)",
            "RealVideo.RealVideo(tm) ActiveX Control (32-bit)",
            "Scripting.Dictionary",
            "SWCtl.SWCtl",
            "Shell.UIHelper",
            "ShockwaveFlash.ShockwaveFlash",
            "Skype.Detection",
            "TDCCtl.TDCCtl",
            "WMPlayer.OCX",
            "rmocx.RealPlayer G2 Control",
            "rmocx.RealPlayer G2 Control.1",
          ],
          function (e) {
            try {
              return new window.ActiveXObject(e), e;
            } catch (e) {
              return t.ERROR;
            }
          }
        );
      } else e.push(t.NOT_AVAILABLE);
      return navigator.plugins && (e = e.concat(i(t))), e;
    },
    u = function (e) {
      for (var t = !1, a = 0, n = e.plugins.sortPluginsFor.length; a < n; a++) {
        var r = e.plugins.sortPluginsFor[a];
        if (navigator.userAgent.match(r)) {
          t = !0;
          break;
        }
      }
      return t;
    },
    p = function (t) {
      try {
        return !!window.sessionStorage;
      } catch (e) {
        return t.ERROR;
      }
    },
    v = function (t) {
      try {
        return !!window.localStorage;
      } catch (e) {
        return t.ERROR;
      }
    },
    A = function (t) {
      try {
        return !!window.indexedDB;
      } catch (e) {
        return t.ERROR;
      }
    },
    S = function (e) {
      return navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency
        : e.NOT_AVAILABLE;
    },
    C = function (e) {
      return navigator.cpuClass || e.NOT_AVAILABLE;
    },
    B = function (e) {
      return navigator.platform ? navigator.platform : e.NOT_AVAILABLE;
    },
    w = function (e) {
      return navigator.doNotTrack
        ? navigator.doNotTrack
        : navigator.msDoNotTrack
        ? navigator.msDoNotTrack
        : window.doNotTrack
        ? window.doNotTrack
        : e.NOT_AVAILABLE;
    },
    t = function () {
      var t,
        e = 0;
      void 0 !== navigator.maxTouchPoints
        ? (e = navigator.maxTouchPoints)
        : void 0 !== navigator.msMaxTouchPoints &&
          (e = navigator.msMaxTouchPoints);
      try {
        document.createEvent("TouchEvent"), (t = !0);
      } catch (e) {
        t = !1;
      }
      return [e, t, "ontouchstart" in window];
    },
    y = function (e) {
      var t = [],
        a = document.createElement("canvas");
      (a.width = 2e3), (a.height = 200), (a.style.display = "inline");
      var n = a.getContext("2d");
      return (
        n.rect(0, 0, 10, 10),
        n.rect(2, 2, 6, 6),
        t.push(
          "canvas winding:" +
            (!1 === n.isPointInPath(5, 5, "evenodd") ? "yes" : "no")
        ),
        (n.textBaseline = "alphabetic"),
        (n.fillStyle = "#f60"),
        n.fillRect(125, 1, 62, 20),
        (n.fillStyle = "#069"),
        e.dontUseFakeFontInCanvas
          ? (n.font = "11pt Arial")
          : (n.font = "11pt no-real-font-123"),
        n.fillText("Cwm fjordbank glyphs vext quiz, 😃", 2, 15),
        (n.fillStyle = "rgba(102, 204, 0, 0.2)"),
        (n.font = "18pt Arial"),
        n.fillText("Cwm fjordbank glyphs vext quiz, 😃", 4, 45),
        (n.globalCompositeOperation = "multiply"),
        (n.fillStyle = "rgb(255,0,255)"),
        n.beginPath(),
        n.arc(50, 50, 50, 0, 2 * Math.PI, !0),
        n.closePath(),
        n.fill(),
        (n.fillStyle = "rgb(0,255,255)"),
        n.beginPath(),
        n.arc(100, 50, 50, 0, 2 * Math.PI, !0),
        n.closePath(),
        n.fill(),
        (n.fillStyle = "rgb(255,255,0)"),
        n.beginPath(),
        n.arc(75, 100, 50, 0, 2 * Math.PI, !0),
        n.closePath(),
        n.fill(),
        (n.fillStyle = "rgb(255,0,255)"),
        n.arc(75, 75, 75, 0, 2 * Math.PI, !0),
        n.arc(75, 75, 25, 0, 2 * Math.PI, !0),
        n.fill("evenodd"),
        a.toDataURL && t.push("canvas fp:" + a.toDataURL()),
        t
      );
    },
    E = function () {
      var o,
        e = function (e) {
          return (
            o.clearColor(0, 0, 0, 1),
            o.enable(o.DEPTH_TEST),
            o.depthFunc(o.LEQUAL),
            o.clear(o.COLOR_BUFFER_BIT | o.DEPTH_BUFFER_BIT),
            "[" + e[0] + ", " + e[1] + "]"
          );
        };
      if (!(o = F())) return null;
      var l = [],
        t = o.createBuffer();
      o.bindBuffer(o.ARRAY_BUFFER, t);
      var a = new Float32Array([
        -0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0,
      ]);
      o.bufferData(o.ARRAY_BUFFER, a, o.STATIC_DRAW),
        (t.itemSize = 3),
        (t.numItems = 3);
      var n = o.createProgram(),
        r = o.createShader(o.VERTEX_SHADER);
      o.shaderSource(
        r,
        "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}"
      ),
        o.compileShader(r);
      var i = o.createShader(o.FRAGMENT_SHADER);
      o.shaderSource(
        i,
        "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}"
      ),
        o.compileShader(i),
        o.attachShader(n, r),
        o.attachShader(n, i),
        o.linkProgram(n),
        o.useProgram(n),
        (n.vertexPosAttrib = o.getAttribLocation(n, "attrVertex")),
        (n.offsetUniform = o.getUniformLocation(n, "uniformOffset")),
        o.enableVertexAttribArray(n.vertexPosArray),
        o.vertexAttribPointer(n.vertexPosAttrib, t.itemSize, o.FLOAT, !1, 0, 0),
        o.uniform2f(n.offsetUniform, 1, 1),
        o.drawArrays(o.TRIANGLE_STRIP, 0, t.numItems);
      try {
        l.push(o.canvas.toDataURL());
      } catch (e) {}
      l.push("extensions:" + (o.getSupportedExtensions() || []).join(";")),
        l.push(
          "webgl aliased line width range:" +
            e(o.getParameter(o.ALIASED_LINE_WIDTH_RANGE))
        ),
        l.push(
          "webgl aliased point size range:" +
            e(o.getParameter(o.ALIASED_POINT_SIZE_RANGE))
        ),
        l.push("webgl alpha bits:" + o.getParameter(o.ALPHA_BITS)),
        l.push(
          "webgl antialiasing:" +
            (o.getContextAttributes().antialias ? "yes" : "no")
        ),
        l.push("webgl blue bits:" + o.getParameter(o.BLUE_BITS)),
        l.push("webgl depth bits:" + o.getParameter(o.DEPTH_BITS)),
        l.push("webgl green bits:" + o.getParameter(o.GREEN_BITS)),
        l.push(
          "webgl max anisotropy:" +
            (function (e) {
              var t =
                e.getExtension("EXT_texture_filter_anisotropic") ||
                e.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
                e.getExtension("MOZ_EXT_texture_filter_anisotropic");
              if (t) {
                var a = e.getParameter(t.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                return 0 === a && (a = 2), a;
              }
              return null;
            })(o)
        ),
        l.push(
          "webgl max combined texture image units:" +
            o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
        ),
        l.push(
          "webgl max cube map texture size:" +
            o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE)
        ),
        l.push(
          "webgl max fragment uniform vectors:" +
            o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS)
        ),
        l.push(
          "webgl max render buffer size:" +
            o.getParameter(o.MAX_RENDERBUFFER_SIZE)
        ),
        l.push(
          "webgl max texture image units:" +
            o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS)
        ),
        l.push("webgl max texture size:" + o.getParameter(o.MAX_TEXTURE_SIZE)),
        l.push(
          "webgl max varying vectors:" + o.getParameter(o.MAX_VARYING_VECTORS)
        ),
        l.push(
          "webgl max vertex attribs:" + o.getParameter(o.MAX_VERTEX_ATTRIBS)
        ),
        l.push(
          "webgl max vertex texture image units:" +
            o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS)
        ),
        l.push(
          "webgl max vertex uniform vectors:" +
            o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS)
        ),
        l.push(
          "webgl max viewport dims:" + e(o.getParameter(o.MAX_VIEWPORT_DIMS))
        ),
        l.push("webgl red bits:" + o.getParameter(o.RED_BITS)),
        l.push("webgl renderer:" + o.getParameter(o.RENDERER)),
        l.push(
          "webgl shading language version:" +
            o.getParameter(o.SHADING_LANGUAGE_VERSION)
        ),
        l.push("webgl stencil bits:" + o.getParameter(o.STENCIL_BITS)),
        l.push("webgl vendor:" + o.getParameter(o.VENDOR)),
        l.push("webgl version:" + o.getParameter(o.VERSION));
      try {
        var s = o.getExtension("WEBGL_debug_renderer_info");
        s &&
          (l.push(
            "webgl unmasked vendor:" + o.getParameter(s.UNMASKED_VENDOR_WEBGL)
          ),
          l.push(
            "webgl unmasked renderer:" +
              o.getParameter(s.UNMASKED_RENDERER_WEBGL)
          ));
      } catch (e) {}
      return (
        o.getShaderPrecisionFormat &&
          c(["FLOAT", "INT"], function (i) {
            c(["VERTEX", "FRAGMENT"], function (r) {
              c(["HIGH", "MEDIUM", "LOW"], function (n) {
                c(["precision", "rangeMin", "rangeMax"], function (e) {
                  var t = o.getShaderPrecisionFormat(
                    o[r + "_SHADER"],
                    o[n + "_" + i]
                  )[e];
                  "precision" !== e && (e = "precision " + e);
                  var a = [
                    "webgl ",
                    r.toLowerCase(),
                    " shader ",
                    n.toLowerCase(),
                    " ",
                    i.toLowerCase(),
                    " ",
                    e,
                    ":",
                    t,
                  ].join("");
                  l.push(a);
                });
              });
            });
          }),
        l
      );
    },
    M = function () {
      try {
        var e = F(),
          t = e.getExtension("WEBGL_debug_renderer_info");
        return (
          e.getParameter(t.UNMASKED_VENDOR_WEBGL) +
          "~" +
          e.getParameter(t.UNMASKED_RENDERER_WEBGL)
        );
      } catch (e) {
        return null;
      }
    },
    x = function () {
      var e = document.createElement("div");
      e.innerHTML = "&nbsp;";
      var t = !(e.className = "adsbox");
      try {
        document.body.appendChild(e),
          (t = 0 === document.getElementsByClassName("adsbox")[0].offsetHeight),
          document.body.removeChild(e);
      } catch (e) {
        t = !1;
      }
      return t;
    },
    O = function () {
      if (void 0 !== navigator.languages)
        try {
          if (
            navigator.languages[0].substr(0, 2) !==
            navigator.language.substr(0, 2)
          )
            return !0;
        } catch (e) {
          return !0;
        }
      return !1;
    },
    b = function () {
      return (
        window.screen.width < window.screen.availWidth ||
        window.screen.height < window.screen.availHeight
      );
    },
    P = function () {
      var e,
        t = navigator.userAgent.toLowerCase(),
        a = navigator.oscpu,
        n = navigator.platform.toLowerCase();
      if (
        ((e =
          0 <= t.indexOf("windows phone")
            ? "Windows Phone"
            : 0 <= t.indexOf("win")
            ? "Windows"
            : 0 <= t.indexOf("android")
            ? "Android"
            : 0 <= t.indexOf("linux") || 0 <= t.indexOf("cros")
            ? "Linux"
            : 0 <= t.indexOf("iphone") || 0 <= t.indexOf("ipad")
            ? "iOS"
            : 0 <= t.indexOf("mac")
            ? "Mac"
            : "Other"),
        ("ontouchstart" in window ||
          0 < navigator.maxTouchPoints ||
          0 < navigator.msMaxTouchPoints) &&
          "Windows Phone" !== e &&
          "Android" !== e &&
          "iOS" !== e &&
          "Other" !== e)
      )
        return !0;
      if (void 0 !== a) {
        if (
          0 <= (a = a.toLowerCase()).indexOf("win") &&
          "Windows" !== e &&
          "Windows Phone" !== e
        )
          return !0;
        if (0 <= a.indexOf("linux") && "Linux" !== e && "Android" !== e)
          return !0;
        if (0 <= a.indexOf("mac") && "Mac" !== e && "iOS" !== e) return !0;
        if (
          (-1 === a.indexOf("win") &&
            -1 === a.indexOf("linux") &&
            -1 === a.indexOf("mac")) !=
          ("Other" === e)
        )
          return !0;
      }
      return (
        (0 <= n.indexOf("win") && "Windows" !== e && "Windows Phone" !== e) ||
        ((0 <= n.indexOf("linux") ||
          0 <= n.indexOf("android") ||
          0 <= n.indexOf("pike")) &&
          "Linux" !== e &&
          "Android" !== e) ||
        ((0 <= n.indexOf("mac") ||
          0 <= n.indexOf("ipad") ||
          0 <= n.indexOf("ipod") ||
          0 <= n.indexOf("iphone")) &&
          "Mac" !== e &&
          "iOS" !== e) ||
        (n.indexOf("win") < 0 &&
          n.indexOf("linux") < 0 &&
          n.indexOf("mac") < 0 &&
          n.indexOf("iphone") < 0 &&
          n.indexOf("ipad") < 0) !==
          ("Other" === e) ||
        (void 0 === navigator.plugins &&
          "Windows" !== e &&
          "Windows Phone" !== e)
      );
    },
    L = function () {
      var e,
        t = navigator.userAgent.toLowerCase(),
        a = navigator.productSub;
      if (
        ("Chrome" ===
          (e =
            0 <= t.indexOf("firefox")
              ? "Firefox"
              : 0 <= t.indexOf("opera") || 0 <= t.indexOf("opr")
              ? "Opera"
              : 0 <= t.indexOf("chrome")
              ? "Chrome"
              : 0 <= t.indexOf("safari")
              ? "Safari"
              : 0 <= t.indexOf("trident")
              ? "Internet Explorer"
              : "Other") ||
          "Safari" === e ||
          "Opera" === e) &&
        "20030107" !== a
      )
        return !0;
      var n,
        r = eval.toString().length;
      if (37 === r && "Safari" !== e && "Firefox" !== e && "Other" !== e)
        return !0;
      if (39 === r && "Internet Explorer" !== e && "Other" !== e) return !0;
      if (33 === r && "Chrome" !== e && "Opera" !== e && "Other" !== e)
        return !0;
      try {
        throw "a";
      } catch (e) {
        try {
          e.toSource(), (n = !0);
        } catch (e) {
          n = !1;
        }
      }
      return n && "Firefox" !== e && "Other" !== e;
    },
    I = function () {
      var e = document.createElement("canvas");
      return !(!e.getContext || !e.getContext("2d"));
    },
    k = function () {
      if (!I()) return !1;
      var e = F();
      return !!window.WebGLRenderingContext && !!e;
    },
    R = function () {
      return (
        "Microsoft Internet Explorer" === navigator.appName ||
        !(
          "Netscape" !== navigator.appName ||
          !/Trident/.test(navigator.userAgent)
        )
      );
    },
    D = function () {
      return void 0 !== window.swfobject;
    },
    N = function () {
      return window.swfobject.hasFlashPlayerVersion("9.0.0");
    },
    _ = function (t, e) {
      var a = "___fp_swf_loaded";
      window[a] = function (e) {
        t(e);
      };
      var n,
        r,
        i = e.fonts.swfContainerId;
      (r = document.createElement("div")).setAttribute(
        "id",
        n.fonts.swfContainerId
      ),
        document.body.appendChild(r);
      var o = { onReady: a };
      window.swfobject.embedSWF(
        e.fonts.swfPath,
        i,
        "1",
        "1",
        "9.0.0",
        !1,
        o,
        { allowScriptAccess: "always", menu: "false" },
        {}
      );
    },
    F = function () {
      var e = document.createElement("canvas"),
        t = null;
      try {
        t = e.getContext("webgl") || e.getContext("experimental-webgl");
      } catch (e) {}
      return t || (t = null), t;
    },
    G = [
      {
        key: "userAgent",
        getData: function (e) {
          e(navigator.userAgent);
        },
      },
      {
        key: "webdriver",
        getData: function (e, t) {
          e(
            null == navigator.webdriver ? t.NOT_AVAILABLE : navigator.webdriver
          );
        },
      },
      {
        key: "language",
        getData: function (e, t) {
          e(
            navigator.language ||
              navigator.userLanguage ||
              navigator.browserLanguage ||
              navigator.systemLanguage ||
              t.NOT_AVAILABLE
          );
        },
      },
      {
        key: "colorDepth",
        getData: function (e, t) {
          e(window.screen.colorDepth || t.NOT_AVAILABLE);
        },
      },
      {
        key: "deviceMemory",
        getData: function (e, t) {
          e(navigator.deviceMemory || t.NOT_AVAILABLE);
        },
      },
      {
        key: "pixelRatio",
        getData: function (e, t) {
          e(window.devicePixelRatio || t.NOT_AVAILABLE);
        },
      },
      {
        key: "hardwareConcurrency",
        getData: function (e, t) {
          e(S(t));
        },
      },
      {
        key: "screenResolution",
        getData: function (e, t) {
          e(n(t));
        },
      },
      {
        key: "availableScreenResolution",
        getData: function (e, t) {
          e(r(t));
        },
      },
      {
        key: "timezoneOffset",
        getData: function (e) {
          e(new Date().getTimezoneOffset());
        },
      },
      {
        key: "timezone",
        getData: function (e, t) {
          window.Intl && window.Intl.DateTimeFormat
            ? e(new window.Intl.DateTimeFormat().resolvedOptions().timeZone)
            : e(t.NOT_AVAILABLE);
        },
      },
      {
        key: "sessionStorage",
        getData: function (e, t) {
          e(p(t));
        },
      },
      {
        key: "localStorage",
        getData: function (e, t) {
          e(v(t));
        },
      },
      {
        key: "indexedDb",
        getData: function (e, t) {
          e(A(t));
        },
      },
      {
        key: "addBehavior",
        getData: function (e) {
          e(!(!document.body || !document.body.addBehavior));
        },
      },
      {
        key: "openDatabase",
        getData: function (e) {
          e(!!window.openDatabase);
        },
      },
      {
        key: "cpuClass",
        getData: function (e, t) {
          e(C(t));
        },
      },
      {
        key: "platform",
        getData: function (e, t) {
          e(B(t));
        },
      },
      {
        key: "doNotTrack",
        getData: function (e, t) {
          e(w(t));
        },
      },
      {
        key: "plugins",
        getData: function (e, t) {
          R() ? (t.plugins.excludeIE ? e(t.EXCLUDED) : e(o(t))) : e(i(t));
        },
      },
      {
        key: "canvas",
        getData: function (e, t) {
          I() ? e(y(t)) : e(t.NOT_AVAILABLE);
        },
      },
      {
        key: "webgl",
        getData: function (e, t) {
          k() ? e(E()) : e(t.NOT_AVAILABLE);
        },
      },
      {
        key: "webglVendorAndRenderer",
        getData: function (e) {
          k() ? e(M()) : e();
        },
      },
      {
        key: "adBlock",
        getData: function (e) {
          e(x());
        },
      },
      {
        key: "hasLiedLanguages",
        getData: function (e) {
          e(O());
        },
      },
      {
        key: "hasLiedResolution",
        getData: function (e) {
          e(b());
        },
      },
      {
        key: "hasLiedOs",
        getData: function (e) {
          e(P());
        },
      },
      {
        key: "hasLiedBrowser",
        getData: function (e) {
          e(L());
        },
      },
      {
        key: "touchSupport",
        getData: function (e) {
          e(t());
        },
      },
      {
        key: "fonts",
        getData: function (e, t) {
          var u = ["monospace", "sans-serif", "serif"],
            d = [
              "Andale Mono",
              "Arial",
              "Arial Black",
              "Arial Hebrew",
              "Arial MT",
              "Arial Narrow",
              "Arial Rounded MT Bold",
              "Arial Unicode MS",
              "Bitstream Vera Sans Mono",
              "Book Antiqua",
              "Bookman Old Style",
              "Calibri",
              "Cambria",
              "Cambria Math",
              "Century",
              "Century Gothic",
              "Century Schoolbook",
              "Comic Sans",
              "Comic Sans MS",
              "Consolas",
              "Courier",
              "Courier New",
              "Geneva",
              "Georgia",
              "Helvetica",
              "Helvetica Neue",
              "Impact",
              "Lucida Bright",
              "Lucida Calligraphy",
              "Lucida Console",
              "Lucida Fax",
              "LUCIDA GRANDE",
              "Lucida Handwriting",
              "Lucida Sans",
              "Lucida Sans Typewriter",
              "Lucida Sans Unicode",
              "Microsoft Sans Serif",
              "Monaco",
              "Monotype Corsiva",
              "MS Gothic",
              "MS Outlook",
              "MS PGothic",
              "MS Reference Sans Serif",
              "MS Sans Serif",
              "MS Serif",
              "MYRIAD",
              "MYRIAD PRO",
              "Palatino",
              "Palatino Linotype",
              "Segoe Print",
              "Segoe Script",
              "Segoe UI",
              "Segoe UI Light",
              "Segoe UI Semibold",
              "Segoe UI Symbol",
              "Tahoma",
              "Times",
              "Times New Roman",
              "Times New Roman PS",
              "Trebuchet MS",
              "Verdana",
              "Wingdings",
              "Wingdings 2",
              "Wingdings 3",
            ];
          t.fonts.extendedJsFonts &&
            (d = d.concat([
              "Abadi MT Condensed Light",
              "Academy Engraved LET",
              "ADOBE CASLON PRO",
              "Adobe Garamond",
              "ADOBE GARAMOND PRO",
              "Agency FB",
              "Aharoni",
              "Albertus Extra Bold",
              "Albertus Medium",
              "Algerian",
              "Amazone BT",
              "American Typewriter",
              "American Typewriter Condensed",
              "AmerType Md BT",
              "Andalus",
              "Angsana New",
              "AngsanaUPC",
              "Antique Olive",
              "Aparajita",
              "Apple Chancery",
              "Apple Color Emoji",
              "Apple SD Gothic Neo",
              "Arabic Typesetting",
              "ARCHER",
              "ARNO PRO",
              "Arrus BT",
              "Aurora Cn BT",
              "AvantGarde Bk BT",
              "AvantGarde Md BT",
              "AVENIR",
              "Ayuthaya",
              "Bandy",
              "Bangla Sangam MN",
              "Bank Gothic",
              "BankGothic Md BT",
              "Baskerville",
              "Baskerville Old Face",
              "Batang",
              "BatangChe",
              "Bauer Bodoni",
              "Bauhaus 93",
              "Bazooka",
              "Bell MT",
              "Bembo",
              "Benguiat Bk BT",
              "Berlin Sans FB",
              "Berlin Sans FB Demi",
              "Bernard MT Condensed",
              "BernhardFashion BT",
              "BernhardMod BT",
              "Big Caslon",
              "BinnerD",
              "Blackadder ITC",
              "BlairMdITC TT",
              "Bodoni 72",
              "Bodoni 72 Oldstyle",
              "Bodoni 72 Smallcaps",
              "Bodoni MT",
              "Bodoni MT Black",
              "Bodoni MT Condensed",
              "Bodoni MT Poster Compressed",
              "Bookshelf Symbol 7",
              "Boulder",
              "Bradley Hand",
              "Bradley Hand ITC",
              "Bremen Bd BT",
              "Britannic Bold",
              "Broadway",
              "Browallia New",
              "BrowalliaUPC",
              "Brush Script MT",
              "Californian FB",
              "Calisto MT",
              "Calligrapher",
              "Candara",
              "CaslonOpnface BT",
              "Castellar",
              "Centaur",
              "Cezanne",
              "CG Omega",
              "CG Times",
              "Chalkboard",
              "Chalkboard SE",
              "Chalkduster",
              "Charlesworth",
              "Charter Bd BT",
              "Charter BT",
              "Chaucer",
              "ChelthmITC Bk BT",
              "Chiller",
              "Clarendon",
              "Clarendon Condensed",
              "CloisterBlack BT",
              "Cochin",
              "Colonna MT",
              "Constantia",
              "Cooper Black",
              "Copperplate",
              "Copperplate Gothic",
              "Copperplate Gothic Bold",
              "Copperplate Gothic Light",
              "CopperplGoth Bd BT",
              "Corbel",
              "Cordia New",
              "CordiaUPC",
              "Cornerstone",
              "Coronet",
              "Cuckoo",
              "Curlz MT",
              "DaunPenh",
              "Dauphin",
              "David",
              "DB LCD Temp",
              "DELICIOUS",
              "Denmark",
              "DFKai-SB",
              "Didot",
              "DilleniaUPC",
              "DIN",
              "DokChampa",
              "Dotum",
              "DotumChe",
              "Ebrima",
              "Edwardian Script ITC",
              "Elephant",
              "English 111 Vivace BT",
              "Engravers MT",
              "EngraversGothic BT",
              "Eras Bold ITC",
              "Eras Demi ITC",
              "Eras Light ITC",
              "Eras Medium ITC",
              "EucrosiaUPC",
              "Euphemia",
              "Euphemia UCAS",
              "EUROSTILE",
              "Exotc350 Bd BT",
              "FangSong",
              "Felix Titling",
              "Fixedsys",
              "FONTIN",
              "Footlight MT Light",
              "Forte",
              "FrankRuehl",
              "Fransiscan",
              "Freefrm721 Blk BT",
              "FreesiaUPC",
              "Freestyle Script",
              "French Script MT",
              "FrnkGothITC Bk BT",
              "Fruitger",
              "FRUTIGER",
              "Futura",
              "Futura Bk BT",
              "Futura Lt BT",
              "Futura Md BT",
              "Futura ZBlk BT",
              "FuturaBlack BT",
              "Gabriola",
              "Galliard BT",
              "Gautami",
              "Geeza Pro",
              "Geometr231 BT",
              "Geometr231 Hv BT",
              "Geometr231 Lt BT",
              "GeoSlab 703 Lt BT",
              "GeoSlab 703 XBd BT",
              "Gigi",
              "Gill Sans",
              "Gill Sans MT",
              "Gill Sans MT Condensed",
              "Gill Sans MT Ext Condensed Bold",
              "Gill Sans Ultra Bold",
              "Gill Sans Ultra Bold Condensed",
              "Gisha",
              "Gloucester MT Extra Condensed",
              "GOTHAM",
              "GOTHAM BOLD",
              "Goudy Old Style",
              "Goudy Stout",
              "GoudyHandtooled BT",
              "GoudyOLSt BT",
              "Gujarati Sangam MN",
              "Gulim",
              "GulimChe",
              "Gungsuh",
              "GungsuhChe",
              "Gurmukhi MN",
              "Haettenschweiler",
              "Harlow Solid Italic",
              "Harrington",
              "Heather",
              "Heiti SC",
              "Heiti TC",
              "HELV",
              "Herald",
              "High Tower Text",
              "Hiragino Kaku Gothic ProN",
              "Hiragino Mincho ProN",
              "Hoefler Text",
              "Humanst 521 Cn BT",
              "Humanst521 BT",
              "Humanst521 Lt BT",
              "Imprint MT Shadow",
              "Incised901 Bd BT",
              "Incised901 BT",
              "Incised901 Lt BT",
              "INCONSOLATA",
              "Informal Roman",
              "Informal011 BT",
              "INTERSTATE",
              "IrisUPC",
              "Iskoola Pota",
              "JasmineUPC",
              "Jazz LET",
              "Jenson",
              "Jester",
              "Jokerman",
              "Juice ITC",
              "Kabel Bk BT",
              "Kabel Ult BT",
              "Kailasa",
              "KaiTi",
              "Kalinga",
              "Kannada Sangam MN",
              "Kartika",
              "Kaufmann Bd BT",
              "Kaufmann BT",
              "Khmer UI",
              "KodchiangUPC",
              "Kokila",
              "Korinna BT",
              "Kristen ITC",
              "Krungthep",
              "Kunstler Script",
              "Lao UI",
              "Latha",
              "Leelawadee",
              "Letter Gothic",
              "Levenim MT",
              "LilyUPC",
              "Lithograph",
              "Lithograph Light",
              "Long Island",
              "Lydian BT",
              "Magneto",
              "Maiandra GD",
              "Malayalam Sangam MN",
              "Malgun Gothic",
              "Mangal",
              "Marigold",
              "Marion",
              "Marker Felt",
              "Market",
              "Marlett",
              "Matisse ITC",
              "Matura MT Script Capitals",
              "Meiryo",
              "Meiryo UI",
              "Microsoft Himalaya",
              "Microsoft JhengHei",
              "Microsoft New Tai Lue",
              "Microsoft PhagsPa",
              "Microsoft Tai Le",
              "Microsoft Uighur",
              "Microsoft YaHei",
              "Microsoft Yi Baiti",
              "MingLiU",
              "MingLiU_HKSCS",
              "MingLiU_HKSCS-ExtB",
              "MingLiU-ExtB",
              "Minion",
              "Minion Pro",
              "Miriam",
              "Miriam Fixed",
              "Mistral",
              "Modern",
              "Modern No. 20",
              "Mona Lisa Solid ITC TT",
              "Mongolian Baiti",
              "MONO",
              "MoolBoran",
              "Mrs Eaves",
              "MS LineDraw",
              "MS Mincho",
              "MS PMincho",
              "MS Reference Specialty",
              "MS UI Gothic",
              "MT Extra",
              "MUSEO",
              "MV Boli",
              "Nadeem",
              "Narkisim",
              "NEVIS",
              "News Gothic",
              "News GothicMT",
              "NewsGoth BT",
              "Niagara Engraved",
              "Niagara Solid",
              "Noteworthy",
              "NSimSun",
              "Nyala",
              "OCR A Extended",
              "Old Century",
              "Old English Text MT",
              "Onyx",
              "Onyx BT",
              "OPTIMA",
              "Oriya Sangam MN",
              "OSAKA",
              "OzHandicraft BT",
              "Palace Script MT",
              "Papyrus",
              "Parchment",
              "Party LET",
              "Pegasus",
              "Perpetua",
              "Perpetua Titling MT",
              "PetitaBold",
              "Pickwick",
              "Plantagenet Cherokee",
              "Playbill",
              "PMingLiU",
              "PMingLiU-ExtB",
              "Poor Richard",
              "Poster",
              "PosterBodoni BT",
              "PRINCETOWN LET",
              "Pristina",
              "PTBarnum BT",
              "Pythagoras",
              "Raavi",
              "Rage Italic",
              "Ravie",
              "Ribbon131 Bd BT",
              "Rockwell",
              "Rockwell Condensed",
              "Rockwell Extra Bold",
              "Rod",
              "Roman",
              "Sakkal Majalla",
              "Santa Fe LET",
              "Savoye LET",
              "Sceptre",
              "Script",
              "Script MT Bold",
              "SCRIPTINA",
              "Serifa",
              "Serifa BT",
              "Serifa Th BT",
              "ShelleyVolante BT",
              "Sherwood",
              "Shonar Bangla",
              "Showcard Gothic",
              "Shruti",
              "Signboard",
              "SILKSCREEN",
              "SimHei",
              "Simplified Arabic",
              "Simplified Arabic Fixed",
              "SimSun",
              "SimSun-ExtB",
              "Sinhala Sangam MN",
              "Sketch Rockwell",
              "Skia",
              "Small Fonts",
              "Snap ITC",
              "Snell Roundhand",
              "Socket",
              "Souvenir Lt BT",
              "Staccato222 BT",
              "Steamer",
              "Stencil",
              "Storybook",
              "Styllo",
              "Subway",
              "Swis721 BlkEx BT",
              "Swiss911 XCm BT",
              "Sylfaen",
              "Synchro LET",
              "System",
              "Tamil Sangam MN",
              "Technical",
              "Teletype",
              "Telugu Sangam MN",
              "Tempus Sans ITC",
              "Terminal",
              "Thonburi",
              "Traditional Arabic",
              "Trajan",
              "TRAJAN PRO",
              "Tristan",
              "Tubular",
              "Tunga",
              "Tw Cen MT",
              "Tw Cen MT Condensed",
              "Tw Cen MT Condensed Extra Bold",
              "TypoUpright BT",
              "Unicorn",
              "Univers",
              "Univers CE 55 Medium",
              "Univers Condensed",
              "Utsaah",
              "Vagabond",
              "Vani",
              "Vijaya",
              "Viner Hand ITC",
              "VisualUI",
              "Vivaldi",
              "Vladimir Script",
              "Vrinda",
              "Westminster",
              "WHITNEY",
              "Wide Latin",
              "ZapfEllipt BT",
              "ZapfHumnst BT",
              "ZapfHumnst Dm BT",
              "Zapfino",
              "Zurich BlkEx BT",
              "Zurich Ex BT",
              "ZWAdobeF",
            ]));
          d = (d = d.concat(t.fonts.userDefinedFonts)).filter(function (e, t) {
            return d.indexOf(e) === t;
          });
          var a = document.getElementsByTagName("body")[0],
            r = document.createElement("div"),
            g = document.createElement("div"),
            n = {},
            i = {},
            f = function () {
              var e = document.createElement("span");
              return (
                (e.style.position = "absolute"),
                (e.style.left = "-9999px"),
                (e.style.fontSize = "72px"),
                (e.style.fontStyle = "normal"),
                (e.style.fontWeight = "normal"),
                (e.style.letterSpacing = "normal"),
                (e.style.lineBreak = "auto"),
                (e.style.lineHeight = "normal"),
                (e.style.textTransform = "none"),
                (e.style.textAlign = "left"),
                (e.style.textDecoration = "none"),
                (e.style.textShadow = "none"),
                (e.style.whiteSpace = "normal"),
                (e.style.wordBreak = "normal"),
                (e.style.wordSpacing = "normal"),
                (e.innerHTML = "mmmmmmmmmmlli"),
                e
              );
            },
            o = function (e) {
              for (var t = !1, a = 0; a < u.length; a++)
                if (
                  (t =
                    e[a].offsetWidth !== n[u[a]] ||
                    e[a].offsetHeight !== i[u[a]])
                )
                  return t;
              return t;
            },
            l = (function () {
              for (var e = [], t = 0, a = u.length; t < a; t++) {
                var n = f();
                (n.style.fontFamily = u[t]), r.appendChild(n), e.push(n);
              }
              return e;
            })();
          a.appendChild(r);
          for (var s = 0, c = u.length; s < c; s++)
            (n[u[s]] = l[s].offsetWidth), (i[u[s]] = l[s].offsetHeight);
          var h = (function () {
            for (var e, t, a, n = {}, r = 0, i = d.length; r < i; r++) {
              for (var o = [], l = 0, s = u.length; l < s; l++) {
                var c =
                  ((e = d[r]),
                  (t = u[l]),
                  (a = void 0),
                  ((a = f()).style.fontFamily = "'" + e + "'," + t),
                  a);
                g.appendChild(c), o.push(c);
              }
              n[d[r]] = o;
            }
            return n;
          })();
          a.appendChild(g);
          for (var m = [], T = 0, p = d.length; T < p; T++)
            o(h[d[T]]) && m.push(d[T]);
          a.removeChild(g), a.removeChild(r), e(m);
        },
        pauseBefore: !0,
      },
      {
        key: "fontsFlash",
        getData: function (t, e) {
          return D()
            ? N()
              ? e.fonts.swfPath
                ? void _(function (e) {
                    t(e);
                  }, e)
                : t("missing options.fonts.swfPath")
              : t("flash not installed")
            : t("swf object not loaded");
        },
        pauseBefore: !0,
      },
      {
        key: "audio",
        getData: function (a, e) {
          var t = e.audio;
          if (
            t.excludeIOS11 &&
            navigator.userAgent.match(/OS 11.+Version\/11.+Safari/)
          )
            return a(e.EXCLUDED);
          var n =
            window.OfflineAudioContext || window.webkitOfflineAudioContext;
          if (null == n) return a(e.NOT_AVAILABLE);
          var r = new n(1, 44100, 44100),
            i = r.createOscillator();
          (i.type = "triangle"), i.frequency.setValueAtTime(1e4, r.currentTime);
          var o = r.createDynamicsCompressor();
          c(
            [
              ["threshold", -50],
              ["knee", 40],
              ["ratio", 12],
              ["reduction", -20],
              ["attack", 0],
              ["release", 0.25],
            ],
            function (e) {
              void 0 !== o[e[0]] &&
                "function" == typeof o[e[0]].setValueAtTime &&
                o[e[0]].setValueAtTime(e[1], r.currentTime);
            }
          ),
            i.connect(o),
            o.connect(r.destination),
            i.start(0),
            r.startRendering();
          var l = setTimeout(function () {
            return (
              console.warn(
                'Audio fingerprint timed out. Please report bug at https://github.com/Valve/fingerprintjs2 with your user agent: "' +
                  navigator.userAgent +
                  '".'
              ),
              (r.oncomplete = function () {}),
              (r = null),
              a("audioTimeout")
            );
          }, t.timeout);
          r.oncomplete = function (e) {
            var t;
            try {
              clearTimeout(l),
                (t = e.renderedBuffer
                  .getChannelData(0)
                  .slice(4500, 5e3)
                  .reduce(function (e, t) {
                    return e + Math.abs(t);
                  }, 0)
                  .toString()),
                i.disconnect(),
                o.disconnect();
            } catch (e) {
              return void a(e);
            }
            a(t);
          };
        },
      },
      {
        key: "enumerateDevices",
        getData: function (t, e) {
          if (!a()) return t(e.NOT_AVAILABLE);
          navigator.mediaDevices
            .enumerateDevices()
            .then(function (e) {
              t(
                e.map(function (e) {
                  return (
                    "id=" +
                    e.deviceId +
                    ";gid=" +
                    e.groupId +
                    ";" +
                    e.kind +
                    ";" +
                    e.label
                  );
                })
              );
            })
            .catch(function (e) {
              t(e);
            });
        },
      },
    ],
    U = function (e) {
      throw new Error(
        "'new Fingerprint()' is deprecated, see https://github.com/Valve/fingerprintjs2#upgrade-guide-from-182-to-200"
      );
    };
  return (
    (U.get = function (a, n) {
      n ? a || (a = {}) : ((n = a), (a = {})),
        (function (e, t) {
          if (null == t) return;
          var a, n;
          for (n in t)
            null == (a = t[n]) ||
              Object.prototype.hasOwnProperty.call(e, n) ||
              (e[n] = a);
        })(a, e),
        (a.components = a.extraComponents.concat(G));
      var r = {
          data: [],
          addPreprocessedComponent: function (e, t) {
            "function" == typeof a.preprocessor && (t = a.preprocessor(e, t)),
              r.data.push({ key: e, value: t });
          },
        },
        i = -1,
        o = function (e) {
          if ((i += 1) >= a.components.length) n(r.data);
          else {
            var t = a.components[i];
            if (a.excludes[t.key]) o(!1);
            else {
              if (!e && t.pauseBefore)
                return (
                  (i -= 1),
                  void setTimeout(function () {
                    o(!0);
                  }, 1)
                );
              try {
                t.getData(function (e) {
                  r.addPreprocessedComponent(t.key, e), o(!1);
                }, a);
              } catch (e) {
                r.addPreprocessedComponent(t.key, String(e)), o(!1);
              }
            }
          }
        };
      o(!1);
    }),
    (U.getPromise = function (a) {
      return new Promise(function (e, t) {
        U.get(a, e);
      });
    }),
    (U.getV18 = function (i, o) {
      return (
        null == o && ((o = i), (i = {})),
        U.get(i, function (e) {
          for (var t = [], a = 0; a < e.length; a++) {
            var n = e[a];
            if (n.value === (i.NOT_AVAILABLE || "not available"))
              t.push({ key: n.key, value: "unknown" });
            else if ("plugins" === n.key)
              t.push({
                key: "plugins",
                value: s(n.value, function (e) {
                  var t = s(e[2], function (e) {
                    return e.join ? e.join("~") : e;
                  }).join(",");
                  return [e[0], e[1], t].join("::");
                }),
              });
            else if (-1 !== ["canvas", "webgl"].indexOf(n.key))
              t.push({ key: n.key, value: n.value.join("~") });
            else if (
              -1 !==
              [
                "sessionStorage",
                "localStorage",
                "indexedDb",
                "addBehavior",
                "openDatabase",
              ].indexOf(n.key)
            ) {
              if (!n.value) continue;
              t.push({ key: n.key, value: 1 });
            } else
              n.value
                ? t.push(
                    n.value.join ? { key: n.key, value: n.value.join(";") } : n
                  )
                : t.push({ key: n.key, value: n.value });
          }
          var r = l(
            s(t, function (e) {
              return e.value;
            }).join("~~~"),
            31
          );
          o(r, t);
        })
      );
    }),
    (U.x64hash128 = l),
    (U.VERSION = "2.1.0"),
    U
  );
});

// only call this method when JS is loaded -------------------------------------------------------------------------
CdpObserver.init();