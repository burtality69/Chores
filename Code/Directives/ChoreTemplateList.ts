///<reference path="../../all.d.ts"/>

module Chores.Directives {
	export function choreTemplateList(): ng.IDirective {
		return {
			restrict: 'E',
			controller: ChoreTemplateListCtrl,
			controllerAs: 'CTListCtrl',
			templateUrl: './Views/Templates/ChoreTemplateList.html',
			bindToController: true
		}
	}
	
	class ChoreTemplateListCtrl {

		static $inject = ['choresDataSvc'];
		public choretemplates: ChoreTemplateList;

		constructor(public dataSvc: Services.choresDataSvc) {
			this.load()
		}

		save() {
			this.dataSvc.setChoreTemplates(this.choretemplates)
				.then(() => {
					this.load();
				})
				.catch((e) => {
					console.log('There was an error saving the list');
				})
		}

		load() {
			this.dataSvc.getChoreTemplates().then(data=> {
				this.choretemplates = data;
			})
		}
	}
}