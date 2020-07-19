'use strict';
window.main = (function () {
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
  var btnResetForm = adForm.querySelector('.ad-form__reset');
  var msgPopupSuccessTemplate = document.querySelector('#success').content.querySelector('.success');
  var msgPopupErrorTemplate = document.querySelector('#error').content.querySelector('.error');
  var main = document.querySelector('main');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var selectType = mapFiltersContainer.querySelector('#housing-type');
  var selectPrice = mapFiltersContainer.querySelector('#housing-price');
  var selectRooms = mapFiltersContainer.querySelector('#housing-rooms');
  var selectGuests = mapFiltersContainer.querySelector('#housing-guests');
  var selectFeatures = mapFiltersContainer.querySelector('#housing-features');

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

  var hideMsg = function () {
    var msg = document.querySelector('.success')
      ? document.querySelector('.success')
      : document.querySelector('.error');
    main.removeChild(msg);
    document.removeEventListener('keydown', onEscapePress);
    document.removeEventListener('click', hideMsg);
  };

  var onEscapePress = function (evt) {
    if (evt.key === 'Escape') {
      hideMsg();
      document.removeEventListener('keydown', onEscapePress);
      document.removeEventListener('click', hideMsg);
    }
  };

  var submitSuccessfully = function () {
    var msgSuccess = msgPopupSuccessTemplate.cloneNode(true);
    main.appendChild(msgSuccess);
    document.addEventListener('click', hideMsg);
    document.addEventListener('keydown', onEscapePress);
    window.form.resetForm();
  };

  var submitError = function () {
    var msgPopupError = msgPopupErrorTemplate.cloneNode(true);
    var btnError = msgPopupError.querySelector('.error__button');
    main.appendChild(msgPopupError);
    document.addEventListener('click', hideMsg);
    document.addEventListener('keydown', onEscapePress);
    btnError.addEventListener('click', function () {
      hideMsg();
    });
  };

  var onFormSubmit = function (evt) {
    window.backend.upload(new FormData(adForm), submitSuccessfully, submitError);
    evt.preventDefault();
  };

  var loadError = function (msg) {
    var node = document.createElement('div');
    node.style.position = 'absolute';
    node.style.top = '0px';
    node.style = 'z-index: 1; text-align: center; background-color: #ff6547;';
    node.textContent = msg;
    document.body.insertAdjacentElement('afterbegin', node);
    window.form.disableElements(mapFiltersElements);
  };

  var loadedAds = [];
  var successHandler = function (data) {
    loadedAds = data;
    window.pin.createPins(loadedAds);
    selectType.addEventListener('change', onDebouncedUpdatePins);
    selectPrice.addEventListener('change', onDebouncedUpdatePins);
    selectRooms.addEventListener('change', onDebouncedUpdatePins);
    selectGuests.addEventListener('change', onDebouncedUpdatePins);
    selectFeatures.addEventListener('change', onDebouncedUpdatePins);
  };

  var removePinAndActiveCard = function () {
    document.querySelectorAll('.map__pin').forEach(function (pin) {
      if (!pin.classList.contains('map__pin--main')) {
        pin.remove();
      }
    });
    var activeCardOfAd = map.querySelector('.map__card');
    if (activeCardOfAd) {
      map.removeChild(activeCardOfAd);
      document.removeEventListener('keydown', window.card.closeEscapePress);
    }
  };

  var updatePins = function () {
    var filteredAds = loadedAds.slice();
    if (selectType.value === selectPrice.value === selectRooms === selectGuests === 'any') {
      return;
    } else {
      filteredAds = window.filter.filterType(filteredAds);
      filteredAds = window.filter.filterPrice(filteredAds);
      filteredAds = window.filter.filterRooms(filteredAds);
      filteredAds = window.filter.filterGuests(filteredAds);
      filteredAds = window.filter.filterFeatures(filteredAds);
    }
    removePinAndActiveCard();
    window.pin.createPins(filteredAds);
  };

  var activateStatus = function () {
    window.form.enableElements(formFieldsets);
    window.form.enableElements(mapFiltersElements);
    adForm.addEventListener('submit', onFormSubmit);
    adForm.classList.remove('ad-form--disabled');
    map.classList.remove('map--faded');
    window.backend.load(successHandler, loadError);
    formAddress.value = getAddress(mapPinMain);
    mapPinMain.removeEventListener('keydown', onPinEnterPress);
    mapPinMain.removeEventListener('mousedown', onPinMousePress);
    mapPinMain.addEventListener('mousedown', function (evt) {
      window.pinMain.onMouseDown(evt);
    });
    btnResetForm.addEventListener('click', window.form.resetForm);
  };

  var onDebouncedUpdatePins = window.debounce(updatePins);

  getAddress(mapPinMain);

  formAddress.value = getAddress(mapPinMain);

  mapPinMain.addEventListener('mousedown', onPinMousePress);

  mapPinMain.addEventListener('keydown', onPinEnterPress);

  return {
    getAddress: getAddress,
    onPinMousePress: onPinMousePress,
    onPinEnterPress: onPinEnterPress,
    onFormSubmit: onFormSubmit,
    onDebouncedUpdatePins: onDebouncedUpdatePins
  };
})();
