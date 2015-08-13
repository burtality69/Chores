///<reference path="../../all.d.ts"/>

module Chores.Directives{
	export function choreTemplateList() : ng.IDirective {
		return {
			restrict: 'E',
			controller: Chores.Controllers.ChoreTemplateListCtrl,
			controllerAs: 'CTListCtrl',
			templateUrl: './Templates/_ChoreTemplateList.html',
			bindToController: true			
		}
	}
}

module Chores.Controllers {
	export class ChoreTemplateListCtrl{
		public choretemplates: ChoreTemplateList;
		public firebaseSvc: Chores.Services.fireBaseSvc;
		
		constructor(firebaseSvc: Chores.Services.fireBaseSvc){
			this.firebaseSvc = firebaseSvc;	
			this.load()
		}
		
		save(){
			this.firebaseSvc.choresUrl.set(this.choretemplates,(e)=>{
				if(e){
					console.log('There was a problem saving');
				} else {
					console.log('saved successfully');
					this.load();
				}
			});
		}
		
		load(){
			this.firebaseSvc.getChoreTemplates().then(data=>{
				this.choretemplates = data;
			})
		}
	}
}