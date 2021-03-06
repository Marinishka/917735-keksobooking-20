'use strict';

(function () {
  var typeToTypeInCard = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var getCapacityOffer = function (rooms, guests) {
    var roomsText = '';
    var guestsText = '';
    if (rooms === 100) {
      roomsText = rooms + ' комнат ';
    } else if (rooms === 1) {
      roomsText = rooms + ' комната для ';
    } else {
      roomsText = rooms + ' комнаты для ';
    }
    if (guests === 'не для гостей') {
      guestsText = guests;
    } else if (guests === 1) {
      guestsText = guests + ' гостя.';
    } else {
      guestsText = guests + ' гостей.';
    }
    return roomsText + guestsText;
  };

  var closeEscapePress = function (evt) {
    deactivatePin();
    var activeCardOfAd = window.main.map.querySelector('.map__card');
    if (evt.key === window.main.KeyCode.ESCAPE) {
      if (activeCardOfAd) {
        window.main.map.removeChild(activeCardOfAd);
      }
      document.removeEventListener('keydown', closeEscapePress);
    }
  };

  var deactivatePin = function () {
    var activeElement = document.querySelector('.map__pin--active');
    if (activeElement) {
      activeElement.classList.remove('map__pin--active');
    }
  };

  window.card = {
    create: function (ad) {
      var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
      var cardOfAd = cardTemplate.cloneNode(true);
      var titleOfAd = cardOfAd.querySelector('.popup__title');
      var addressOfLodging = cardOfAd.querySelector('.popup__text--address');
      var priceOfLodging = cardOfAd.querySelector('.popup__text--price');
      var typeOfLodging = cardOfAd.querySelector('.popup__type');
      var capacity = cardOfAd.querySelector('.popup__text--capacity');
      var timeCheckinCheckout = cardOfAd.querySelector('.popup__text--time');
      var featuresOfLodging = cardOfAd.querySelector('.popup__features');
      var descriptionOfLodging = cardOfAd.querySelector('.popup__description');
      var photosOfLodging = cardOfAd.querySelector('.popup__photos');
      var photoOfLodging = cardOfAd.querySelector('.popup__photo');
      var usersAvatar = cardOfAd.querySelector('.popup__avatar');
      var closeButton = cardOfAd.querySelector('.popup__close');

      titleOfAd.textContent = ad.offer.title;
      addressOfLodging.textContent = ad.offer.address;
      priceOfLodging.textContent = ad.offer.price + '₽/ночь';
      if (ad.offer.type) {
        typeOfLodging.textContent = typeToTypeInCard[ad.offer.type];
      } else {
        typeOfLodging.style = 'display: none';
      }
      capacity.textContent = getCapacityOffer(ad.offer.rooms, ad.offer.guests);
      timeCheckinCheckout.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout + '.';
      if (ad.offer.features.length === 0) {
        featuresOfLodging.style = 'display: none';
      } else {
        for (var j = 0; j < FEATURES.length; j++) {
          if (!ad.offer.features.includes(FEATURES[j])) {
            var removeFeature = featuresOfLodging.querySelector('.popup__feature--' + FEATURES[j]);
            removeFeature.remove();
          }
        }
      }
      descriptionOfLodging.textContent = ad.offer.description;
      if (ad.offer.photos.length === 1) {
        photoOfLodging.src = ad.offer.photos[0];
      } else if (ad.offer.photos.length > 1) {
        for (var k = 1; k < ad.offer.photos.length; k++) {
          photoOfLodging.src = ad.offer.photos[0];
          var nthPhotoOfLodging = photoOfLodging.cloneNode(true);
          nthPhotoOfLodging.src = ad.offer.photos[k];
          photosOfLodging.appendChild(nthPhotoOfLodging);
        }
      } else {
        photosOfLodging.remove();
      }
      usersAvatar.src = ad.author.avatar;

      closeButton.addEventListener('mousedown', function () {
        deactivatePin();
        window.main.map.removeChild(cardOfAd);
        document.removeEventListener('keydown', closeEscapePress);
      });

      closeButton.addEventListener('keydown', function (evt) {
        deactivatePin();
        if (evt.key === window.main.KeyCode.ENTER) {
          window.main.map.removeChild(cardOfAd);
        }
        document.removeEventListener('keydown', closeEscapePress);
      });
      document.removeEventListener('keydown', closeEscapePress);
      document.addEventListener('keydown', closeEscapePress);
      return cardOfAd;
    },
    closeEscapePress: closeEscapePress
  };
})();
