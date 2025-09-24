(function () {
    'use strict';

    var app = angular.module('app');
		app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

		//$httpProvider.interceptors.push('TokenInterceptor');

      $urlRouterProvider.otherwise("/etichette");

      $stateProvider
        // MasterPage *****************************************
          .state('root', {
              templateUrl: 'pages/root.html'
          })
          

            // Etichette *****************************************
            .state('root.etichette', {
                url: '/etichette',
                templateUrl: 'app/etichette/etichette.html',
                controller: 'etichetteCtrl as vm'
            })

		});

})();
