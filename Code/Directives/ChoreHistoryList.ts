///<reference path="../../all.d.ts"/>

module Chores.Directives {
	export function ChoreHistoryList(): ng.IDirective {
		return {
			restrict: 'E',
			controller: Chores.Controllers.ChoreHistoryCtrl,
			controlleras: 'HistoryCtrl',
			bindToController: true,	
		}
	}
}

module Chores.Controllers {
	export class ChoreHistoryCtrl {
		
		static $inject = ['firebaseSvc'];
		public historyList: ChoresMeta[];
				
		constructor(public firebaseSvc: Chores.Services.fireBaseSvc) {
			this.firebaseSvc.getChoreHistory().then(d=>{
				this.historyList = d;
			})
		}		
	}
}