///<reference path="../../all.d.ts"/>

module Chores.Directives {
	export function approvalList(): ng.IDirective {
		return {
			restrict: 'EA',
			templateUrl: './Views/Templates/ApprovalList.html',
			controller: ApprovalListController,
			controllerAs: 'ApprovalCtrl',
			bindToController: true,
			replace: true
		}
	}

	class ApprovalListController {
		public chorelist: ChoreList
		static $inject = ['choresDataSvc'];

		constructor(public dataSvc: Services.choresDataSvc) {
			this.dataSvc.getChoresOverView().then((p) => {
				this.chorelist = p;
			})
		}

		approve() {
			console.log('approving..')
			this.dataSvc.approveWeek();
		}
	}
}