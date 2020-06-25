'use strict';
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var TYPE_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];
var Offset = {
  X: 25,
  Y: 70
};
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
var Pin = {
  HEIGHT: 65,
  WIDTH: 65
};
var HEIGHT_ARROW = 22;
var LengthLabel = {
  MAX: 100,
  MIN: 30
};
var MSG_ERR_CLOSELY = 'Гостям будет тесно. Для каждого гостя требуется своя комната.';
var MSG_ERR_100ROOMS = 'Для 100 комнат нужно выбрать вариант не для гостей.';
var MSG_ERR_NO_GUESTS = 'Для данного варианта необходимо выбрать 100 комнат.';
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

var disableElements = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].setAttribute('disabled', 'disabled');
  }
};

var enableElements = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].removeAttribute('disabled');
  }
};

var getAddress = function (pin) {
  var xCoordinate = Math.round(parseInt(pin.style.left, 10) + Pin.WIDTH / 2);
  var yCoordinate = Math.round(parseInt(pin.style.top, 10) + Pin.HEIGHT / 2);
  if (!map.classList.contains('map--faded')) {
    yCoordinate = Math.round(parseInt(pin.style.top, 10) + Pin.HEIGHT + HEIGHT_ARROW);
  }
  var coordinate = xCoordinate + ', ' + yCoordinate;
  return coordinate;
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
};

var getCapacityOffer = function (rooms, guests) {
  var capacityText = '';
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
  capacityText = roomsText + guestsText;
  return capacityText;
};

var closeEscapePress = function (evt) {
  var activeAardOfAd = map.querySelector('.map__card');
  if (evt.key === 'Escape') {
    map.removeChild(activeAardOfAd);
    document.removeEventListener('keydown', closeEscapePress);
  }
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
  var closeButton = cardOfAd.querySelector('.popup__close');
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

  closeButton.addEventListener('mousedown', function (evt) {
    if (evt.button === 0) {
      map.removeChild(cardOfAd);
    }
    document.removeEventListener('keydown', closeEscapePress);
  });
  closeButton.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      map.removeChild(cardOfAd);
    }
    document.removeEventListener('keydown', closeEscapePress);
  });
  document.addEventListener('keydown', closeEscapePress);
  return cardOfAd;
};

var onPinMousePress = function (evt) {
  if (evt.button === 0) {
    activationStatus();
  }
};

var onPinEnterPress = function (evt) {
  if (evt.key === 'Enter') {
    activationStatus();
  }
};

var activationStatus = function () {
  enableElements(formFieldsets);
  enableElements(mapFiltersElements);
  adForm.classList.remove('ad-form--disabled');
  map.classList.remove('map--faded');
  var adsList = createAds();
  var pinListener = function (evt) {
    var mapCard = map.querySelector('.map__card');
    if (mapCard) {
      map.removeChild(mapCard);
    }
    var numberOfAd = '';
    if (evt.target.tagName === 'IMG') {
      numberOfAd = adsList[evt.toElement.parentElement.dataset.numberOfAd];
    }
    if (evt.target.className === 'map__pin') {
      numberOfAd = adsList[evt.target.dataset.numberOfAd];
    }
    map.insertBefore(createCard(numberOfAd), mapFiltersContainer);
  };
  for (var i = 0; i < adsList.length; i++) {
    var pinOnMap = pinTemplate.cloneNode(true);
    pinOnMap.style.left = (adsList[i].location.x - Offset.X) + 'px';
    pinOnMap.style.top = (adsList[i].location.y - Offset.Y) + 'px';
    pinOnMap.setAttribute('data-number-of-ad', i);
    var imageOfPin = pinOnMap.querySelector('img');
    imageOfPin.src = adsList[i].author.avatar;
    imageOfPin.alt = adsList[i].offer.title;
    fragment.appendChild(pinOnMap);
  }
  mapPins.appendChild(fragment);
  formAddress.value = getAddress(mapPinMain);
  mapPinMain.removeEventListener('keydown', onPinEnterPress);
  mapPinMain.removeEventListener('mousedown', onPinMousePress);
  var pins = mapPins.querySelectorAll('.map__pin');
  pins.forEach(function (btn) {
    if (btn.className.includes('map__pin--main')) {
      return;
    }
    btn.addEventListener('mousedown', function (evt) {
      if (evt.button === 0) {
        pinListener(evt);
      }
    });
    btn.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        pinListener(evt);
      }
    });
  });
};

disableElements(formFieldsets);
disableElements(mapFiltersElements);

getAddress(mapPinMain);

formAddress.value = getAddress(mapPinMain);

mapPinMain.addEventListener('mousedown', onPinMousePress);

mapPinMain.addEventListener('keydown', onPinEnterPress);

selectRooms.addEventListener('change', function () {
  if (Number(selectRooms.value) < Number(selectCapacity.value)) {
    selectCapacity.setCustomValidity(MSG_ERR_CLOSELY);
  } else if ((selectRooms.value === '100' && !(selectCapacity.value === '0')) || (selectCapacity.value === '0' && !(selectRooms.value === '100'))) {
    selectCapacity.setCustomValidity(MSG_ERR_100ROOMS);
  } else {
    selectCapacity.setCustomValidity('');
  }
});

selectCapacity.addEventListener('change', function () {
  if (Number(selectCapacity.value) > Number(selectRooms.value)) {
    selectCapacity.setCustomValidity(MSG_ERR_CLOSELY);
  } else if ((selectRooms.value === '100' && !(selectCapacity.value === '0'))) {
    selectCapacity.setCustomValidity(MSG_ERR_100ROOMS);
  } else if ((selectCapacity.value === '0' && !(selectRooms.value === '100'))) {
    selectCapacity.setCustomValidity(MSG_ERR_NO_GUESTS);
  } else {
    selectCapacity.setCustomValidity('');
  }
});

adLabel.addEventListener('input', function () {
  var adLabelLength = adLabel.value.length;
  if (adLabelLength < LengthLabel.MIN) {
    adLabel.setCustomValidity('Добавьте ещё ' + (LengthLabel.MIN - adLabelLength) + ' симв.');
  } else if (adLabelLength > LengthLabel.MAX) {
    adLabel.setCustomValidity('Удалите лишние ' + (adLabelLength - LengthLabel.MAX) + ' симв.');
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
  adTimeOut.value = adTimeIn.value;
});

adTimeOut.addEventListener('change', function () {
  adTimeIn.value = adTimeOut.value;
});
