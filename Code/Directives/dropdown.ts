/// <reference path="../../all.d.ts" />

module Chores.directives {

	interface IDropDownScope extends ng.IScope {
		dropDownCtrl: dropDownCtrl
	}

	export function dropDown(): ng.IDirective {
		return {
			restrict: 'EA',
			controller: dropDownCtrl,
			controllerAs: 'dropDownCtrl',
			bindToController: true,
			link(scope: IDropDownScope, el: ng.IAugmentedJQuery, attrs: ng.IAttributes) {

				var menu = angular.element(el[0].getElementsByClassName('dropdown-list').item(0));

				function toggle(ev: Event) {
					if (!scope.dropDownCtrl.expanded) {
						menu.addClass('drop-down-show');
					} else {
						menu.removeClass('drop-down-show');
					}

				}

				scope.$watch('dropDownCtrl.expanded', toggle)
			}
		}
	}

	class dropDownCtrl {

		public expanded: boolean;

		constructor($scope: IDropDownScope) {
			$scope.dropDownCtrl = this;
			this.expanded = false;
		}

		toggle() {
			console.log('expanded')
			this.expanded = !this.expanded;
		}
	}
}