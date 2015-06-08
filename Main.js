///<reference path="./typings/firebase.d.ts"/>
;
;
var firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
var choresUrl = firebase.child("Chores");
var date = new Date();
var Chores = {};
function run() { choreTable(Chores); }
choresUrl.on("value", function (snapshot) {
    Chores = snapshot.val();
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
function choreTable(c) {
    var table = document.querySelector("#chorelist");
    var headerrow = document.createElement("tr");
    Object.keys(c[0]).forEach(function (p) {
        var thel = document.createElement("th");
        thel.innerText = p;
        headerrow.appendChild(thel);
    });
    table.appendChild(headerrow);
    Object.keys(c).forEach(function (k) {
        var tr = document.createElement("tr");
        Object.keys(c[k]).map(function (p) {
            var td = document.createElement("td");
            td.innerText = c[k][p];
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}
document.addEventListener('DOMContentLoaded', run, false);
