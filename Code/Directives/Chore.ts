///<reference path="../../all.d.ts"/>

module Chores.Directives {
	
	interface IChoreControllerScope extends ng.IScope {
		ChoreCtrl: Chores.Controllers.ChoreController;
	}
	export function choreCard(): ng.IDirective {
		return {
			restrict: 'EA',
			require: '^choreList',
			//templateURL: './Templates/Chore.html',
			controller: Chores.Controllers.ChoreController,
			controllerAs: 'ChoreCtrl',
			bindToController: true,
			scope: {chore: '='},
			replace: true,
			template: 	'<div ng-swipe-right="ChoreCtrl.complete()" class="card avatar lime accent-3">' + 
							'<div class="card-content">' +
		      					'<img class="circle" ng-src="{{ChoreCtrl.imgSource}}"></img>' +
		      					'<span class="card-title">{{ChoreCtrl.chore.Name}}</span>' +
		      					'<p>{{ChoreCtrl.chore.Description}}</p>' +
							'</div>' +
	  					'</div>',
		    link: (scope: IChoreControllerScope, el:Element, attr: ng.IAugmentedJQuery,ctrl: Chores.Controllers.chorelistController) =>{
				scope.ChoreCtrl.complete = ()=> {
					
					scope.ChoreCtrl.chore.completed = true;
					ctrl.chorelist.$save(scope.ChoreCtrl.chore);
				}
			}
		}
	};

}

module Chores.Controllers {
	export class ChoreController {
		public chore: Chore;
		public firebaseSvc: Chores.Services.fireBaseSvc;
		public complete: ()=>void;
		public imgSource: string;

		constructor() {
			this.imgSource = './Images/' + this.chore.Image + '.png'
		}

		static $inject = ['firebaseSvc'];
	}
}