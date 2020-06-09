'use strict';
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var TYPE_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];
var OFFSET_X = 25;
var OFFSET_Y = 70;
var ROOMS_MAX = 100;
var ROOMS_MIN = 100;
var GUESTS_MAX = 3;
var GUESTS_MIN = 3;
var PRICE_MAX = 1000000;
var PRICE_MIN = 1000;
var LIMIT_Y_MAX = 630;
var LIMIT_Y_MIN = 130;
var map = document.querySelector('.map');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
var mapPins = document.querySelector('.map__pins');
var widthMapPins = mapPins.clientWidth;
var titleOfAd = cardTemplate.querySelector('.popup__title');
var addressOfLodging = cardTemplate.querySelector('.popup__text--address');
var priceOfLodging = cardTemplate.querySelector('.popup__text--price');
var typeOfLodging = cardTemplate.querySelector('.popup__type');
var capacity = cardTemplate.querySelector('.popup__text--capacity');
var timeCheckinCheckout = cardTemplate.querySelector('.popup__text--time');
var featuresOfLodging = cardTemplate.querySelector('.popup__features');
var descriptionOfLodging = cardTemplate.querySelector('.popup__description');
var photosOfLodging = cardTemplate.querySelector('.popup__photos');
var photoOfLodging = photosOfLodging.querySelector('.popup__photo');
var usersAvatar = cardTemplate.querySelector('.popup__avatar');
var mapFiltersContainer = document.querySelector('.map__filters-container');

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
        'x': createRandomNumber(0, widthMapPins),
        'y': createRandomNumber(LIMIT_Y_MIN, LIMIT_Y_MAX)
      },
      'offer': {
        'title': 'заголовок для ' + (i + 1) + '-ого объявления',
        'address': 'адрес проживания',
        'price': createRandomNumber(PRICE_MIN, PRICE_MAX),
        'type': getRandomElement(TYPE_OF_HOUSING),
        'rooms': createRandomNumber(ROOMS_MIN, ROOMS_MAX),
        'guests': createRandomNumber(GUESTS_MIN, GUESTS_MAX),
        'checkin': getRandomElement(CHECKIN),
        'checkout': getRandomElement(CHECKOUT),
        'features': features,
        'description': 'строка с описанием ' + (i + 1) + '-ого объявления',
        'photos': photos
      }
    };
    adsList[i] = adsListItem;
  }
  return adsList;
};

map.classList.remove('map--faded');

var adsList = createAds();

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

var createCard = function (ad) {
  titleOfAd.textContent = ad.offer.title;
  addressOfLodging.textContent = ad.offer.address;
  priceOfLodging.textContent = ad.offer.price + '₽/ночь';
  if (ad.offer.type === 'flat') {
    typeOfLodging.textContent = 'Квартира';
  } else if (ad.offer.type === 'bungalo') {
    typeOfLodging.textContent = 'Бунгало';
  } else if (ad.offer.type === 'house') {
    typeOfLodging.textContent = 'Дом';
  } else if (ad.offer.type === 'palace') {
    typeOfLodging.textContent = 'Дворец';
  } else {
    typeOfLodging.style = 'display: none';
  }
  if (ad.offer.rooms === 1) {
    capacity.textContent = ad.offer.rooms + ' комната для ' + ad.offer.guests + ' гостей.';
  } else {
    capacity.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей.';
  }
  timeCheckinCheckout.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout + '.';
  if (ad.offer.features.length === 0) {
    featuresOfLodging.style = 'display: none';
  } else {
    for (var j = 0; j < FEATURES.length; j++) {
      if (!ad.offer.features.includes(FEATURES[j])) {
        var removeFeture = featuresOfLodging.querySelector('.popup__feature--' + FEATURES[j]);
        removeFeture.remove();
      }
    }
  }
  descriptionOfLodging.textContent = ad.offer.description;
  photoOfLodging.src = ad.offer.photos[0];
  if (ad.offer.photos.length > 1) {
    for (var k = 0; k < ad.offer.photos.length; ++k) {
      var nthPhotoOfLodging = photoOfLodging.cloneNode(true);
      nthPhotoOfLodging.src = ad.offer.photos[k];
      photosOfLodging.appendChild(nthPhotoOfLodging);
    }
  }
  usersAvatar.src = ad.author.avatar;
  return cardTemplate;
};

map.insertBefore(createCard(adsList[0]), mapFiltersContainer);
