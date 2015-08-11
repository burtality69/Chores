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
		
		static $inject = ['$q','dateSvc','$firebaseArray']
		
		constructor($q: angular.IQService, dateSvc: Chores.Services.dateSvc,$firebaseArray) {
			this.dateSvc = dateSvc;
			this.firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
			this.choresUrl = this.firebase.child("Chores");
			this.weekly = this.firebase.child("Weekly");
			this.$q = $q;
			this.firebaseArray = $firebaseArray;
		}
		/**Checks if the current week already exists, creates it if not - returns a promise */
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
					},(error)=>{
						throw new Error(error);
					});
				}
			})
				
			return p.promise;
		}
		
		/** Creates a master record for the week on firebase, returns a promise */
		createWeek(weekdate: string): ng.IPromise<any> {
			var t: ChoreTemplateList = {};
			var weeklyChores: WeeklyChorelist = {chores:{},Meta:{Completed: false, CompletedOn:0, Paid: false}};
			var p = this.$q.defer();

			this.choresUrl.once("value", (data)=> {			
				var t = data.val();
				for (var p in t) {
					var c: Chore = t[p];
					c.completed = false;
					weeklyChores.chores[p] = c;
				}
			
				this.weekly.child(weekdate).set(weeklyChores);
				this.thisweeksChores = this.weekly.child(weekdate);
				p.resolve();
			})
			return p.promise;
		}
		
		getChoreToDoList(): ng.IPromise<$syncChoreList>{
			var p = this.$q.defer();
			
			this.checkWeek().then(()=>{
				var query = this.thisweeksChores.child('chores').orderByChild('completed').equalTo(false);
				var t = this.firebaseArray(query);
				p.resolve(t);
			})
			
			return p.promise;
		}
		
		getChoresOverView(): ng.IPromise<$syncChoreList>{
			var p = this.$q.defer();
			
			this.checkWeek().then(()=>{
				var t = this.firebaseArray(this.thisweeksChores);
				p.resolve(t);
			})
			
			return p.promise;
		}
		
		markweekComplete(){
		}
	}
}