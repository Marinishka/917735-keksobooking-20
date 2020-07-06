'use strict';

window.form = (function () {
  var LengthLabel = {
    MAX: 100,
    MIN: 30
  };
  var MsgErr = {
    CLOSELY: 'Гостям будет тесно. Для каждого гостя требуется своя комната.',
    ROOMS100: 'Для 100 комнат нужно выбрать вариант не для гостей.',
    NO_GUESTS: 'Для данного варианта необходимо выбрать 100 комнат.'
  };
  var adForm = document.querySelector('.ad-form');
  var selectCapacity = adForm.querySelector('#capacity');
  var selectRooms = adForm.querySelector('#room_number');
  var formFieldsets = adForm.children;

  var adLabel = adForm.querySelector('#title');
  var adPrice = adForm.querySelector('#price');
  var adType = adForm.querySelector('#type');
  var adTimeIn = adForm.querySelector('#timein');
  var adTimeOut = adForm.querySelector('#timeout');
  var adDescription = adForm.querySelector('#description');
  var formAddress = adForm.querySelector('#address');
  var btnResetForm = adForm.querySelector('.ad-form__reset');

  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersElements = mapFilters.children;

  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var InitialState = {
    AD_TYPE: adType.value,
    AD_TIME_IN: adTimeIn.value,
    MAP_PIN_MAIN: {
      LEFT: mapPinMain.style.left,
      TOP: mapPinMain.style.top
    },
    SELECT_CAPACITY: selectCapacity.value,
    SELECT_ROOMS: selectRooms.value
  };

  selectRooms.addEventListener('change', function () {
    if (Number(selectRooms.value) < Number(selectCapacity.value)) {
      selectCapacity.setCustomValidity(MsgErr.CLOSELY);
    } else if ((selectRooms.value === '100' && !(selectCapacity.value === '0')) || (selectCapacity.value === '0' && !(selectRooms.value === '100'))) {
      selectCapacity.setCustomValidity(MsgErr.ROOMS100);
    } else {
      selectCapacity.setCustomValidity('');
    }
  });

  selectCapacity.addEventListener('change', function () {
    if (Number(selectCapacity.value) > Number(selectRooms.value)) {
      selectCapacity.setCustomValidity(MsgErr.CLOSELY);
    } else if ((selectRooms.value === '100' && !(selectCapacity.value === '0'))) {
      selectCapacity.setCustomValidity(MsgErr.ROOMS100);
    } else if ((selectCapacity.value === '0' && !(selectRooms.value === '100'))) {
      selectCapacity.setCustomValidity(MsgErr.NO_GUESTS);
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

  var disableElements = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].setAttribute('disabled', 'disabled');
    }
  };

  var features = document.querySelector('.features').children;
  var uncheckedFeature = function (collection) {
    for (var l = 0; l < collection.length; l++) {
      if (collection[l].checked === true) {
        collection[l].checked = false;
      }
    }
  };

  var resetForm = function () {
    disableElements(formFieldsets);
    disableElements(mapFiltersElements);
    adForm.classList.add('ad-form--disabled');
    map.classList.add('map--faded');
    var mapPin = document.querySelectorAll('.map__pin');
    var mapPins = document.querySelector('.map__pins');
    for (var i = 1; i < mapPin.length; i++) {
      mapPins.removeChild(mapPin[i]);
    }
    adLabel.value = '';
    adPrice.value = '';
    adDescription.value = '';
    adType.value = InitialState.AD_TYPE;
    adPrice.setAttribute('min', '1000');
    adPrice.setAttribute('placeholder', '1000');
    adTimeIn.value = adTimeOut.value = InitialState.AD_TIME_IN;
    mapPinMain.style.left = InitialState.MAP_PIN_MAIN.LEFT;
    mapPinMain.style.top = InitialState.MAP_PIN_MAIN.TOP;
    formAddress.value = window.main.getAddress(mapPinMain);
    selectCapacity.value = InitialState.SELECT_CAPACITY;
    selectRooms.value = InitialState.SELECT_ROOMS;
    var cardOnMap = map.querySelector('.map__card');
    if (cardOnMap) {
      map.removeChild(cardOnMap);
    }
    uncheckedFeature(features);
    adForm.removeEventListener('submit', window.main.onFormSubmit);
    mapPinMain.addEventListener('mousedown', window.main.onPinMousePress);
    mapPinMain.addEventListener('keydown', window.main.onPinEnterPress);
    btnResetForm.removeEventListener('click', resetForm);
    document.removeEventListener('keydown', window.card.closeEscapePress);
  };

  disableElements(formFieldsets);
  disableElements(mapFiltersElements);

  return {
    enableElements: function (arr) {
      for (var i = 0; i < arr.length; i++) {
        arr[i].removeAttribute('disabled');
      }
    },
    disableElements: disableElements,
    resetForm: resetForm
  };
})();
