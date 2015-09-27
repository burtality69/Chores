///<reference path="../../all.d.ts"/>

module Chores.Directives {
	
	interface IChoreHistoryScope extends ng.IScope {
		ChoreHistoryCtrl: ChoreHistoryCtrl
	}
	
	export function choreHistoryList(): ng.IDirective {
		return {
			restrict: 'E',
			controller: ChoreHistoryCtrl,
			controllerAs: 'HistoryCtrl',
			bindToController: true,
			replace: true,
			templateUrl: '/Views/Templates/ChoreHistoryList.htm'
		}
	}

	class ChoreHistoryCtrl {
		
		static $inject = ['$scope','choresDataSvc'];
		public historyList: ChoresMeta[];
		
		
		constructor($scope: IChoreHistoryScope, public dataSvc: Services.choresDataSvc) {
			$scope.ChoreHistoryCtrl = this; 
			
			this.dataSvc.getChoreHistory().then(d=>{
				this.historyList = d;
			})
		}		
	}
}