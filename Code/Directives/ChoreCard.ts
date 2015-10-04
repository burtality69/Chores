///<reference path="../../all.d.ts"/>

module Chores.Directives {

	interface IChoreControllerScope extends ng.IScope {
		ChoreCtrl: ChoreController;
		chore: Chore
	}

	export function choreCard(): ng.IDirective {
		return {
			restrict: 'EA',
			require: '^choreList',
			templateUrl: './Views/Templates/ChoreCard.htm',
			controller: ChoreController,
			//controllerAs: 'ChoreCtrl',
			bindToController: true,
			scope: false,
			replace: true,
			link: (scope: IChoreControllerScope, el: Element, attr: ng.IAugmentedJQuery, ctrl: Chores.Directives.chorelistController) => {
				scope.ChoreCtrl.complete = () => {

					scope.ChoreCtrl.chore.completed = true;
					ctrl.chorelist.$save(scope.ChoreCtrl.chore);
				};

			}
		}
	};

	class ChoreController {

		static $inject = ['$scope'];

		public chore: Chore;
		public firebaseSvc: Chores.Services.firebaseSvc;
		public complete: () => void;
		public imgSource: string;
		public Dismiss: () => void;

		constructor($scope: IChoreControllerScope) {
			$scope.ChoreCtrl = this;
			this.chore = $scope.chore;
			this.imgSource = this.chore.Image
		}


	}
}
