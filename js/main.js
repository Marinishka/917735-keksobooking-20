'use strict';
(function () {
  var Pin = {
    HEIGHT: 62,
    WIDTH: 62
  };
  var HEIGHT_ARROW = 22;
  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var formAddress = adForm.querySelector('#address');
  var formFieldsets = adForm.children;
  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersElements = mapFilters.children;
  var mapPins = document.querySelector('.map__pins');
  var widthMapPins = mapPins.clientWidth;

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
    return xCoordinate + ', ' + yCoordinate;
  };

  var onMouseDown = function (evt) {
    var startCoordinate = {
      X: evt.clientX,
      Y: evt.clientY
    };

    var onMouseMove = function (evtMove) {
      var shift = {
        X: evtMove.clientX - startCoordinate.X,
        Y: evtMove.clientY - startCoordinate.Y
      };

      startCoordinate = {
        X: evtMove.clientX,
        Y: evtMove.clientY
      };

      var moveX = parseInt(mapPinMain.style.left, 10) + shift.X;
      var moveY = parseInt(mapPinMain.style.top, 10) + shift.Y;
      if (moveY + Pin.HEIGHT + HEIGHT_ARROW < window.data.LimitY.MIN ||
       moveY + Pin.HEIGHT + HEIGHT_ARROW > window.data.LimitY.MAX ||
       moveX + Pin.WIDTH / 2 < 0 ||
       moveX + Pin.WIDTH / 2 > widthMapPins) {
        return;
      }
      mapPinMain.style.left = moveX + 'px';
      mapPinMain.style.top = moveY + 'px';
    };

    var onMouseUp = function () {
      mapPinMain.removeEventListener('mousemove', onMouseMove);
      mapPinMain.removeEventListener('mouseup', onMouseUp);
      formAddress.value = getAddress(mapPinMain);
    };
    mapPinMain.addEventListener('mousemove', onMouseMove);
    mapPinMain.addEventListener('mouseup', onMouseUp);
  };

  var activateStatus = function () {
    window.form.enableElements(formFieldsets);
    window.form.enableElements(mapFiltersElements);
    adForm.classList.remove('ad-form--disabled');
    map.classList.remove('map--faded');
    var adsList = window.data.createAds();
    window.pin.createPins(adsList);
    formAddress.value = getAddress(mapPinMain);
    mapPinMain.removeEventListener('keydown', onPinEnterPress);
    mapPinMain.removeEventListener('mousedown', onPinMousePress);
    mapPinMain.addEventListener('mousedown', onMouseDown);
  };

  getAddress(mapPinMain);

  formAddress.value = getAddress(mapPinMain);

  mapPinMain.addEventListener('mousedown', onPinMousePress);

  mapPinMain.addEventListener('keydown', onPinEnterPress);
})();
