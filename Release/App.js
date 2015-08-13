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
        /** Contains date utilities commonly used across the app */
        var dateSvc = (function () {
            function dateSvc() {
                var d = new Date();
                //var yyyy = d.getFullYear().toString();
                //var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
                //var day = d.getDay();
                var diff = d.getDate() - d.getDay() + (d.getDay() == 0 ? -6 : 1); // adjust when day is sunday
                d.setDate(diff);
                //var dd = d.getDate().toString(); 
                this.startdate = d;
                this._thisweek = this.dateToString(d); // padding
            }
            Object.defineProperty(dateSvc.prototype, "thisWeek", {
                get: function () {
                    return this._thisweek;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(dateSvc.prototype, "weekDates", {
                get: function () {
                    var d = this.startdate;
                    var ret = [d.getTime()];
                    var i = 0;
                    while (i < 7) {
                        var p = new Date(d.setDate(d.getDate() + 1));
                        ret.push(p.getTime());
                        i++;
                    }
                    return ret;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(dateSvc.prototype, "today", {
                get: function () {
                    return new Date().getTime();
                },
                enumerable: true,
                configurable: true
            });
            /**Converts a data to a string in MMDDYYYY */
            dateSvc.prototype.dateToString = function (d) {
                var yyyy = d.getFullYear().toString();
                var mm = (d.getMonth() + 1).toString(); // getMonth() is zero-based
                var dd = d.getDate().toString();
                return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]);
            };
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
            /**Checks if the current week already exists, if not, it creates it via createWeek */
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
            /** Creates a master record for the week on firebase */
            fireBaseSvc.prototype.createWeek = function (weekdate) {
                var _this = this;
                var t = {};
                var weeklyChores = { chores: [], Meta: { Completed: false, CompletedOn: 0, Paid: false } };
                var p = this.$q.defer();
                this.buildChoreList().then(function (data) {
                    weeklyChores.chores = data;
                    _this.weekly.child(weekdate).set(weeklyChores);
                    _this.thisweeksChores = _this.weekly.child(weekdate);
                    p.resolve();
                });
                return p.promise;
            };
            /** Gets a to-do list for the chore-doer */
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
            /** Gets progress for this weeks chore (chore master view) */
            fireBaseSvc.prototype.getChoresOverView = function () {
                var _this = this;
                var p = this.$q.defer();
                this.checkWeek().then(function () {
                    _this.thisweeksChores.once('value', function (d) {
                        p.resolve(d.val());
                    });
                });
                return p.promise;
            };
            /** Gets the master template list */
            fireBaseSvc.prototype.getChoreTemplates = function () {
                var p = this.$q.defer();
                this.choresUrl.once('value', function (d) {
                    p.resolve(d.val());
                });
                return p.promise;
            };
            /** Builds a list of due chores for current week from templates */
            fireBaseSvc.prototype.buildChoreList = function () {
                var p = this.$q.defer();
                var ret = [];
                var schedule = {};
                var dates = this.dateSvc.weekDates;
                this.getChoreTemplates().then(function (data) {
                    Object.keys(data).forEach(function (d) {
                        var chore = data[d];
                        chore.Schedule.forEach(function (p, i) {
                            if (p) {
                                var b = {
                                    Name: chore.Name,
                                    Description: chore.Description,
                                    Due: dates[i],
                                    completed: false,
                                    approved: false
                                };
                                ret.push(b);
                            }
                        });
                    });
                    p.resolve(ret);
                });
                return p.promise;
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
        function choreTemplateList() {
            return {
                restrict: 'E',
                controller: Chores.Controllers.ChoreTemplateListCtrl,
                controllerAs: 'CTListCtrl',
                templateUrl: './Templates/_ChoreTemplateList.html',
                bindToController: true
            };
        }
        Directives.choreTemplateList = choreTemplateList;
    })(Directives = Chores.Directives || (Chores.Directives = {}));
})(Chores || (Chores = {}));
var Chores;
(function (Chores) {
    var Controllers;
    (function (Controllers) {
        var ChoreTemplateListCtrl = (function () {
            function ChoreTemplateListCtrl(firebaseSvc) {
                this.firebaseSvc = firebaseSvc;
                this.load();
            }
            ChoreTemplateListCtrl.prototype.save = function () {
                var _this = this;
                this.firebaseSvc.choresUrl.set(this.choretemplates, function (e) {
                    if (e) {
                        console.log('There was a problem saving');
                    }
                    else {
                        console.log('saved successfully');
                        _this.load();
                    }
                });
            };
            ChoreTemplateListCtrl.prototype.load = function () {
                var _this = this;
                this.firebaseSvc.getChoreTemplates().then(function (data) {
                    _this.choretemplates = data;
                });
            };
            return ChoreTemplateListCtrl;
        })();
        Controllers.ChoreTemplateListCtrl = ChoreTemplateListCtrl;
    })(Controllers = Chores.Controllers || (Chores.Controllers = {}));
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
            function ApprovalListController(firebaseSvc) {
                var _this = this;
                this.firebaseSvc = firebaseSvc;
                this.firebaseSvc.getChoresOverView().then(function (p) {
                    _this.chorelist = p;
                });
            }
            ApprovalListController.prototype.approve = function () {
                console.log('approving..');
                this.firebaseSvc.thisweeksChores.child('Meta').child('Completed').set(true);
                this.firebaseSvc.thisweeksChores.child('Meta').child('CompletedOn').set(new Date());
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
            function chorelistController(fireBaseSvc, dateSvc) {
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
                templateUrl: './Templates/_Chore.html',
                controller: Chores.Controllers.ChoreController,
                controllerAs: 'ChoreCtrl',
                bindToController: true,
                scope: { chore: '=' },
                replace: true,
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
                resolve: {}
            }).
                when('/Approve', {
                templateUrl: 'Templates/Approval.html',
                resolve: {}
            }).
                when('/Settings', {
                templateUrl: 'Templates/Settings.html',
                resolve: {}
            }).
                when('/', {
                templateUrl: 'Templates/Chorelist.html',
                resolve: {}
            }).
                otherwise({
                redirectTo: '/'
            });
            $locationProvider.html5Mode(true);
        }]);
})(Chores || (Chores = {}));
