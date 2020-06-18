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
var HEIGHT_PIN = 65;
var WIDTH_PIN = 65;
var HEIGHT_ARROW = 22;
var LENGTH_LABEL_MIN = 30;
var LENGTH_LABEL_MAX = 100;
var MSG_ERR_CLOSELY = 'Гостям будет тесно. Для каждого гостя требуется своя комната.';
var MSG_ERR_100ROOMS = 'Для 100 комнат нужно выбрать вариант не для гостей.';
var map = document.querySelector('.map');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
var mapPins = document.querySelector('.map__pins');
var widthMapPins = mapPins.clientWidth;
var mapFiltersContainer = document.querySelector('.map__filters-container');
var mapFilters = document.querySelector('.map__filters');
var mapFiltersElements = mapFilters.children;
var adForm = document.querySelector('.ad-form');
var selectCapacity = adForm.querySelector('#capacity');
var selectRooms = adForm.querySelector('#room_number');
var optionsCapacity = selectCapacity.children;
var formFieldsets = adForm.children;
var formAddress = adForm.querySelector('#address');
var adLabel = adForm.querySelector('#title');
var adPrice = adForm.querySelector('#price');
var adType = adForm.querySelector('#type');
var adTimeIn = adForm.querySelector('#timein');
var adTimeOut = adForm.querySelector('#timeout');
var mapPinMain = document.querySelector('.map__pin--main');

var createRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getRandomElement = function (someArray) {
  return someArray[createRandomNumber(0, someArray.length - 1)];
};

var getDisabledElements = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].setAttribute('disabled', 'disabled');
  }
};

var getNotDisabledElements = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].removeAttribute('disabled');
  }
};

var getAddress = function (pin) {
  var xCoordinate = Math.round(Number(pin.style.left.replace('px', '')) + WIDTH_PIN / 2);
  var yCoordinate = Math.round(Number(pin.style.top.replace('px', '')) + HEIGHT_PIN / 2);
  if (!map.classList.contains('map--faded')) {
    yCoordinate = Math.round(Number(pin.style.top.replace('px', '')) + HEIGHT_PIN + HEIGHT_ARROW);
  }
  var coordinate = xCoordinate + ', ' + yCoordinate;
  return coordinate;
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

var getActiveState = function () {
  getNotDisabledElements(formFieldsets);
  getNotDisabledElements(mapFiltersElements);
  adForm.classList.remove('ad-form--disabled');
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
  map.insertBefore(createCard(adsList[0]), mapFiltersContainer);

  selectRooms.addEventListener('change', function (evt) {
    if (Number(evt.target.value) < Number(selectCapacity.value)) {
      selectCapacity.setCustomValidity(MSG_ERR_CLOSELY);
    } else if ((evt.target.value === '100' && !(selectCapacity.value === '0')) || (selectCapacity.value === '0' && !(evt.target.value === '100'))) {
      selectCapacity.setCustomValidity(MSG_ERR_100ROOMS);
    } else {
      selectCapacity.setCustomValidity('');
    }
  });

  selectCapacity.addEventListener('change', function (evt) {
    if (Number(evt.target.value) > Number(selectRooms.value)) {
      selectCapacity.setCustomValidity(MSG_ERR_CLOSELY);
    } else if ((evt.target.value === '0' && !(selectRooms.value === '100')) || (selectRooms.value === '100' && !(evt.target.value === '0'))) {
      selectCapacity.setCustomValidity(MSG_ERR_100ROOMS);
    } else {
      selectCapacity.setCustomValidity('');
    }
  });

  adLabel.addEventListener('input', function () {
    var adLabelLength = adLabel.value.length;
    if (adLabelLength < LENGTH_LABEL_MIN) {
      adLabel.setCustomValidity('Добавьте ещё ' + (LENGTH_LABEL_MIN - adLabelLength) + ' симв.');
    } else if (adLabelLength > LENGTH_LABEL_MAX) {
      adLabel.setCustomValidity('Удалите лишние ' + (adLabelLength - LENGTH_LABEL_MAX) + ' симв.');
    } else {
      adLabel.setCustomValidity('');
    }
  });

  adType.addEventListener('change', function () {
    var minPrice = '';
    switch (adType.value) {
      case ('bungalo'):
        minPrice = '0';
        break;
      case ('flat'):
        minPrice = '1000';
        break;
      case ('house'):
        minPrice = '5000';
        break;
      case ('palace'):
        minPrice = '10000';
        break;
    }
    adPrice.setAttribute('min', minPrice);
    adPrice.setAttribute('placeholder', minPrice);
  });

  adTimeIn.addEventListener('change', function () {
    var timeOut = '';
    switch (adTimeIn.value) {
      case ('12:00'):
        timeOut = '12:00';
        break;
      case ('13:00'):
        timeOut = '13:00';
        break;
      case ('14:00'):
        timeOut = '14:00';
        break;
    }
    adTimeOut.value = timeOut;
  });

  adTimeOut.addEventListener('change', function () {
    var timeIn = '';
    switch (adTimeOut.value) {
      case ('12:00'):
        timeIn = '12:00';
        break;
      case ('13:00'):
        timeIn = '13:00';
        break;
      case ('14:00'):
        timeIn = '14:00';
        break;
    }
    adTimeIn.value = timeIn;
  });
};

getDisabledElements(formFieldsets);
getDisabledElements(mapFiltersElements);

getAddress(mapPinMain);

formAddress.value = getAddress(mapPinMain);

mapPinMain.addEventListener('mousedown', function (evt) {
  if (evt.button === 0) {
    getActiveState();
  }
  formAddress.value = getAddress(mapPinMain);
});

mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    getActiveState();
  }
});

optionsCapacity[0].removeAttribute('selected');
optionsCapacity[2].setAttribute('selected', 'selected');

adPrice.setAttribute('min', '1000');
adPrice.setAttribute('placeholder', '1000');
