///<reference path="../../all.d.ts"/>

namespace Chores.Services {
	
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
			this.choresUrl.on("value", function(snapshot: FirebaseDataSnapshot) {
				var Chores = snapshot.val();
				console.log('got some sweet chores')
			}, (errorObject) => {
				console.log("The read failed: " + errorObject.code);
			});
		}
	}
}