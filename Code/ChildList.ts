///<reference path="../all.d.ts"/>
/** returns the chorelist for a given week */
function getList(): ChoreTemplateList {
	var d: Date = new Date();
	var day = d.getDay();
	var diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
	var weekstart = new Date(d.setDate(diff)).toLocaleDateString();
	var t: ChoreTemplateList = {};
	var exists: boolean = false; 
	
	//Short circuit here if value is found
	weekly.child(weekstart).once("value",function(data: FirebaseDataSnapshot){
		exists = (data.val() !== null)
		if(exists) return data.val();
	})
	
	return createWeek(weekstart);
}

/**If the week in question doesn't already exist, create it and return it */
function createWeek(ID: string): ChoreList {
	var t: ChoreTemplateList = {};
	var weeklyChores: ChoreList = {};

	choresUrl.once("value", function parseChores(data) {
		t = data.val();
	})

	for (var p in t) {
		var c: Chore = <Chore>t[p];
		c.approved = false;
		c.completed = false;
		weeklyChores[p] = c;
	}
	weekly.child(ID).set(weeklyChores);
	return weeklyChores
}
