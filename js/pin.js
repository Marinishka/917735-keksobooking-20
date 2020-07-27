'use strict';

(function () {
  var MAX_QUANTITY_ADS = 5;
  var Offset = {
    X: 25,
    Y: 70
  };
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  var changeCard = function (card, selectedAd) {
    if (card) {
      window.main.map.removeChild(card);
    }
    window.main.map.insertBefore(window.card.create(selectedAd), mapFiltersContainer);
  };

  var changeActivePin = function (element) {
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
    element.classList.add('map__pin--active');
  };

  var addPinListeners = function (element, selectedAd) {
    element.addEventListener('mousedown', function (evt) {
      var mapCard = window.main.map.querySelector('.map__card');
      if (evt.button === window.main.KeyCode.MOUSE_LEFT_BUTTON) {
        changeCard(mapCard, selectedAd);
        changeActivePin(element);
      }
    });
    element.addEventListener('keydown', function (evt) {
      var mapCard = window.main.map.querySelector('.map__card');
      if (evt.key === window.main.KeyCode.ENTER) {
        changeCard(mapCard, selectedAd);
      }
    });
  };

  window.pin = {
    create: function (ads) {
      ads = ads.filter(function (ad) {
        return ad.offer;
      });
      var quantityAds = ads.length < MAX_QUANTITY_ADS ? ads.length : MAX_QUANTITY_ADS;
      for (var i = 0; i < quantityAds; i++) {
        var pinOnMap = pinTemplate.cloneNode(true);
        addPinListeners(pinOnMap, ads[i]);
        pinOnMap.style.left = (ads[i].location.x - Offset.X) + 'px';
        pinOnMap.style.top = (ads[i].location.y - Offset.Y) + 'px';
        var imageOfPin = pinOnMap.querySelector('img');
        imageOfPin.src = ads[i].author.avatar;
        imageOfPin.alt = ads[i].offer.title;
        fragment.appendChild(pinOnMap);
      }
      mapPins.appendChild(fragment);
    },
    MAX_QUANTITY_ADS: MAX_QUANTITY_ADS
  };
})();
