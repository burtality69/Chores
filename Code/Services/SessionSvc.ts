///<reference path="../../all.d.ts"/>

module Chores.Services{
	export class sessionSvc {
		
		static $inject =['$cookies','firebaseSvc','$q'];
		
		public $cookies: ng.cookies.ICookiesService;
		public fireBaseSvc: fireBaseSvc;
		public $q: ng.IQService;
		public _profile: IUserProfile
		
		constructor($cookies: ng.cookies.ICookiesService, firebaseSvc: fireBaseSvc, $q: ng.IQService){
			this.$cookies = $cookies;
			this.fireBaseSvc = firebaseSvc;
			this.$q = $q;
		}
		
		logIn(credentials: FirebaseCredentials): ng.IPromise<FirebaseAuthData>{
			var p = this.$q.defer();
			
			this.fireBaseSvc.firebase.authWithPassword(credentials,(e:Error,a: FirebaseAuthData)=>{
				if(e) {
					p.reject(e);
				} else {
					this.$cookies.put('Authtoken',a.token);
					
					this.fireBaseSvc.getUserProfile(a.uid).then(profile =>{
						this._profile = profile;
						p.resolve(a);
					})
				}
			})
			
			return p.promise;
		}
		
		logOut(){
			this.$cookies.remove('Authtoken');
		}
		
		get Profile(): IUserProfile {
			return this._profile;
		}
		
		set Profile(p: IUserProfile) {
			this._profile = p;
		}
		
		get userLoggedIn(){
			return this.$cookies.get('Authtoken') != undefined;
		}
		
	}
}