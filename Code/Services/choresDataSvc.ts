///<reference path="../../all.d.ts"/>

module Chores.Services {
	
	export class choresDataSvc {
		
		static $inject = ['firebaseSvc','dateSvc','$q'];
		
		constructor(public fb: Chores.Services.firebaseSvc,
					public dateSvc: Chores.Services.dateSvc,
					public $q: ng.IQService) {	
		}
		
		/**Checks if the current week already exists, if not, it creates it via createWeek */
		checkWeek(): ng.IPromise<boolean> {
			var date = this.dateSvc.thisWeek;
			var exists: boolean = false;
			var p = this.$q.defer();
			
			//Short circuit here if value is found
			this.fb.weeklyRoot.child(date).once("value", (data: FirebaseDataSnapshot) => {
				if (data.val() !== null) {
					p.resolve();
				} else {
					this.createWeek(date).then(() => {
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
			
			this.fb.metaRoot.once('value',data=>{
				p.resolve(data.val());	
			})
			return p.promise;
		}
		
		addChore(c: IChoreTemplate): ng.IPromise<any> {
			var p = this.$q.defer();
			
			this.fb.choresRoot.push(c,(e) =>{
				if (e) {
					p.reject(e);
				} else {
					p.resolve()
				}
			})
			
			return p.promise;
		}
		
		/** Gets a to-do list for the chore-doer - angularFireArray*/
		getChoreToDoList(): ng.IPromise<$SyncChoreList> {
			var p = this.$q.defer();
			var start = this.dateSvc.weekStart;
			var end = this.dateSvc.today;
			
			this.checkWeek().then(() => {
				var query = this.fb.weeklyRoot.child(this.dateSvc.thisWeek).orderByChild('completed').equalTo(false);
				p.resolve(this.fb.AngularFireArray(query));
			})

			return p.promise;
		}
		
		/** Approve a completed week's chores */
		approveWeek(){
			var now = this.dateSvc.dateToString(new Date());
			this.fb.metaRoot.child(this.dateSvc.thisWeek).update({Completed: true, CompletedOn: now})
		}
		
		/** Creates a master record for the week on firebase */
		createWeek(weekdate: string): ng.IPromise<any> {
			var t: ChoreTemplateList = {};
			var weeklyMeta = { Completed: false, CompletedOn: 0, Paid: false };
			var p = this.$q.defer();

			this.buildChoreList().then(data =>{

				this.fb.metaRoot.child(this.dateSvc.thisWeek).set(weeklyMeta);
				this.fb.weeklyRoot.child(weekdate).set(data);
				
				p.resolve();
			});
			
			return p.promise;
		}		
		
		/** Gets progress for this weeks chore (chore master view) */
		getChoresOverView(): ng.IPromise<ChoreList> {
			var p = this.$q.defer();

			this.checkWeek().then(() => {
				this.fb.weeklyRoot.child(this.dateSvc.thisWeek).once('value', d=> {
					p.resolve(d.val());
				})
			})

			return p.promise;
		}
		
		/** Gets the master template list */
		getChoreTemplates(): ng.IPromise<IChoreTemplate[]> {
			var p = this.$q.defer();
			
			this.fb.choresRoot.once('value', d=> {
					p.resolve(d.val());
			})
			
			return p.promise;
		}
		
		setChoreTemplates(list: ChoreTemplateList) {
			var p = this.$q.defer();
			
			this.fb.choresRoot.set(list,(e) => {
				if(e){
					p.reject(e);
				} else {
					p.resolve();
				}
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
					var chore: IChoreTemplate = data[d];
					chore.Schedule.forEach((p,i)=>{
						if(p){
							var b: Chore = {
								Name: chore.Name,
								Image: chore.Image || '',
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