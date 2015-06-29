;
///<reference path="../all.d.ts"/>
;
///<reference path="../all.d.ts"/>
///<reference path="../all.d.ts"/>
;
///<reference path="../typings/firebase.d.ts"/>
var firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
var choresUrl = firebase.child("Chores");
var weekly = firebase.child("weekly");
///<reference path="../all.d.ts"/>
/** returns the chorelist for a given week */
function getList() {
    var d = new Date();
    var day = d.getDay();
    var diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    var weekstart = new Date(d.setDate(diff)).toLocaleDateString();
    var t = {};
    var exists = false;
    //Short circuit here if value is found
    weekly.child(weekstart).once("value", function (data) {
        exists = (data.val() !== null);
        if (exists)
            return data.val();
    });
    return createWeek(weekstart);
}
/**If the week in question doesn't already exist, create it and return it */
function createWeek(ID) {
    var t = {};
    var weeklyChores = {};
    choresUrl.once("value", function parseChores(data) {
        t = data.val();
    });
    for (var p in t) {
        var c = t[p];
        c.approved = false;
        c.completed = false;
        weeklyChores[p] = c;
    }
    weekly.child(ID).set(weeklyChores);
    return weeklyChores;
}
///<reference path="../all.d.ts"/>
var ChoreKeys = ["Name", "Description", "Frequency"];
var firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
var choresUrl = firebase.child("Chores");
var date = new Date();
var Chores = {};
function choreTable(c, target) {
    var container = document.querySelector("#chorelistcontainer");
    var list = document.querySelector("#chorelist");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    var headerrow = document.createElement("li");
    headerrow.innerHTML = "Chores";
    headerrow.classList.add("listheader");
    list.appendChild(headerrow);
    Object.keys(c).forEach(function (row) {
        var li = document.createElement("li");
        var thisrow = c[row];
        ChoreKeys.map(function (p) {
            var d = document.createElement("div");
            d.innerText = thisrow[p];
            if (p == "Name") {
                d.classList.add("lititle");
            }
            li.appendChild(d);
        });
        var controls = document.createElement("div");
        var del = document.createElement("i");
        var edit = document.createElement("i");
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
    choresUrl.on("value", function (snapshot) {
        Chores = snapshot.val();
        choreTable(Chores);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    var newChoreForm = document.querySelector("#newChoreForm");
    newChoreForm.addEventListener("submit", function () {
        var f = newChoreForm;
        var c = {
            Description: f.elements["desc"].value,
            Frequency: f.elements["freq"].value,
            Name: f.elements["name"].value
        };
        choresUrl.child(f.elements["name"].value).set(c);
    });
    getList();
}
document.addEventListener('DOMContentLoaded', run, false);
