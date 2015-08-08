///<reference path="../../all.d.ts"/>

module Chores.Directives {

	export function choreCard(): ng.IDirective {
		return {
			restrict: 'EA',
			require: '^choreList',
			//templateURL: './Templates/Chore.html',
			controller: Chores.Controllers.ChoreController,
			controllerAs: 'ChoreCtrl',
			bindToController: true,
			scope: { chore: '=' },
			replace: true,
			template: '<div class="card avatar">' + 
      					'<img src="images/yuna.jpg" alt="" class="circle">' +
      					'<span class="title">Title</span>' +
      					'<p>{{ChoreCtrl.chore.name}}</p>' +
            			'<i class="material-icons dp48 secondary-content">done</i>' +
	  					'</div>'
		}
	};

}

module Chores.Controllers {
	export class ChoreController {
		public chore: Chore;
		public firebaseSvc: Chores.Services.fireBaseSvc;

		constructor() {
				console.log('Constructed a chore')
		}

		static $inject = ['firebaseSvc'];
	}
}