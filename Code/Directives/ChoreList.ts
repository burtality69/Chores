///<reference path="../../all.d.ts"/>

module Chores.Directives {
	export function choreList(): ng.IDirective {
		return {
			restrict: 'EA',
			templateUrl: './Views/Templates/ChoreList.htm',
			bindToController: true,
			controller: Chores.Controllers.chorelistController,
			controllerAs: 'ChoreListCtrl',
			replace: true
		}
	}
}

module Chores.Controllers {
	export class chorelistController {
		
		static $inject = ['firebaseSvc','dateSvc'];
		
		public chorelist: AngularFireArray;
		public firebaseSvc: Chores.Services.fireBaseSvc;
		public firebaseArray: AngularFireArrayService;
		public filterDate: number;
		
		constructor(fireBaseSvc: Chores.Services.fireBaseSvc, dateSvc: Chores.Services.dateSvc) {
			
			this.firebaseSvc = fireBaseSvc;
			this.firebaseSvc.getChoreToDoList().then((p)=>{
					p.$loaded().then(d=>{
						this.chorelist = d;
					})
			})
			this.filterDate = dateSvc.today;
		}
		
	}
}