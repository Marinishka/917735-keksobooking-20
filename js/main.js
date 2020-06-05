'use strict';
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var TYPE_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];
var OFFSET_X = 25;
var OFFSET_Y = 70;
var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
var mapPins = document.querySelector('.map__pins');
var widthMapPins = mapPins.clientWidth;

var createRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getRandomElement = function (someArray) {
  return someArray[createRandomNumber(0, someArray.length - 1)];
};

var createAds = function () {
  var adsList = [];
  for (var i = 0; i < 8; i++) {
    var features = [];
    var featuresCopy = FEATURES.concat();
    features.length = createRandomNumber(0, FEATURES.length);
    for (var j = 0; j < features.length; j++) {
      features[j] = getRandomElement(featuresCopy);
      featuresCopy.splice(featuresCopy.indexOf(features[j]), 1);
    }
    var photos = [];
    photos.length = createRandomNumber(1, PHOTOS.length);
    for (var h = 0; h < photos.length; h++) {
      photos[h] = PHOTOS[h];
    }
    var adsListItem = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'location': {
        'y': createRandomNumber(130, 630),
        'x': createRandomNumber(0, widthMapPins)
      },
      'offer': {
        'title': 'строка, заголовок предложения',
        'address': location.x + ', ' + location.y,
        'price': 'число, стоимость',
        'type': getRandomElement(TYPE_OF_HOUSING),
        'rooms': 'число, количество комнат',
        'guests': 'число, количество гостей, которое можно разместить',
        'checkin': getRandomElement(CHECKIN),
        'checkout': getRandomElement(CHECKOUT),
        'features': features,
        'photos': photos
      }
    };
    adsList[i] = adsListItem;
  }
  return adsList;
};

map.classList.remove('map--faded');

var adsList = createAds();

console.log(adsList);

for (var i = 0; i < adsList.length; i++) {
  var pinOnMap = pinTemplate.cloneNode(true);
  pinOnMap.style.left = (adsList[i].location.x - OFFSET_X) + 'px';
  pinOnMap.style.top = (adsList[i].location.y - OFFSET_Y) + 'px';
  var imageOfPin = pinOnMap.querySelector('img');
  imageOfPin.src = adsList[i].author.avatar;
  imageOfPin.alt = adsList[i].offer.title;
  fragment.appendChild(pinOnMap);
}

mapPins.appendChild(fragment);
