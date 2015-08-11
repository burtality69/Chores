;
///<reference path="../all.d.ts"/>
;
///<reference path="../all.d.ts"/>
///<reference path="../all.d.ts"/>
;
;
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Services;
    (function (Services) {
        var dateSvc = (function () {
            function dateSvc() {
                var d = new Date();
                var yyyy = d.getFullYear().toString();
                var mm = (d.getMonth() + 1).toString(); // getMonth() is zero-based
                var dd = d.getDate().toString();
                this._thisweek = yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]); // padding
            }
            Object.defineProperty(dateSvc.prototype, "thisWeek", {
                get: function () {
                    return this._thisweek;
                },
                enumerable: true,
                configurable: true
            });
            return dateSvc;
        })();
        Services.dateSvc = dateSvc;
    })(Services = Chores.Services || (Chores.Services = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Services;
    (function (Services) {
        var fireBaseSvc = (function () {
            function fireBaseSvc($q, dateSvc, $firebaseArray) {
                this.dateSvc = dateSvc;
                this.firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
                this.choresUrl = this.firebase.child("Chores");
                this.weekly = this.firebase.child("Weekly");
                this.$q = $q;
                this.firebaseArray = $firebaseArray;
            }
            /**Checks if the current week already exists, creates it if not - returns a promise */
            fireBaseSvc.prototype.checkWeek = function () {
                var _this = this;
                var weekdate = this.dateSvc.thisWeek;
                var exists = false;
                var p = this.$q.defer();
                //Short circuit here if value is found
                this.weekly.child(weekdate).once("value", function (data) {
                    if (data.val() !== null) {
                        _this.thisweeksChores = _this.weekly.child(weekdate);
                        p.resolve();
                    }
                    else {
                        _this.createWeek(weekdate).then(function () {
                            p.resolve(true);
                        }, function (error) {
                            throw new Error(error);
                        });
                    }
                });
                return p.promise;
            };
            /** Creates a master record for the week on firebase, returns a promise */
            fireBaseSvc.prototype.createWeek = function (weekdate) {
                var _this = this;
                var t = {};
                var weeklyChores = { chores: {}, Meta: { Completed: false, CompletedOn: 0, Paid: false } };
                var p = this.$q.defer();
                this.choresUrl.once("value", function (data) {
                    var t = data.val();
                    for (var p in t) {
                        var c = t[p];
                        c.completed = false;
                        weeklyChores.chores[p] = c;
                    }
                    _this.weekly.child(weekdate).set(weeklyChores);
                    _this.thisweeksChores = _this.weekly.child(weekdate);
                    p.resolve();
                });
                return p.promise;
            };
            fireBaseSvc.prototype.getChoreToDoList = function () {
                var _this = this;
                var p = this.$q.defer();
                this.checkWeek().then(function () {
                    var query = _this.thisweeksChores.child('chores').orderByChild('completed').equalTo(false);
                    var t = _this.firebaseArray(query);
                    p.resolve(t);
                });
                return p.promise;
            };
            fireBaseSvc.prototype.getChoresOverView = function () {
                var _this = this;
                var p = this.$q.defer();
                this.checkWeek().then(function () {
                    var t = _this.firebaseArray(_this.thisweeksChores);
                    p.resolve(t);
                });
                return p.promise;
            };
            fireBaseSvc.prototype.markweekComplete = function () {
            };
            fireBaseSvc.$inject = ['$q', 'dateSvc', '$firebaseArray'];
            return fireBaseSvc;
        })();
        Services.fireBaseSvc = fireBaseSvc;
    })(Services = Chores.Services || (Chores.Services = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Directives;
    (function (Directives) {
        function approvalList() {
            return {
                restrict: 'EA',
                templateUrl: './Templates/_ApprovalList.html',
                controller: Chores.Controllers.ApprovalListController,
                controllerAs: 'ApprovalCtrl',
                bindToController: true,
                replace: true
            };
        }
        Directives.approvalList = approvalList;
    })(Directives = Chores.Directives || (Chores.Directives = {}));
})(Chores || (Chores = {}));
var Chores;
(function (Chores) {
    var Controllers;
    (function (Controllers) {
        var ApprovalListController = (function () {
            function ApprovalListController(firebaseSvc, $firebaseArray) {
                var _this = this;
                firebaseSvc.getChoresOverView().then(function (p) {
                    _this.chorelist = p;
                });
            }
            ApprovalListController.prototype.approve = function () {
            };
            ApprovalListController.$inject = ['firebaseSvc', '$firebaseArray'];
            return ApprovalListController;
        })();
        Controllers.ApprovalListController = ApprovalListController;
    })(Controllers = Chores.Controllers || (Chores.Controllers = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Directives;
    (function (Directives) {
        function choreList() {
            return {
                restrict: 'EA',
                templateUrl: './Templates/_Chorelist.html',
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
            function chorelistController(fireBaseSvc) {
                var _this = this;
                this.firebaseSvc = fireBaseSvc;
                this.firebaseSvc.getChoreToDoList().then(function (p) {
                    _this.chorelist = p;
                });
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
                template: '<div ng-swipe-right="ChoreCtrl.complete()" class="card avatar lime accent-3">' +
                    '<div class="card-content">' +
                    '<img class="circle" ng-src="{{ChoreCtrl.imgSource}}"></img>' +
                    '<span class="card-title">{{ChoreCtrl.chore.Name}}</span>' +
                    '<p>{{ChoreCtrl.chore.Description}}</p>' +
                    '</div>' +
                    '</div>',
                link: function (scope, el, attr, ctrl) {
                    scope.ChoreCtrl.complete = function () {
                        scope.ChoreCtrl.chore.completed = true;
                        ctrl.chorelist.$save(scope.ChoreCtrl.chore);
                    };
                }
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
                this.imgSource = './Images/' + this.chore.Image + '.png';
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
    var app = angular.module('Chores', ['firebase', 'ngAnimate', 'ngTouch', 'ngRoute'])
        .service('dateSvc', Chores.Services.dateSvc)
        .service('firebaseSvc', Chores.Services.fireBaseSvc)
        .controller(Chores.Controllers)
        .directive(Chores.Directives);
    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $routeProvider.
                when('/History', {
                templateUrl: 'Templates/History.html',
            }).
                when('/Approve', {
                templateUrl: 'Templates/Approval.html',
            }).
                when('/', {
                templateUrl: 'Templates/Chorelist.html'
            }).
                otherwise({
                redirectTo: '/'
            });
            $locationProvider.html5Mode(true);
        }]);
})(Chores || (Chores = {}));
