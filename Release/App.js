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
                var ret = [];
                this.choresUrl.on("value", function (snapshot) {
                    var Chores = snapshot.val();
                    Object.keys(Chores).forEach(function (a) {
                        ret.push(Chores[a]);
                    });
                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
                return ret;
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
                this.chorelist = firebaseSvc.getChoreList();
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
        function choreCard() {
            return {
                restrict: 'EA',
                require: '^choreList',
                //templateURL: './Templates/Chore.html',
                controller: Chores.Controllers.ChoreController,
                controllerAs: 'ChoreCtrl',
                bindToController: true,
                scope: { chore: '=' },
                replace: true,
                template: '<div class="card avatar">' +
                    '<img src="images/yuna.jpg" alt="" class="circle">' +
                    '<span class="title">Title</span>' +
                    '<p>{{ChoreCtrl.chore.name}}</p>' +
                    '<i class="material-icons dp48 secondary-content">done</i>' +
                    '</div>'
            };
        }
        Directives.choreCard = choreCard;
        ;
    })(Directives = Chores.Directives || (Chores.Directives = {}));
})(Chores || (Chores = {}));
var Chores;
(function (Chores) {
    var Controllers;
    (function (Controllers) {
        var ChoreController = (function () {
            function ChoreController() {
                console.log('Constructed a chore');
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
