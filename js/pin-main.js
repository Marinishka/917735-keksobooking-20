'use strict';

(function () {
  var Pin = {
    HEIGHT: 62,
    WIDTH: 62
  };
  var LimitY = {
    MAX: 630,
    MIN: 130
  };
  var HEIGHT_ARROW = 22;
  var mapPins = document.querySelector('.map__pins');
  var widthMapPins = mapPins.clientWidth;
  var adForm = document.querySelector('.ad-form');
  var formAddress = adForm.querySelector('#address');

  window.pinMain = {
    onMouseDown: function (evt) {
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

        var moveX = parseInt(window.main.mapPinMain.style.left, 10) + shift.X;
        var moveY = parseInt(window.main.mapPinMain.style.top, 10) + shift.Y;
        var arrowheadCoordinateX = moveX + Pin.WIDTH / 2;
        var arrowheadCoordinateY = moveY + Pin.HEIGHT + HEIGHT_ARROW;
        if (arrowheadCoordinateX < 0 ||
            arrowheadCoordinateX > widthMapPins ||
            arrowheadCoordinateY < LimitY.MIN ||
            arrowheadCoordinateY > LimitY.MAX) {
          return;
        }
        window.main.mapPinMain.style.left = moveX + 'px';
        window.main.mapPinMain.style.top = moveY + 'px';
        formAddress.value = window.address(window.main.mapPinMain);
      };

      var onMouseUp = function () {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  };
})();
