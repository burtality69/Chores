///<reference path="../../all.d.ts"/>

module Chores.Directives {
	
	
	
	export function choreCard(): ng.IDirective {
		return {
			restrict: 'EA',
			require: '^choreList',
			templateUrl: './Views/Templates/ChoreCard.htm',
			controller: Chores.Controllers.ChoreController,
			//controllerAs: 'ChoreCtrl',
			bindToController: true,
			scope: false,
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

interface IChoreControllerScope extends ng.IScope {
		ChoreCtrl: Chores.Controllers.ChoreController;
		chore: Chore
	}
module Chores.Controllers {
	export class ChoreController {
		
		static $inject = ['$scope'];
		
		public chore: Chore;
		public firebaseSvc: Chores.Services.fireBaseSvc;
		public complete: ()=>void;
		public imgSource: string;
		public Dismiss: ()=>void;

		constructor($scope: IChoreControllerScope) {
			$scope.ChoreCtrl = this;
			this.chore = $scope.chore; 
			this.imgSource = './Images/' + this.chore.Image + '.png'
		}

		
	}
}