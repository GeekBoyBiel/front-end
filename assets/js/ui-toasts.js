/**
 * UI Toasts
 */

'use strict';
//Toastr (jquery)
// --------------------------------------------------------------------
$(function () {
  var i = -1;
  var toastCount = 0;
  var $toastlast;
  var getMessage = function () {
    var msgs = [
    ];
    i++;
    if (i === msgs.length) {
      i = 0;
    }
    return msgs[i];
  };
  var getMessageWithClearButton = function (msg) {
    msg = msg ? msg : 'Clear itself?';
    msg += '<br /><br /><button type="button" class="btn btn-secondary clear">Yes</button>';
    return msg;
  };
  $('#closeButton').on('click', function () {
    if ($(this).is(':checked')) {
      $('#addBehaviorOnToastCloseClick').prop('disabled', false);
    } else {
      $('#addBehaviorOnToastCloseClick').prop('disabled', true);
      $('#addBehaviorOnToastCloseClick').prop('checked', false);
    }
  });

  window.CallToast = function(tipo, title, msg) {
    console.log('Chamando CallToast:', tipo, title, msg);
    var shortCutFunction = tipo,
      isRtl = $('html').attr('dir') === 'rtl',
      msg = msg,
      title = title,
      $showDuration = 300,
      $hideDuration = 3000,
      $timeOut = 3000,
      $extendedTimeOut = 3000,
      $showEasing = 'swing',
      $hideEasing = 'linear',
      $showMethod = 'fadeIn',
      $hideMethod = 'fadeOut',
      toastIndex = toastCount++,
      addClear = false,
      prePositionClass = 'toast-top-right';

    prePositionClass =
      typeof toastr.options.positionClass === 'undefined' ? 'toast-top-right' : toastr.options.positionClass;

    toastr.options = {
      maxOpened: 1,
      autoDismiss: true,
      closeButton: false,
      debug: false,
      newestOnTop: false,
      progressBar: true,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      onclick: null,
      rtl: isRtl
    };

    //Add fix for multiple toast open while changing the position
    if (prePositionClass != toastr.options.positionClass) {
      toastr.options.hideDuration = 0;
      toastr.clear();
    }

    if ($('#addBehaviorOnToastClick').prop('checked')) {
      toastr.options.onclick = function () {
        alert('You can perform some custom action after a toast goes away');
      };
    }
    if ($('#addBehaviorOnToastCloseClick').prop('checked')) {
      toastr.options.onCloseClick = function () {
        alert('You can perform some custom action when the close button is clicked');
      };
    }
    if (addClear) {
      msg = getMessageWithClearButton(msg);
      toastr.options.tapToDismiss = false;
    }
    if (!msg) {
      msg = getMessage();
    }
    var $toast = toastr[shortCutFunction](msg, title); // Wire up an event handler to a button in the toast, if it exists
    $toastlast = $toast;
    if (typeof $toast === 'undefined') {
      return;
    }
  };

  function getLastToast() {
    return $toastlast;
  }
  $('#clearlasttoast').on('click', function () {
    toastr.clear(getLastToast());
  });
  $('#cleartoasts').on('click', function () {
    toastr.clear();
  });
});
