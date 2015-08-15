///<reference path="../../all.d.ts"/>

module Chores.Services {

	export class fireBaseSvc {
		/**The root firebase service */
		public firebase: Firebase;
		/**Chore templates endpoint */
		public choresUrl: Firebase;
		/**The weekly chores data endpoint */
		public weekly: Firebase
		/**The weekly metadata endpoint */
		public meta: Firebase
		
		/**The naming convention for a week node */
		public weekdate: string; 

		static $inject = ['$q', 'dateSvc', '$firebaseArray']

		constructor(public $q: angular.IQService, public dateSvc: Chores.Services.dateSvc, public AngularFireArray: AngularFireArrayService) {
			this.firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
			this.choresUrl = this.firebase.child("Chores");
			this.weekly = this.firebase.child("Weekly");
			this.meta = this.firebase.child("Meta");
			this.weekdate =  dateSvc.thisWeek;
		}
		
		/**Checks if the current week already exists, if not, it creates it via createWeek */
		checkWeek(): ng.IPromise<boolean> {

			var exists: boolean = false;
			var p = this.$q.defer();
			
			//Short circuit here if value is found
			this.weekly.child(this.weekdate).once("value", (data: FirebaseDataSnapshot) => {
				if (data.val() !== null) {
					p.resolve();
				} else {
					this.createWeek(this.weekdate).then(() => {
						p.resolve(true);
					}, (error) => {
						throw new Error(error);
					});
				}
			})

			return p.promise;
		}
		
		/** Returns the meta for each available week of chores */
		getChoreHistory(): ng.IPromise<ChoresMeta[]>{
			var p = this.$q.defer();
			
			this.firebase.child('Meta').once('value',data=>{
				p.resolve(data.val());	
			})
			return p.promise;
		}
		
		/** Returns the profile of a user by UID - for execution after authorisatin */
		getUserProfile(UID:string): ng.IPromise<IUserProfile> {
			var p = this.$q.defer()
			
			this.firebase.child('Users').child(UID).once('value',d=>{
				p.resolve(d.val());
			})
			
			return p.promise;
		}
		
		/** Gets a to-do list for the chore-doer */
		getChoreToDoList(): ng.IPromise<$SyncChoreList> {
			var p = this.$q.defer();
			var start = this.dateSvc.weekStart;
			var end = this.dateSvc.today;
			this.checkWeek().then(() => {
				var query = this.firebase.child('Weekly').child(this.weekdate).orderByChild('completed').equalTo(false);
				p.resolve(this.AngularFireArray(query));
			})

			return p.promise;
		}
		
		approveWeek(){
			var now = new Date().getTime();
			this.firebase.child('Meta').child(this.weekdate).update({Completed: true, CompletedOn: now})
		}
		/** Creates a master record for the week on firebase */
		createWeek(weekdate: string): ng.IPromise<any> {
			var t: ChoreTemplateList = {};
			var weeklyMeta = { Completed: false, CompletedOn: 0, Paid: false };
			var p = this.$q.defer();

			this.buildChoreList().then(data =>{

				this.meta.child(this.weekdate).set(weeklyMeta);
				this.weekly.child(weekdate).set(data);
				
				p.resolve();
			});
			
			return p.promise;
		}		
		
		/** Gets progress for this weeks chore (chore master view) */
		getChoresOverView(): ng.IPromise<ChoreList> {
			var p = this.$q.defer();

			this.checkWeek().then(() => {
				this.firebase.child('Weekly').child(this.weekdate).once('value', d=> {
					p.resolve(d.val());
				})
			})

			return p.promise;
		}
		
		/** Gets the master template list */
		getChoreTemplates(): ng.IPromise<ChoreTemplate[]> {
			var p = this.$q.defer();
			
			this.choresUrl.once('value', d=> {
					p.resolve(d.val());
			})
			
			return p.promise;
		}
		
		/** Builds a list of due chores for current week from templates */
		private buildChoreList(): ng.IPromise<Chore[]> {
			
			var p = this.$q.defer();
			var ret: Chore[] = [];
			var schedule = {}
			var dates: number[] = this.dateSvc.weekDates;
			
			this.getChoreTemplates().then(data=>{
				Object.keys(data).forEach((d)=>{
					var chore: ChoreTemplate = data[d];
					chore.Schedule.forEach((p,i)=>{
						if(p){
							var b: Chore = {
								Name: chore.Name,
								imgSource: chore.Image,
								Description: chore.Description,
								Due: dates[i],
								completed: false,
								approved: false
							}

							ret.push(b);
						}
					})
				})
				p.resolve(ret);
			});
			
			return p.promise;	
		}
	}
}