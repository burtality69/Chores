///<reference path="../../all.d.ts"/>"
interface ILoginModalScope extends ng.IScope {LoginModalCtrl: Chores.Controllers.LoginModalCtrl}; 

module Chores.Controllers {
	export class LoginModalCtrl {
		static $inject = ['$scope','close','sessionSvc'];
		
		public close: Function;
		public loginForm: FirebaseCredentials
		public display: boolean;
		public error: string;
		
		constructor($scope: ILoginModalScope, close: Function, public sessionSvc: Chores.Services.sessionSvc){
			$scope.LoginModalCtrl= this; 
			this.display = true;
			this.loginForm = {email: '', password: ''}
			this.close = ()=>{
				this.display = false;
				close();
			}
		}
		
		logIn(){
			this.sessionSvc.logIn(this.loginForm).then(a=>{
				this.close();
			}).catch((e:Error)=>{
				this.error = e.message;
			})
		}
		
		cancel(){
			this.close();
		}
		
	}
}