'use strict';

window.filter = (function () {
  var priceLevelToPrice = {
    'middle': {
      MIN: 10000,
      MAX: 50000
    },
    'low': {
      MIN: 0,
      MAX: 10000
    },
    'high': {
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
      return;
    } else {
      var copy = ads.slice(0);
      for (var i = 0; i < copy.length; i++) {
        if (!(copy[i].offer.type === selectType.value)) {
          ads.splice(ads.indexOf(copy[i]), 1);
        }
      }
    }
  };

  var filterPrice = function (ads) {
    if (selectPrice.value === 'any') {
      return;
    } else {
      var copy = ads.slice(0);
      for (var i = 0; i < copy.length; i++) {
        if (!(copy[i].offer.price >= priceLevelToPrice[selectPrice.value].MIN &&
              copy[i].offer.price < priceLevelToPrice[selectPrice.value].MAX)) {
          ads.splice(ads.indexOf(copy[i]), 1);
        }
      }
    }
  };

  var filterRooms = function (ads) {
    if (selectRooms.value === 'any') {
      return;
    } else {
      var copy = ads.slice(0);
      for (var i = 0; i < copy.length; i++) {
        if (!(copy[i].offer.rooms === Number(selectRooms.value))) {
          ads.splice(ads.indexOf(copy[i]), 1);
        }
      }
    }
  };

  var filterGuests = function (ads) {
    if (selectGuests.value === 'any') {
      return;
    } else {
      var copy = ads.slice(0);
      for (var i = 0; i < copy.length; i++) {
        if (!(copy[i].offer.guests === Number(selectGuests.value))) {
          ads.splice(ads.indexOf(copy[i]), 1);
        }
      }
    }
  };

  var filterFeatures = function (ads) {
    var copy = ads.slice(0);
    for (var i = 0; i < allFeatures.length; i++) {
      if (allFeatures[i].checked === true) {
        for (var j = 0; j < copy.length; j++) {
          if (!(copy[j].offer.features.includes(allFeatures[i].value))) {
            ads.splice(ads.indexOf(copy[j]), 1);
          }
        }
      }
    }
  };

  return {
    filterType: filterType,
    filterPrice: filterPrice,
    filterRooms: filterRooms,
    filterGuests: filterGuests,
    filterFeatures: filterFeatures
  };
})();
