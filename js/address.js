'use strict';

window.address = (function () {
  var Pin = {
    HEIGHT: 62,
    WIDTH: 62
  };
  var HEIGHT_ARROW = 22;
  var map = document.querySelector('.map');

  return {
    getAddress: function (it) {
      var xCoordinate = Math.round(parseInt(it.style.left, 10) + Pin.WIDTH / 2);
      var yCoordinate = Math.round(parseInt(it.style.top, 10) + Pin.HEIGHT / 2);
      if (!map.classList.contains('map--faded')) {
        yCoordinate = Math.round(parseInt(it.style.top, 10) + Pin.HEIGHT + HEIGHT_ARROW);
      }
      return xCoordinate + ', ' + yCoordinate;
    }
  };
})();
