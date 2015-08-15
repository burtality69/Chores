///<reference path="../../all.d.ts"/>

module Chores.Services {
	export class sessionSvc {

		static $inject = ['$cookies', 'firebaseSvc', '$q','sessionStorageSvc'];

		public _profile: IUserProfile

		constructor(public $cookies: ng.cookies.ICookiesService, public fireBaseSvc: fireBaseSvc, public $q: ng.IQService,
			public sessionStorageSvc: Chores.Services.sessionStorageSvc){
		}

		logIn(credentials: FirebaseCredentials): ng.IPromise<FirebaseAuthData> {
			var p = this.$q.defer();

			this.fireBaseSvc.firebase.authWithPassword(credentials, (e: Error, a: FirebaseAuthData) => {
				if (e) { p.reject(e);}
				
				this.$cookies.put('Authtoken', a.token);

				this.fireBaseSvc.getUserProfile(a.uid).then(profile => {
					this._profile = profile;
					this.sessionStorageSvc.put('Profile',JSON.stringify(profile));
					p.resolve(a);
				})
			})

			return p.promise;
		}

		logOut() {
			this.$cookies.remove('Authtoken');
			this.sessionStorageSvc.delete('Profile');
		}

		get Profile(): IUserProfile {
			if(!this._profile){
				return JSON.parse(this.sessionStorageSvc.get('Profile'));
			}
			return this._profile;
		}

		set Profile(p: IUserProfile) {
			this._profile = p;
		}

		get userLoggedIn() {
			return this.$cookies.get('Authtoken') != undefined;
		}

	}
}