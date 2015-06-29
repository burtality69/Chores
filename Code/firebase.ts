///<reference path="../typings/firebase.d.ts"/>

var firebase: Firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
var choresUrl: Firebase = firebase.child("Chores");
var weekly: Firebase = firebase.child("weekly");