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

  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersElements = mapFilters.children;

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

  disableElements(formFieldsets);
  disableElements(mapFiltersElements);

  return {
    enableElements: function (arr) {
      for (var i = 0; i < arr.length; i++) {
        arr[i].removeAttribute('disabled');
      }
    }
  };
})();
