'use strict';
(function () {
  var Pin = {
    HEIGHT: 65,
    WIDTH: 65
  };
  var HEIGHT_ARROW = 22;
  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var formAddress = adForm.querySelector('#address');
  var formFieldsets = adForm.children;
  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersElements = mapFilters.children;

  var enableElements = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].removeAttribute('disabled');
    }
  };

  var onPinMousePress = function (evt) {
    if (evt.button === 0) {
      activateStatus();
    }
  };

  var onPinEnterPress = function (evt) {
    if (evt.key === 'Enter') {
      activateStatus();
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

  var activateStatus = function () {
    enableElements(formFieldsets);
    enableElements(mapFiltersElements);
    adForm.classList.remove('ad-form--disabled');
    map.classList.remove('map--faded');
    window.pin.createPins();
    formAddress.value = getAddress(mapPinMain);
    mapPinMain.removeEventListener('keydown', onPinEnterPress);
    mapPinMain.removeEventListener('mousedown', onPinMousePress);
  };

  getAddress(mapPinMain);

  formAddress.value = getAddress(mapPinMain);

  mapPinMain.addEventListener('mousedown', onPinMousePress);

  mapPinMain.addEventListener('keydown', onPinEnterPress);
})();
