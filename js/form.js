'use strict';

(function () {
  var LengthLabel = {
    MAX: 100,
    MIN: 30
  };
  var MsgErr = {
    CLOSELY: 'Гостям будет тесно. Для каждого гостя требуется своя комната.',
    ROOMS100: 'Для 100 комнат нужно выбрать вариант не для гостей.',
    NO_GUESTS: 'Для данного варианта необходимо выбрать 100 комнат.'
  };
  var typeToMinPrice = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000',
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
  var formAddress = adForm.querySelector('#address');
  var btnResetForm = adForm.querySelector('.ad-form__reset');

  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersElements = mapFilters.children;

  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var selectTypeFilter = mapFiltersContainer.querySelector('#housing-type');
  var selectPriceFilter = mapFiltersContainer.querySelector('#housing-price');
  var selectRoomsFilter = mapFiltersContainer.querySelector('#housing-rooms');
  var selectGuestsFilter = mapFiltersContainer.querySelector('#housing-guests');
  var selectFeaturesFilter = mapFiltersContainer.querySelector('#housing-features');
  var InitialStatePin = {
    LEFT: window.main.mapPinMain.style.left,
    TOP: window.main.mapPinMain.style.top
  };
  var avatarInput = document.querySelector('.ad-form-header__input');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoInput = document.querySelector('.ad-form__input');

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
    var minPrice = typeToMinPrice[adType.value];
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

  var resetForm = function () {
    var photoPreviewImg = document.querySelector('.ad-form__photo img');
    disableElements(formFieldsets);
    disableElements(mapFiltersElements);
    adForm.classList.add('ad-form--disabled');
    window.main.map.classList.add('map--faded');
    document.querySelectorAll('.map__pin').forEach(function (pin) {
      if (!pin.classList.contains('map__pin--main')) {
        pin.remove();
      }
    });
    adPrice.setAttribute('min', '1000');
    adPrice.setAttribute('placeholder', '1000');
    window.main.mapPinMain.style.left = InitialStatePin.LEFT;
    window.main.mapPinMain.style.top = InitialStatePin.TOP;
    adForm.reset();
    formAddress.value = window.address(window.main.mapPinMain);
    var cardOnMap = window.main.map.querySelector('.map__card');
    if (cardOnMap) {
      window.main.map.removeChild(cardOnMap);
    }
    adForm.removeEventListener('submit', window.main.onFormSubmit);
    window.main.mapPinMain.addEventListener('mousedown', window.main.onPinMousePress);
    window.main.mapPinMain.addEventListener('keydown', window.main.onPinEnterPress);
    btnResetForm.removeEventListener('click', resetForm);
    document.removeEventListener('keydown', window.card.closeEscapePress);
    selectTypeFilter.removeEventListener('change', window.main.onDebouncedUpdatePins);
    selectPriceFilter.removeEventListener('change', window.main.onDebouncedUpdatePins);
    selectRoomsFilter.removeEventListener('change', window.main.onDebouncedUpdatePins);
    selectGuestsFilter.removeEventListener('change', window.main.onDebouncedUpdatePins);
    selectFeaturesFilter.removeEventListener('change', window.main.onDebouncedUpdatePins);
    avatarInput.removeEventListener('change', window.image.onAvatarInputChange);
    photoInput.removeEventListener('change', window.image.onPhotoInputChange);
    avatarPreview.src = 'img/muffin-grey.svg';
    if (photoPreviewImg) {
      photoPreviewImg.remove();
    }
    mapFilters.reset();
  };

  disableElements(formFieldsets);
  disableElements(mapFiltersElements);

  window.form = {
    enableElements: function (arr) {
      for (var i = 0; i < arr.length; i++) {
        arr[i].removeAttribute('disabled');
      }
    },
    disableElements: disableElements,
    reset: resetForm
  };
})();
