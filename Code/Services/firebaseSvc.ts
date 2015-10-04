///<reference path="../../all.d.ts"/>

module Chores.Services {

	export class firebaseSvc {
		private _firebase: Firebase;
		private _choresUrl: Firebase;
		private _weekly: Firebase;
		private _meta: Firebase;
		private _users: Firebase;

		static $inject = ['$q', '$firebaseArray'];

		constructor(public $q: angular.IQService,
			public AngularFireArray: AngularFireArrayService) {

			this._firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
			this._choresUrl = this._firebase.child("Chores");
			this._weekly = this._firebase.child("Weekly");
			this._meta = this._firebase.child("Meta");
			this._users = this._firebase.child("Users");
		}

		get root() { return this._firebase; }

		get choresRoot() { return this._choresUrl; }

		get weeklyRoot() { return this._weekly; }

		get metaRoot() { return this._meta; }

		get usersRoot() { return this._users; }

	}
}