///<reference path="../../all.d.ts"/>

module Chores.Directives {
	export function choreList(): ng.IDirective {
		return {
			restrict: 'EA',
			templateUrl: './Templates/_Chorelist.html',
			bindToController: true,
			controller: Chores.Controllers.chorelistController,
			controllerAs: 'ChoreListCtrl',
			replace: true
		}
	}
}

module Chores.Controllers {
	export class chorelistController {
		
		static $inject = ['firebaseSvc'];
		
		public chorelist: AngularFireArray;
		public firebaseSvc: Chores.Services.fireBaseSvc;
		public firebaseArray: AngularFireArrayService;
		
		constructor(fireBaseSvc: Chores.Services.fireBaseSvc, dateSvc: Chores.Services.dateSvc) {
			
			this.firebaseSvc = fireBaseSvc;
			this.firebaseSvc.getChoreToDoList().then((p)=>{
				this.chorelist = p;
			})
		}
		
	}
}