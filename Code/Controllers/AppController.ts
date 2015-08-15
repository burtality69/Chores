///<reference path="../../all.d.ts"/>

module Chores.Controllers {
	
	export class AppController {
		static $inject = ['ModalService','sessionSvc','$rootScope'];
		
		constructor(public ModalService: angular.modalService.modalService, public sessionSvc: Chores.Services.sessionSvc, public $rootScope: ng.IRootScopeService) {
		}
		
		logIn(){
			this.ModalService.showModal({
				controller: 'LoginModalCtrl',
				templateUrl: './Views/Templates/LoginRegister.htm'
			}).then(modal =>{
				modal.close.then(a=>{
					console.log('Modal closed')
				})
			})
		}
		
		logOut(){
			this.sessionSvc.logOut();
		}
		
		get loggedIn(){
			return this.sessionSvc.userLoggedIn;
		}
		
		get user(){
			return this.sessionSvc.Profile;
		}
		
	}
}

