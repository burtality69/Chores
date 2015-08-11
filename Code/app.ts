///<reference path="../all.d.ts"/>

module Chores {

  var app = angular.module('Chores', ['firebase', 'ngAnimate', 'ngTouch','ngRoute'])
    .service('dateSvc', Chores.Services.dateSvc)
    .service('firebaseSvc', Chores.Services.fireBaseSvc)
    .controller(Chores.Controllers)
    .directive(Chores.Directives);

  app.config(['$routeProvider','$locationProvider', ($routeProvider,$locationProvider) => {
    $routeProvider.
      when('/History', {
        templateUrl: 'Templates/History.html',
      }).
      when('/Approve', {
        templateUrl: 'Templates/Approval.html',
      }).
      when('/',{
        templateUrl: 'Templates/Chorelist.html'
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);
}