///<reference path="../../all.d.ts"/>

module Chores.Services {
	
	export class userProfileSvc {
		
		static $inject = ['firebaseSvc','$q','sessionStorageSvc'];
		private _profile: IUserProfile;
		
		constructor (public fb: Chores.Services.firebaseSvc,
					 public $q: ng.IQService, 
					 public sessionStorageSvc: Chores.Services.sessionStorageSvc) {
		}	
		
		loadUserProfile(UID:string): ng.IPromise<IUserProfile> {
			var p = this.$q.defer()
			
			this.fb.usersRoot.child(UID).once('value',(d)=>{
				this._profile = d.val();
				this.sessionStorageSvc.put('Profile',JSON.stringify(d.val()));
				p.resolve(d.val());
			})
			
			return p.promise;
		}
		
		get userProfile(): IUserProfile {
			if(!this._profile){
				return JSON.parse(this.sessionStorageSvc.get('Profile'));
			}
			return this._profile;
		}
		
		purgeProfile(): void {
			this.sessionStorageSvc.delete('Profile');
		}
	}
}