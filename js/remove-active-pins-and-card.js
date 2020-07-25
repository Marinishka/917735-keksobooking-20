'use strict';

(function () {
  window.removeActivePinsAndCard = function () {
    document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
      pin.remove();
    });
    var activeCardOfAd = window.main.map.querySelector('.map__card');
    if (activeCardOfAd) {
      activeCardOfAd.remove();
      document.removeEventListener('keydown', window.card.closeEscapePress);
    }
  };
})();
