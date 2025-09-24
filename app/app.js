(function() {
  'use strict';

  var app = angular.module('app', [
      // Angular modules
      'ngAnimate',        // animations
      //'ngRoute',          // routing
      'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
      'ngMessages',	      // Validation Messages

      // 3rd Party Modules
      'ui.router',
      'ui.bootstrap',      // ui-bootstrap (ex: carousel, pagination, dialog)
      'toastr'
  ]);

}());
