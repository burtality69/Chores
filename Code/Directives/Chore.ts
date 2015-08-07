///<reference path="../../all.d.ts"/>

namespace Chores.Directives {

	export function chore(): ng.IDirective {
		return {
			restrict: 'EA',
			require: '^choreList',
			templateURL: './Templates/Chore.html',
			controller: Chores.Controllers.ChoreController,
			controllerAs: 'ChoreCtrl',
			bindToController: true,
			scope: { chore: '=' },
			replace: true,
		}
	}

}

namespace Chores.Controllers {
	export class ChoreController {
		public chore: Chore;
		public firebaseSvc: Chores.Services.fireBaseSvc;

		constructor() {

		}

		static $inject = ['firebaseSvc'];
	}
}