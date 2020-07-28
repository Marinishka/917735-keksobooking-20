'use strict';

(function () {
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

  var filterType = function (type) {
    return selectType.value === 'any' || type === selectType.value;
  };

  var filterPrice = function (price) {
    return selectPrice.value === 'any' || price >= priceLevelToPrice[selectPrice.value].MIN &&
    price < priceLevelToPrice[selectPrice.value].MAX;
  };

  var filterRooms = function (rooms) {
    return selectRooms.value === 'any' || rooms === Number(selectRooms.value);
  };

  var filterGuests = function (guests) {
    return selectGuests.value === 'any' || guests === Number(selectGuests.value);
  };

  var filterFeatures = function (features) {
    var checkedFeatures = mapFiltersContainer.querySelectorAll('input:checked');
    return Array.from(checkedFeatures).every(function (feature) {
      return features.includes(feature.value);
    });
  };

  window.filter = {
    getAds: function (loadedAds) {
      var ads = [];
      for (var i = 0; i < loadedAds.length; i++) {
        if (filterType(loadedAds[i].offer.type)
          && filterPrice(loadedAds[i].offer.price)
            && filterRooms(loadedAds[i].offer.rooms)
            && filterGuests(loadedAds[i].offer.guests)
            && filterFeatures(loadedAds[i].offer.features)) {
          ads.push(loadedAds[i]);
          if (ads.length === window.pin.MAX_QUANTITY_ADS) {
            break;
          }
        }
      }
      return ads;
    }
  };
})();
