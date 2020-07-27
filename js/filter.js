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
      return loadedAds.slice().filter(function (ad) {
        if (this.count < window.pin.MAX_QUANTITY_ADS && filterType(ad.offer.type)
        && filterPrice(ad.offer.price)
          && filterRooms(ad.offer.rooms)
          && filterGuests(ad.offer.guests)
          && filterFeatures(ad.offer.features)) {
          this.count++;
          return true;
        }
        return false;
      }, {count: 0});
    }
  };
})();
