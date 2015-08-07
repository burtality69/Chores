///<reference path="../all.d.ts"/>

module Chores {
	
	var app = angular.module('Chores',[])
		.service('firebaseSvc',Chores.Services.fireBaseSvc)
		.controller(Chores.Controllers)
		.directive(Chores.Directives);
}