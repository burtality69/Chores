///<reference path="../../all.d.ts"/>

module Chores.Directives {
	export function choreList(): ng.IDirective {
		return {
			restrict: 'EA',
			templateUrl: './Templates/Chorelist.html',
			bindToController: true,
			controller: Chores.Controllers.chorelistController,
			controllerAs: 'ChoreListCtrl',
			replace: true
		}
	}
}

module Chores.Controllers {
	export class chorelistController {
		
		chorelist: Chore[];
		firebaseSvc: Chores.Services.fireBaseSvc;
		
		constructor(firebaseSvc: Chores.Services.fireBaseSvc) {
			firebaseSvc.getChoreList();
			this.chorelist = firebaseSvc.getChoreList();
		}
		
		static $inject = ['firebaseSvc'];
	}
}