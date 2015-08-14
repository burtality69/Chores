///<reference path="../../all.d.ts"/>

module Chores.Services{
	export class SessionSvc {
		
		static $inject =['$cookies'];
		
		public $cookies: ng.cookies.ICookiesService;
		public fireBaseSvc: fireBaseSvc;
		
		constructor($cookies: ng.cookies.ICookiesService, firebaseSvc: fireBaseSvc){

		}
		
		logIn(credentials: FirebaseCredentials){
			this.fireBaseSvc.firebase.authWithPassword(credentials,(e,a)=>{
				this.$cookies.put('Authtoken',a.token);
			})
		}
		
		logOut(){
			this.$cookies.remove('Authtoken');
		}
		
		get userLoggedIn(){
			return this.$cookies.get('Authtoken').length;
		}
		
	}
}