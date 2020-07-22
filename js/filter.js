'use strict';

window.filter = (function () {
  var priceLevelToPrice = {
    middle: {
      MIN: 10000,
      MAX: 50000
    },
    low: {
      MIN: 0,
      MAX: 10000
    },
    high: {
      MIN: 50000,
      MAX: 10000000
    }
  };
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var selectType = mapFiltersContainer.querySelector('#housing-type');
  var selectPrice = mapFiltersContainer.querySelector('#housing-price');
  var selectRooms = mapFiltersContainer.querySelector('#housing-rooms');
  var selectGuests = mapFiltersContainer.querySelector('#housing-guests');
  var selectFeatures = mapFiltersContainer.querySelector('#housing-features');
  var allFeatures = selectFeatures.querySelectorAll('input');

  var filterType = function (ads) {
    if (selectType.value === 'any') {
      return ads;
    } else {
      return ads.slice().filter(function (ad) {
        return ad.offer.type === selectType.value;
      });
    }
  };

  var filterPrice = function (ads) {
    if (selectPrice.value === 'any') {
      return ads;
    } else {
      return ads.slice().filter(function (ad) {
        return ad.offer.price >= priceLevelToPrice[selectPrice.value].MIN &&
        ad.offer.price < priceLevelToPrice[selectPrice.value].MAX;
      });
    }
  };

  var filterRooms = function (ads) {
    if (selectRooms.value === 'any') {
      return ads;
    } else {
      return ads.slice().filter(function (ad) {
        return ad.offer.rooms === Number(selectRooms.value);
      });
    }
  };

  var filterGuests = function (ads) {
    if (selectGuests.value === 'any') {
      return ads;
    } else {
      return ads.slice().filter(function (ad) {
        return ad.offer.guests === Number(selectGuests.value);
      });
    }
  };

  var filterFeatures = function (ads) {
    for (var i = 0; i < allFeatures.length; i++) {
      if (allFeatures[i].checked === false) {
        ads = ads;
      } else {
        ads = ads.slice().filter(function (ad) {
          return ad.offer.features.includes(allFeatures[i].value);
        });
      }
    }
    return ads;
  };

  var getFilteredAds = function (loadedAds) {
    var filteredAds = loadedAds.slice();
    if (selectType.value === selectPrice.value === selectRooms === selectGuests === 'any') {
      filteredAds = filteredAds;
    } else {
      filteredAds = filterType(filteredAds);
      filteredAds = filterPrice(filteredAds);
      filteredAds = filterRooms(filteredAds);
      filteredAds = filterGuests(filteredAds);
      filteredAds = filterFeatures(filteredAds);
    }
    return filteredAds;
  };

  return {
    getFilteredAds: getFilteredAds
  };
})();
