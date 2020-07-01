'use strict';

window.pin = (function () {
  var Offset = {
    X: 25,
    Y: 70
  };
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var map = document.querySelector('.map');
  var changeCard = function (card, selectedAd) {
    if (card) {
      map.removeChild(card);
    }
    map.insertBefore(window.card.createCard(selectedAd), mapFiltersContainer);
  };

  var addPinListeners = function (element, selectedAd) {
    element.addEventListener('mousedown', function (evt) {
      var mapCard = map.querySelector('.map__card');
      if (evt.button === 0) {
        changeCard(mapCard, selectedAd);
      }
    });
    element.addEventListener('keydown', function (evt) {
      var mapCard = map.querySelector('.map__card');
      if (evt.key === 'Enter') {
        changeCard(mapCard, selectedAd);
      }
    });
  };
  return {
    createPins: function () {
      var adsList = window.data.createAds();
      for (var i = 0; i < adsList.length; i++) {
        var pinOnMap = pinTemplate.cloneNode(true);
        addPinListeners(pinOnMap, adsList[i]);
        pinOnMap.style.left = (adsList[i].location.x - Offset.X) + 'px';
        pinOnMap.style.top = (adsList[i].location.y - Offset.Y) + 'px';
        pinOnMap.setAttribute('data-number-of-ad', i);
        var imageOfPin = pinOnMap.querySelector('img');
        imageOfPin.src = adsList[i].author.avatar;
        imageOfPin.alt = adsList[i].offer.title;
        fragment.appendChild(pinOnMap);
      }
      mapPins.appendChild(fragment);
    }
  };
})();
