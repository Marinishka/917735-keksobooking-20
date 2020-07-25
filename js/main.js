'use strict';
(function () {
  var KeyCode = {
    MOUSE_LEFT_BUTTON: 0,
    ENTER: 'Enter',
    ESCAPE: 'Escape'
  };
  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
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
  var avatarInput = document.querySelector('.ad-form-header__input');
  var photoInput = document.querySelector('.ad-form__upload');

  var onPinMousePress = function (evt) {
    if (evt.button === KeyCode.MOUSE_LEFT_BUTTON) {
      activateStatus();
    }
  };

  var onPinEnterPress = function (evt) {
    if (evt.key === KeyCode.ENTER) {
      activateStatus();
    }
  };

  var hideMsg = function () {
    var msgWithSuccess = document.querySelector('.success');
    var msg = msgWithSuccess
      ? msgWithSuccess
      : document.querySelector('.error');
    main.removeChild(msg);
    document.removeEventListener('keydown', onEscapePress);
    document.removeEventListener('click', hideMsg);
  };

  var onEscapePress = function (evt) {
    if (evt.key === KeyCode.ESCAPE) {
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
    window.form.reset();
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

  var loadedAds = [];
  var successHandler = function (data) {
    loadedAds = data;
    window.pin.create(loadedAds);
    selectType.addEventListener('change', onDebouncedUpdatePins);
    selectPrice.addEventListener('change', onDebouncedUpdatePins);
    selectRooms.addEventListener('change', onDebouncedUpdatePins);
    selectGuests.addEventListener('change', onDebouncedUpdatePins);
    selectFeatures.addEventListener('change', onDebouncedUpdatePins);
  };

  var updatePins = function () {
    window.removeActivePinsAndCard();
    window.pin.create(window.filter.getFilteredAds(loadedAds));
  };

  var activateStatus = function () {
    window.form.enableElements(formFieldsets);
    window.form.enableElements(mapFiltersElements);
    adForm.addEventListener('submit', onFormSubmit);
    adForm.classList.remove('ad-form--disabled');
    map.classList.remove('map--faded');
    window.backend.load(successHandler, window.msgError);
    formAddress.value = window.address(mapPinMain);
    mapPinMain.removeEventListener('keydown', onPinEnterPress);
    mapPinMain.removeEventListener('mousedown', onPinMousePress);
    btnResetForm.addEventListener('click', window.form.reset);
    avatarInput.addEventListener('change', window.image.onAvatarInputChange);
    photoInput.addEventListener('change', window.image.onPhotoInputChange);
  };

  mapPinMain.addEventListener('mousedown', function (evt) {
    window.pinMain.onMouseDown(evt);
  });

  var onDebouncedUpdatePins = window.debounce(updatePins);

  window.address(mapPinMain);

  formAddress.value = window.address(mapPinMain);

  mapPinMain.addEventListener('mousedown', onPinMousePress);

  mapPinMain.addEventListener('keydown', onPinEnterPress);

  window.main = {
    onPinMousePress: onPinMousePress,
    onPinEnterPress: onPinEnterPress,
    onFormSubmit: onFormSubmit,
    onDebouncedUpdatePins: onDebouncedUpdatePins,
    KeyCode: KeyCode,
    map: map,
    mapPinMain: mapPinMain
  };
})();
