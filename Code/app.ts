///<reference path="../all.d.ts"/>

module Chores {

  var app = angular.module('Chores', ['firebase', 'ngAnimate', 'ngTouch','ngRoute'])
    .service('dateSvc', Chores.Services.dateSvc)
    .service('firebaseSvc', Chores.Services.fireBaseSvc)
    .controller(Chores.Controllers)
    .directive(Chores.Directives);

  app.config(['$routeProvider','$locationProvider', ($routeProvider: ng.route.IRouteProvider,$locationProvider: ng.ILocationProvider) => {
    $routeProvider.
      when('/History', {
        templateUrl: 'Templates/History.html',
        resolve: {}
      }).
      when('/Approve', {
        templateUrl: 'Templates/Approval.html',
        resolve: {}
      }).
      when('/Settings', {
        templateUrl: 'Templates/Settings.html',
        resolve: {}        
      }).
      when('/',{
        templateUrl: 'Templates/Chorelist.html',
        resolve: {}
      }).
      otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  
  }]);
}