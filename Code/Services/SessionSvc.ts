///<reference path="../../all.d.ts"/>

module Chores.Services {
	export class sessionSvc {

		static $inject = ['$cookies', 'firebaseSvc','userProfileSvc', '$q'];

		constructor(public $cookies: ng.cookies.ICookiesService, 
					public fireBaseSvc: firebaseSvc,
					public userProfileSvc: Chores.Services.userProfileSvc, 
					public $q: ng.IQService){
		}

		logIn(credentials: FirebaseCredentials): ng.IPromise<FirebaseAuthData> {
			var p = this.$q.defer();

			this.fireBaseSvc.root.authWithPassword(credentials, (e: Error, a: FirebaseAuthData) => {
				if (e) { p.reject(e);}
				
				this.$cookies.put('Authtoken', a.token);

				this.userProfileSvc.loadUserProfile(a.uid).then(profile => {
					p.resolve(a);
				})
			})

			return p.promise;
		}

		logOut() {
			this.$cookies.remove('Authtoken');
			this.userProfileSvc.purgeProfile();
		}

		get userLoggedIn() {
			return this.$cookies.get('Authtoken') != undefined;
		}

	}
}