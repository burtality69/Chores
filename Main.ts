///<reference path="./typings/firebase.d.ts"/>
interface Chore {Name: string,Description: string,Frequency: string};
interface ChoreList {[id: number]: Chore};
	
var firebase: Firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
var choresUrl: Firebase = firebase.child("Chores");
var date: Date = new Date();

var Chores: ChoreList = {}; 

function run(): void {choreTable(Chores);}

choresUrl.on("value", function(snapshot: FirebaseDataSnapshot) {
  Chores = snapshot.val();
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

function choreTable(c: ChoreList): void {
	var table: HTMLTableElement = <HTMLTableElement>document.querySelector("#chorelist");
	var headerrow: HTMLTableRowElement = document.createElement("tr");
	
	Object.keys(c[0]).forEach(function(p) {
		var thel: HTMLTableHeaderCellElement = document.createElement("th");
		thel.innerText = p;
		headerrow.appendChild(thel);
	})
	
	table.appendChild(headerrow); 
	
 	Object.keys(c).forEach(function(k){
		var tr: HTMLTableRowElement = document.createElement("tr");
		Object.keys(c[k]).map(function(p){
			var td: HTMLTableDataCellElement = document.createElement("td");
			td.innerText = c[k][p];
			tr.appendChild(td);
		})
		
		table.appendChild(tr);	
	
	});	
	
}

document.addEventListener('DOMContentLoaded', run, false);