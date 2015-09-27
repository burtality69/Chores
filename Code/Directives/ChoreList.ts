///<reference path="../../all.d.ts"/>

module Chores.Directives {
	export function choreList(): ng.IDirective {
		return {
			restrict: 'EA',
			bindToController: true,
			controller: chorelistController,
			controllerAs: 'ChoreListCtrl',
			replace: true,
			template: `<div>
							<h1 class="header center orange-text"> Chores </h1>
							<div class="container" id="choreList">
								<chore-card ng-animate="'animate'" ng-repeat="chore in ChoreListCtrl.chorelist | filter: chore.Due < ChoreListCtrl.filterDate && !chore.completed"
								chore="chore"></chore-card>
							</div>
					  </div>`
		}
	}
	class chorelistController {

		static $inject = ['choresDataSvc', 'dateSvc'];

		public chorelist: AngularFireArray;
		public filterDate: number;

		constructor(public dataSvc: Services.choresDataSvc, dateSvc: Services.dateSvc) {

			this.dataSvc.getChoreToDoList().then((p) => {
				p.$loaded().then(d=> {
					this.chorelist = d;
				})
			})
			this.filterDate = dateSvc.today;
		}

	}
}