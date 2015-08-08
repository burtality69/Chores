
var ChoreKeys: Array<string> = ["Name","Description","Frequency"]; 

var firebase: Firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
var choresUrl: Firebase = firebase.child("Chores");

var date: Date = new Date();
var Chores: ChoreList = {}; 

function choreTable(c: ChoreList, target?: HTMLElement): void {
	
	var container: HTMLTableElement = <HTMLTableElement> document.querySelector("#chorelistcontainer");
	var list: HTMLUListElement = <HTMLUListElement> document.querySelector("#chorelist"); 
	while (list.firstChild) {
		list.removeChild(list.firstChild)
	}
	
	var headerrow: HTMLLIElement = document.createElement("li");
	headerrow.innerHTML = "Chores"; 
	headerrow.classList.add("listheader")
	list.appendChild(headerrow); 
	
 	Object.keys(c).forEach(function(row){
		var li: HTMLLIElement = document.createElement("li");
		var thisrow = c[row];
		ChoreKeys.map(function(p){
			var d: HTMLDivElement = document.createElement("div");
			d.innerText = thisrow[p];
			if (p == "Name") {d.classList.add("lititle")}
			li.appendChild(d);
		})
		var controls: HTMLDivElement = document.createElement("div");
			var del: HTMLPhraseElement = document.createElement("i");
			var edit: HTMLPhraseElement = document.createElement("i");
			del.classList.add("fa");
			del.classList.add("fa-times");
			edit.classList.add("fa-pencil-square-o");
			controls.appendChild(del); 
			controls.appendChild(edit);
			controls.classList.add("chorecontrols");
		li.appendChild(controls);
		list.appendChild(li);	
	
	});	
	
}

function run() {
	choresUrl.on("value", function(snapshot: FirebaseDataSnapshot) {
		Chores = snapshot.val();
		choreTable(Chores);
	}, function(errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
	
	var newChoreForm: HTMLFormElement = <HTMLFormElement> document.querySelector("#newChoreForm");
	
	newChoreForm.addEventListener("submit", function() {
		var f = newChoreForm; 
		var c: ChoreTemplate = {
			Description: f.elements["desc"].value,
			Frequency: f.elements["freq"].value,
			Name: f.elements["name"].value
			}
		choresUrl.child(f.elements["name"].value).set(c);	
	})
	getList(); 
}

document.addEventListener('DOMContentLoaded', run, false);