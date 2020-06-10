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
var NUMBER_OF_ADS = 8;
var map = document.querySelector('.map');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
var mapPins = document.querySelector('.map__pins');
var widthMapPins = mapPins.clientWidth;
var mapFiltersContainer = document.querySelector('.map__filters-container');

var createRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getRandomElement = function (someArray) {
  return someArray[createRandomNumber(0, someArray.length - 1)];
};

var createAds = function () {
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
    adsList.push({
      'author': {
        'avatar': 'img/avatars/user0' + i + '.png'
      },
      'location': {
        'x': createRandomNumber(0, widthMapPins),
        'y': createRandomNumber(LIMIT_Y_MIN, LIMIT_Y_MAX)
      },
      'offer': {
        'title': 'заголовок для ' + i + '-ого объявления',
        'address': 'адрес проживания',
        'price': createRandomNumber(PRICE_MIN, PRICE_MAX),
        'type': getRandomElement(TYPE_OF_HOUSING),
        'rooms': createRandomNumber(ROOMS_MIN, ROOMS_MAX),
        'guests': createRandomNumber(GUESTS_MIN, GUESTS_MAX),
        'checkin': getRandomElement(CHECKIN),
        'checkout': getRandomElement(CHECKOUT),
        'features': features,
        'description': 'строка с описанием ' + i + '-ого объявления',
        'photos': photos
      }
    });
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

var getCapacityOffer = function (rooms, guests) {
  var capacityText = '';
  if (rooms === 1) {
    capacityText = rooms + ' комната для ' + guests + ' гостей.';
  } else {
    capacityText = rooms + ' комнаты для ' + guests + ' гостей.';
  }
  return capacityText;
};

var createCard = function (ad) {
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
  titleOfAd.textContent = ad.offer.title;
  addressOfLodging.textContent = ad.offer.address;
  priceOfLodging.textContent = ad.offer.price + '₽/ночь';
  switch (ad.offer.type) {
    case 'flat':
      typeOfLodging.textContent = 'Квартира';
      break;
    case 'bungalo':
      typeOfLodging.textContent = 'Бунгало';
      break;
    case 'house':
      typeOfLodging.textContent = 'Дом';
      break;
    case 'palace':
      typeOfLodging.textContent = 'Дворец';
      break;
    default:
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
  photoOfLodging.src = ad.offer.photos[0];
  if (ad.offer.photos.length > 1) {
    for (var k = 1; k < ad.offer.photos.length; k++) {
      var nthPhotoOfLodging = photoOfLodging.cloneNode(true);
      nthPhotoOfLodging.src = ad.offer.photos[k];
      photosOfLodging.appendChild(nthPhotoOfLodging);
    }
  }
  usersAvatar.src = ad.author.avatar;
  return cardOfAd;
};

map.insertBefore(createCard(adsList[0]), mapFiltersContainer);
