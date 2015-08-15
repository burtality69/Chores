///<reference path="../../all.d.ts"/>

module Chores.Directives {
	export function choreHistoryList(): ng.IDirective {
		return {
			restrict: 'E',
			controller: Chores.Controllers.ChoreHistoryCtrl,
			controlleras: 'HistoryCtrl',
			bindToController: true,
			replace: true,
			templateUrl: '/Views/Templates/ChoreHistoryList.htm'
		}
	}
}

interface IChoreHistoryScope extends ng.IScope {ChoreHistoryCtrl: Chores.Controllers.ChoreHistoryCtrl}

module Chores.Controllers {
	export class ChoreHistoryCtrl {
		
		static $inject = ['$scope','firebaseSvc'];
		public historyList: ChoresMeta[];
		
		
		constructor($scope: IChoreHistoryScope, public firebaseSvc: Chores.Services.fireBaseSvc) {
			$scope.ChoreHistoryCtrl = this; 
			
			this.firebaseSvc.getChoreHistory().then(d=>{
				this.historyList = d;
			})
		}		
	}
}