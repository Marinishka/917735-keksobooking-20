'use strict';

window.image = (function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var avatarInput = document.querySelector('.ad-form-header__input');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoInput = document.querySelector('.ad-form__input');
  var photoPreview = document.querySelector('.ad-form__photo');

  var onAvatarInputChange = function () {
    var fileAvatar = avatarInput.files[0];
    var fileAvatarName = fileAvatar.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileAvatarName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });
      reader.readAsDataURL(fileAvatar);
    }
  };

  var onPhotoInputChange = function () {
    var filePhoto = photoInput.files[0];
    var filePhotoName = filePhoto.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return filePhotoName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        var photoPreviewImg = photoPreview.querySelector('img');
        if (!photoPreviewImg) {
          photoPreviewImg.src = reader.result;
        } else {
          photoPreviewImg = document.createElement('img');
          photoPreviewImg.style.width = '100%';
          photoPreviewImg.src = reader.result;
          photoPreview.appendChild(photoPreviewImg);
        }
      });
      reader.readAsDataURL(filePhoto);
    }
  };

  return {
    onAvatarInputChange: onAvatarInputChange,
    onPhotoInputChange: onPhotoInputChange
  };
})();
