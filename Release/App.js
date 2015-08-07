;
///<reference path="../all.d.ts"/>
;
///<reference path="../all.d.ts"/>
///<reference path="../all.d.ts"/>
;
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores_1) {
    var Services;
    (function (Services) {
        var fireBaseSvc = (function () {
            function fireBaseSvc() {
                this.firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
                this.choresUrl = this.firebase.child("Chores");
                this.weekly = this.firebase.child("weekly");
            }
            fireBaseSvc.prototype.getChoreList = function () {
                this.choresUrl.on("value", function (snapshot) {
                    var Chores = snapshot.val();
                    console.log('got some sweet chores');
                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
            };
            return fireBaseSvc;
        })();
        Services.fireBaseSvc = fireBaseSvc;
    })(Services = Chores_1.Services || (Chores_1.Services = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Directives;
    (function (Directives) {
        function choreList() {
            return {
                restrict: 'EA',
                templateUrl: './Templates/Chorelist.html',
                bindToController: true,
                controller: Chores.Controllers.chorelistController,
                controllerAs: 'ChoreListCtrl',
                replace: true
            };
        }
        Directives.choreList = choreList;
    })(Directives = Chores.Directives || (Chores.Directives = {}));
})(Chores || (Chores = {}));
var Chores;
(function (Chores) {
    var Controllers;
    (function (Controllers) {
        var chorelistController = (function () {
            function chorelistController(firebaseSvc) {
                firebaseSvc.getChoreList();
                this.chorelist = [
                    { Description: 'Butt', Frequency: 'Weekly', Name: 'Poop', completed: false, approved: false }
                ];
            }
            chorelistController.$inject = ['firebaseSvc'];
            return chorelistController;
        })();
        Controllers.chorelistController = chorelistController;
    })(Controllers = Chores.Controllers || (Chores.Controllers = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Directives;
    (function (Directives) {
        function chore() {
            return {
                restrict: 'EA',
                require: '^choreList',
                templateURL: './Templates/Chore.html',
                controller: Chores.Controllers.ChoreController,
                controllerAs: 'ChoreCtrl',
                bindToController: true,
                scope: { chore: '=' },
                replace: true,
            };
        }
        Directives.chore = chore;
    })(Directives = Chores.Directives || (Chores.Directives = {}));
})(Chores || (Chores = {}));
var Chores;
(function (Chores) {
    var Controllers;
    (function (Controllers) {
        var ChoreController = (function () {
            function ChoreController() {
            }
            ChoreController.$inject = ['firebaseSvc'];
            return ChoreController;
        })();
        Controllers.ChoreController = ChoreController;
    })(Controllers = Chores.Controllers || (Chores.Controllers = {}));
})(Chores || (Chores = {}));
///<reference path="../all.d.ts"/>
var Chores;
(function (Chores) {
    var app = angular.module('Chores', [])
        .service('firebaseSvc', Chores.Services.fireBaseSvc)
        .controller(Chores.Controllers)
        .directive(Chores.Directives);
})(Chores || (Chores = {}));
