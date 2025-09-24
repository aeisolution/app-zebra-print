(function () {
    'use strict';

		var app = angular.module('app');

    var controllerId = 'shell';
    app.controller(controllerId,
        ['$scope', '$location', '$rootScope', shell]);

    function shell($scope) {
      var vm = this;
			vm.isLogged = false;

			// Autenticated User
			vm.username = 'utente';
    };
})();
