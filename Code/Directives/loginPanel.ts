///<reference path="../../all.d.ts"/>

module Chores.Directives{
	export function loginPanel() :ng.IDirective {
		return {
			restrict: 'E',
			controller:  Chores.Controllers.loginPanelCtrl,
			controllerAs: 'loginPanelCtrl',
			replace: true,
			templateUrl: './Views/Templates/LoginPanel.htm'
		}
	}
}

module Chores.Controllers{
	export class loginPanelCtrl{
		static $inject = ['sessionSvc','ModalService'];
		
		public sessionSvc: Chores.Services.SessionSvc;
		public ModalService: angular.modalService.modalService
		
		constructor(sessionSvc: Chores.Services.SessionSvc, ModalService: angular.modalService.modalService) {
			this.sessionSvc = sessionSvc;
			this.ModalService = ModalService;
		}
		
		login(){
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
			
		}
	}
}

module Chores.Controllers {
	export class LoginModalCtrl {
		static $inject = ['$scope','close'];
		
		public close: Function;
		public loginForm: FirebaseCredentials
		
		constructor($scope: ng.IScope, close: Function){
			this.close = close;
			this.loginForm = {email: '', password: ''}
		}
	}
}