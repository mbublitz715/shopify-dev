$(document).ready(function() {
  // CCPA
  var cityLookupSuccess,
      adPersonalization,
      caVisitor,
      checkAdPreferences;
  adPersonalization = Cookies.get('ad_personalization');
  caVisitor = Cookies.get('ca_visitor');

  function includes(container, value) {
    var returnValue = false;
    var pos = container.indexOf(value);
    if (pos >= 0) {
      returnValue = true;
    }
    return returnValue;
  }

  var cityLookupSuccess = function(location) {
    var names = Object.keys(location["subdivisions"][0].names).map(function(e) {
      return location["subdivisions"][0].names[e]
    });
    var inCA = includes(names, "California");
    Cookies.set('ca_visitor', inCA, {
      expires: 365,
      domain: 'kardia.com'
    });
    if (inCA) {
      checkAdPreferences()
    }
  }

  checkAdPreferences = function() {
    if (adPersonalization === undefined || adPersonalization !== 'off') {
      // if user did not previously click the link -- show it
      $('#do-not-sell').css('visibility', 'visible');
    } else if (adPersonalization === 'off') {
      // user has previously opted out, set preference
      gtag('set', 'allow_ad_personalization_signals', false);
    }
  }

  if (geoip2 && caVisitor === undefined) {
    // lookup where user is located
    geoip2.city(cityLookupSuccess, function(e){ console.log(e) });
  } else if (caVisitor === 'true') {
    // user has visited before and is from california
    checkAdPreferences()
  }

  checkAdPreferences()

  $('#do-not-sell').on('click', function() {
    gtag('set', 'allow_ad_personalization_signals', false);
    Cookies.set('ad_personalization', 'off', {
      expires: 365,
      domain: 'kardia.com'
    });
    $(this).css('visibility', 'hidden');
    $('.ccpa .confirmation').show().delay(5000).fadeOut();
  })
});