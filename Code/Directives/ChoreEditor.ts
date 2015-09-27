///<reference path="../../all.d.ts"/>

module Chores.Directives {

	export function choreEditor(): ng.IDirective {
		return {
			restrict: 'E',
			controller: ChoreEditorCtrl,
			controllerAs: 'choreEditCtrl',
			bindToController: true,
			templateUrl: 'Views/Templates/choreEditor.html'
		}
	}

	class ChoreEditorCtrl {

		static $inject = ['choresDataSvc'];
		private chore: IChoreTemplate;
		public expanded: boolean;

		constructor(public dataSvc: Services.choresDataSvc) {
			this.load();
		}

		save(): void {
			this.dataSvc.addChore(this.chore)
				.then(() => {
					console.log('Chore Submitted succesfully')
					this.load();
				})
				.catch((e) => {
					console.log('There was an error ' + e)
				})
		}

		toggleEditor() {
			this.expanded = !this.expanded;
		}

		private load(): void {
			this.chore = {
				Description: undefined,
				Name: undefined,
				Frequency: '',
				Schedule: [false, false, false, false, false, false, false]
			}
			this.expanded = false;
		}
	}
}