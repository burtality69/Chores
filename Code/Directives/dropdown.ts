/// <reference path="../../all.d.ts" />

module Chores.Directives {

	interface IDropDownScope extends ng.IScope {
		dropDownCtrl: dropDownCtrl
	}

	export function dropDown(): ng.IDirective {
		return {
			restrict: 'EA',
			controller: dropDownCtrl,
			controllerAs: 'dropDownCtrl',
			bindToController: true,
			scope: {},
			link: function(scope: IDropDownScope, el: ng.IAugmentedJQuery, attrs: ng.IAttributes) {

					var menu = angular.element(el[0].getElementsByClassName('dropdown-list').item(0));
					
					el.on('click',(ev) => {
						console.log('TRIGGERED')
						console.log('Scope state is ' + scope.dropDownCtrl.expanded)
						scope.dropDownCtrl.expanded = !scope.dropDownCtrl.expanded
						menu.toggleClass('dropdown-show');
						menu.toggleClass('dropdown-hide');
					});
				}
			}
		}

		class dropDownCtrl {

			public expanded: boolean;
			static $inject = ['$scope'];

			constructor($scope: IDropDownScope) {
				$scope.dropDownCtrl = this;
				this.expanded = false;
			}

		}
	}