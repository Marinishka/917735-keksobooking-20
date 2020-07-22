'use strict';

window.msgError = (function () {
  var mapFiltersElements = document.querySelector('.map__filters').children;

  return {
    loadError: function (msg) {
      var node = document.createElement('div');
      node.style.position = 'absolute';
      node.style.top = '0px';
      node.style = 'z-index: 1; text-align: center; background-color: #ff6547;';
      node.textContent = msg;
      document.body.insertAdjacentElement('afterbegin', node);
      window.form.disableElements(mapFiltersElements);
    }
  };
})();
