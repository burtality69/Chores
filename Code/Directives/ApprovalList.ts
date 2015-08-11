///<reference path="../../all.d.ts"/>

module Chores.Directives {
	export function approvalList(): ng.IDirective {
		return {
			restrict: 'EA',
			templateUrl: './Templates/_ApprovalList.html',
			controller: Chores.Controllers.ApprovalListController,
			controllerAs: 'ApprovalCtrl',
			bindToController: true,
			replace: true
		}
	}
}

module Chores.Controllers {
	export class ApprovalListController {
		public chorelist: $syncChoreList
		static $inject = ['firebaseSvc','$firebaseArray'];
		public firebaseArray: AngularFireArrayService;
		
		constructor(firebaseSvc: Chores.Services.fireBaseSvc, $firebaseArray: AngularFireArrayService){
			
			firebaseSvc.getChoresOverView().then((p)=>{
				this.chorelist = p;
			})
		}
		
		approve(){
			
		}		
	}
}