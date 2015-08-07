;
///<reference path="../all.d.ts"/>
;
///<reference path="../all.d.ts"/>
///<reference path="../all.d.ts"/>
;
///<reference path="../all.d.ts"/>
var Chores;
(function (Chores) {
    var app = angular.module('Chores', [])
        .service('firebaseSvc', Chores.Services.fireBaseSvc)
        .controller(Chores.Controllers)
        .directive(Chores.Directives);
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Directives;
    (function (Directives) {
        function chorelist() {
            return {
                templateUrl: './Templates/Chorelist.html'
            };
        }
        Directives.chorelist = chorelist;
    })(Directives = Chores.Directives || (Chores.Directives = {}));
})(Chores || (Chores = {}));
var Chores;
(function (Chores) {
    var Controllers;
    (function (Controllers) {
        var chorelistController = (function () {
            function chorelistController() {
            }
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
        function Chore() {
            return {
                templateURL: '',
                controller: Chores.Controllers.ChoreController,
                scope: { Chore: '=' }
            };
        }
        Directives.Chore = Chore;
    })(Directives = Chores.Directives || (Chores.Directives = {}));
})(Chores || (Chores = {}));
var Chores;
(function (Chores) {
    var Controllers;
    (function (Controllers) {
        var ChoreController = (function () {
            function ChoreController(firebaseSvc) {
            }
            ChoreController.$inject = ['firebaseSvc'];
            return ChoreController;
        })();
        Controllers.ChoreController = ChoreController;
    })(Controllers = Chores.Controllers || (Chores.Controllers = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Services;
    (function (Services) {
        var fireBaseSvc = (function () {
            function fireBaseSvc() {
                this.firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
                this.choresUrl = this.firebase.child("Chores");
                this.weekly = this.firebase.child("weekly");
            }
            return fireBaseSvc;
        })();
        Services.fireBaseSvc = fireBaseSvc;
    })(Services = Chores.Services || (Chores.Services = {}));
})(Chores || (Chores = {}));
