///<reference path="../../all.d.ts"/>

module Chores.Services {

	export class fireBaseSvc {
		public firebase: Firebase;
		public choresUrl: Firebase;
		public dateSvc: dateSvc;
		public weekly: Firebase
		public $q: ng.IQService;
		public thisweeksChores: Firebase;
		public firebaseArray: AngularFireArrayService;

		static $inject = ['$q', 'dateSvc', '$firebaseArray']

		constructor($q: angular.IQService, dateSvc: Chores.Services.dateSvc, $firebaseArray) {
			this.dateSvc = dateSvc;
			this.firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
			this.choresUrl = this.firebase.child("Chores");
			this.weekly = this.firebase.child("Weekly");
			this.$q = $q;
			this.firebaseArray = $firebaseArray;
		}
		
		/**Checks if the current week already exists, if not, it creates it via createWeek */
		checkWeek(): ng.IPromise<boolean> {

			var weekdate = this.dateSvc.thisWeek;
			var exists: boolean = false;
			var p = this.$q.defer();
			
			//Short circuit here if value is found
			this.weekly.child(weekdate).once("value", (data: FirebaseDataSnapshot) => {
				if (data.val() !== null) {
					this.thisweeksChores = this.weekly.child(weekdate);
					p.resolve();
				} else {
					this.createWeek(weekdate).then(() => {
						p.resolve(true);
					}, (error) => {
						throw new Error(error);
					});
				}
			})

			return p.promise;
		}
		
		/** Creates a master record for the week on firebase */
		createWeek(weekdate: string): ng.IPromise<any> {
			var t: ChoreTemplateList = {};
			var weeklyChores: WeeklyChorelist = { chores: [], Meta: { Completed: false, CompletedOn: 0, Paid: false } };
			var p = this.$q.defer();

			this.buildChoreList().then(data =>{
				weeklyChores.chores = data;
				this.weekly.child(weekdate).set(weeklyChores);
				this.thisweeksChores = this.weekly.child(weekdate);
				p.resolve();
			});

			
			return p.promise;
		}
		
		/** Gets a to-do list for the chore-doer */
		getChoreToDoList(): ng.IPromise<$syncChoreList> {
			var p = this.$q.defer();

			this.checkWeek().then(() => {
				var query = this.thisweeksChores.child('chores').orderByChild('completed').equalTo(false);
				var t = this.firebaseArray(query).filter(d =>{
					return d.$id == '1'; 
				}); 
				p.resolve(t);
			})

			return p.promise;
		}
		
		/** Gets progress for this weeks chore (chore master view) */
		getChoresOverView(): ng.IPromise<ChoreList> {
			var p = this.$q.defer();

			this.checkWeek().then(() => {
				this.thisweeksChores.once('value', d=> {
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
			var dates: string[] = this.dateSvc.weekDates;
			
			this.getChoreTemplates().then(data=>{
				Object.keys(data).forEach((d)=>{
					var chore: ChoreTemplate = data[d];
					chore.Schedule.forEach((p,i)=>{
						if(p){
							var b: Chore = {
								Name: chore.Name,
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