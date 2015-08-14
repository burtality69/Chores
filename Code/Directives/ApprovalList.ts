///<reference path="../../all.d.ts"/>

module Chores.Directives {
	export function approvalList(): ng.IDirective {
		return {
			restrict: 'EA',
			templateUrl: './Views/Templates/ApprovalList.html',
			controller: Chores.Controllers.ApprovalListController,
			controllerAs: 'ApprovalCtrl',
			bindToController: true,
			replace: true
		}
	}
}

module Chores.Controllers {
	export class ApprovalListController {
		public chorelist: ChoreList
		static $inject = ['firebaseSvc','$firebaseArray'];
		public firebaseArray: AngularFireArrayService;
		public firebaseSvc: Chores.Services.fireBaseSvc;
		
		constructor(firebaseSvc: Chores.Services.fireBaseSvc){
			this.firebaseSvc = firebaseSvc;
			this.firebaseSvc.getChoresOverView().then((p)=>{
				this.chorelist = p;
			})
		}
		
		approve(){
			console.log('approving..')
			this.firebaseSvc.thisweeksChores.child('Meta').child('Completed').set(true);
			this.firebaseSvc.thisweeksChores.child('Meta').child('CompletedOn').set(new Date());
		}		
	}
}