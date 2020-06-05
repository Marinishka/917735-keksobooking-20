'use strict';
var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
var mapPins = document.querySelector('.map__pins');
var widthMapPins = mapPins.clientWidth;
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var TYPE_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];

var createRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getRandomElement = function (someArray) {
  return someArray[createRandomNumber(0, someArray.length - 1)];
};

var createAds = function () {
  var adsList = [];
  for (var i = 0; i < 8; i++) {
    var adsListItem = {};
    var author = {};
    author.avatar = 'img/avatars/user0' + (i + 1) + '.png';
    var locationOnMap = {};
    locationOnMap.x = createRandomNumber(0, widthMapPins);
    locationOnMap.y = createRandomNumber(130, 630);
    var offer = {};
    offer.title = 'строка, заголовок предложения';
    offer.address = locationOnMap.x + ', ' + locationOnMap.y;
    offer.price = 'число, стоимость';
    offer.type = getRandomElement(TYPE_OF_HOUSING);
    offer.rooms = 'число, количество комнат';
    offer.guests = 'число, количество гостей, которое можно разместить';
    offer.checkin = getRandomElement(CHECKIN);
    offer.checkout = getRandomElement(CHECKOUT);
    var features = [];
    var featuresCopy = FEATURES.concat();
    features.length = createRandomNumber(0, FEATURES.length);
    for (var j = 0; j < features.length; j++) {
      features[j] = getRandomElement(featuresCopy);
      featuresCopy.splice(featuresCopy.indexOf(features[j]), 1);
    }
    offer.features = features;
    offer.description = 'строка с описанием';
    var photos = [];
    photos.length = createRandomNumber(1, PHOTOS.length);
    for (var h = 0; h < photos.length; h++) {
      photos[h] = PHOTOS[h];
    }
    offer.photos = photos;
    adsListItem = {
      'author': author,
      'location': locationOnMap,
      'offer': offer
    };
    adsList[i] = adsListItem;
  }
  return adsList;
};

map.classList.remove('map--faded');

var adsList = createAds();

for (var i = 0; i < adsList.length; i++) {
  var pinOnMap = pinTemplate.cloneNode(true);
  pinOnMap.style.left = (adsList[i].location.x - 25) + 'px';
  pinOnMap.style.top = (adsList[i].location.y - 70) + 'px';
  var imageOfPin = pinOnMap.querySelector('img');
  imageOfPin.src = adsList[i].author.avatar;
  imageOfPin.alt = adsList[i].offer.title;
  fragment.appendChild(pinOnMap);
}

mapPins.appendChild(fragment);
