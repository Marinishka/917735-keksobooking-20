'use strict';

window.data = (function () {
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var CHECKIN = ['12:00', '13:00', '14:00'];
  var TYPE_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];
  var ROOMS = [1, 2, 3, 100];
  var GUESTS = [1, 2, 3, 'не для гостей'];
  var Price = {
    MAX: 1000000,
    MIN: 1000
  };
  var LimitY = {
    MAX: 630,
    MIN: 130
  };
  var NUMBER_OF_ADS = 8;
  var mapPins = document.querySelector('.map__pins');
  var widthMapPins = mapPins.clientWidth;

  var createRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };
  var getRandomElement = function (someArray) {
    return someArray[createRandomNumber(0, someArray.length - 1)];
  };

  var getGuests = function (rooms) {
    var guests = '';
    switch (rooms) {
      case 1:
        guests = GUESTS[0];
        break;
      case 2:
        guests = createRandomNumber(GUESTS[0], GUESTS[1]);
        break;
      case 3:
        guests = createRandomNumber(GUESTS[0], GUESTS[2]);
        break;
      case 100:
        guests = GUESTS[3];
        break;
    }
    return guests;
  };

  return {
    LimitY: LimitY,
    FEATURES: FEATURES,
    createAds: function () {
      var adsList = [];
      for (var i = 1; i <= NUMBER_OF_ADS; i++) {
        var features = [];
        var featuresCopy = FEATURES.concat();
        for (var j = 0; j < createRandomNumber(0, FEATURES.length); j++) {
          features.push(getRandomElement(featuresCopy));
          featuresCopy.splice(featuresCopy.indexOf(features[j]), 1);
        }
        var photos = [];
        for (var h = 0; h < createRandomNumber(1, PHOTOS.length); h++) {
          photos.push(PHOTOS[h]);
        }
        var rooms = getRandomElement(ROOMS);
        var checkin = getRandomElement(CHECKIN);
        adsList.push({
          'author': {
            'avatar': 'img/avatars/user0' + i + '.png'
          },
          'location': {
            'x': createRandomNumber(0, widthMapPins),
            'y': createRandomNumber(LimitY.MIN, LimitY.MAX)
          },
          'offer': {
            'title': 'заголовок для ' + i + '-ого объявления',
            'address': 'адрес проживания',
            'price': createRandomNumber(Price.MIN, Price.MAX),
            'type': getRandomElement(TYPE_OF_HOUSING),
            'rooms': rooms,
            'guests': getGuests(rooms),
            'checkin': checkin,
            'checkout': checkin,
            'features': features,
            'description': 'строка с описанием ' + i + '-ого объявления',
            'photos': photos
          }
        });
      }
      return adsList;
    }
  };
})();
