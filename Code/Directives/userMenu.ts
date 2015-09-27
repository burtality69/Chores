///<reference path="../../all.d.ts"/>

module Chores.Directives {
	export function userMenu(): ng.IDirective {
		return {
			restrict: 'E',
			templateUrl: 'Views/Templates/userMenu.html',
			controller: userMenuCtrl,
			bindToController: true,
			controllerAs: 'userMenuCtrl',
			link: (scope: ng.IScope, el: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

			}
		}
	}

	class userMenuCtrl {

		isopen: boolean;
		constructor(){
			
		}
		toggle() {
			this.isopen = !this.isopen;
		}
	}
}
