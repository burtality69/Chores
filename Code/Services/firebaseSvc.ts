///<reference path="../../all.d.ts"/>

module Chores.Services {
	
	export class fireBaseSvc {
		public firebase: Firebase
		public choresUrl: Firebase
		public weekly: Firebase
		
		constructor() {
			this.firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
			this.choresUrl = this.firebase.child("Chores");
			this.weekly = this.firebase.child("weekly")
		}
		
		getChoreList(){
			var ret: Chore[] = [];
			this.choresUrl.on("value", (snapshot: FirebaseDataSnapshot)=> {
				var Chores = snapshot.val();
				Object.keys(Chores).forEach(a=>{
					ret.push(Chores[a]);
				})
			}, 
			(errorObject) => {
				console.log("The read failed: " + errorObject.code);
			});
			
			return ret;
		}
	}
}