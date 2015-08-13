///<reference path="../../all.d.ts"/>

module Chores.Directives {
	
	interface IChoreControllerScope extends ng.IScope {
		ChoreCtrl: Chores.Controllers.ChoreController;
	}
	
	export function choreCard(): ng.IDirective {
		return {
			restrict: 'EA',
			require: '^choreList',
			templateUrl: './Templates/_Chore.html',
			controller: Chores.Controllers.ChoreController,
			controllerAs: 'ChoreCtrl',
			bindToController: true,
			scope: {chore: '='},
			replace: true,
		    link: (scope: IChoreControllerScope, el:Element, attr: ng.IAugmentedJQuery,ctrl: Chores.Controllers.chorelistController) =>{
				scope.ChoreCtrl.complete = ()=> {
					
					scope.ChoreCtrl.chore.completed = true;
					ctrl.chorelist.$save(scope.ChoreCtrl.chore);
				};
				
			}
		}
	};

}

module Chores.Controllers {
	export class ChoreController {
		
		static $inject = ['firebaseSvc'];
		
		public chore: Chore;
		public firebaseSvc: Chores.Services.fireBaseSvc;
		public complete: ()=>void;
		public imgSource: string;
		public Dismiss: ()=>void;

		constructor() {
			this.imgSource = './Images/' + this.chore.Image + '.png'
		}

		
	}
}