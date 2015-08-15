;
///<reference path="../all.d.ts"/>
;
///<reference path="../all.d.ts"/>
///<reference path="../all.d.ts"/>
;
;
///<reference path="../all.d.ts"/>
;
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Services;
    (function (Services) {
        var sessionStorageSvc = (function () {
            function sessionStorageSvc($window) {
                this.$window = $window;
            }
            sessionStorageSvc.prototype.put = function (key, value) {
                this.$window.sessionStorage.setItem(key, value);
            };
            sessionStorageSvc.prototype.get = function (key) {
                return this.$window.sessionStorage.getItem(key);
            };
            sessionStorageSvc.prototype.delete = function (key) {
                this.$window.sessionStorage.removeItem(key);
            };
            return sessionStorageSvc;
        })();
        Services.sessionStorageSvc = sessionStorageSvc;
    })(Services = Chores.Services || (Chores.Services = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Services;
    (function (Services) {
        var sessionSvc = (function () {
            function sessionSvc($cookies, fireBaseSvc, $q, sessionStorageSvc) {
                this.$cookies = $cookies;
                this.fireBaseSvc = fireBaseSvc;
                this.$q = $q;
                this.sessionStorageSvc = sessionStorageSvc;
            }
            sessionSvc.prototype.logIn = function (credentials) {
                var _this = this;
                var p = this.$q.defer();
                this.fireBaseSvc.firebase.authWithPassword(credentials, function (e, a) {
                    if (e) {
                        p.reject(e);
                    }
                    _this.$cookies.put('Authtoken', a.token);
                    _this.fireBaseSvc.getUserProfile(a.uid).then(function (profile) {
                        _this._profile = profile;
                        _this.sessionStorageSvc.put('Profile', JSON.stringify(profile));
                        p.resolve(a);
                    });
                });
                return p.promise;
            };
            sessionSvc.prototype.logOut = function () {
                this.$cookies.remove('Authtoken');
                this.sessionStorageSvc.delete('Profile');
            };
            Object.defineProperty(sessionSvc.prototype, "Profile", {
                get: function () {
                    if (!this._profile) {
                        return JSON.parse(this.sessionStorageSvc.get('Profile'));
                    }
                    return this._profile;
                },
                set: function (p) {
                    this._profile = p;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(sessionSvc.prototype, "userLoggedIn", {
                get: function () {
                    return this.$cookies.get('Authtoken') != undefined;
                },
                enumerable: true,
                configurable: true
            });
            sessionSvc.$inject = ['$cookies', 'firebaseSvc', '$q', 'sessionStorageSvc'];
            return sessionSvc;
        })();
        Services.sessionSvc = sessionSvc;
    })(Services = Chores.Services || (Chores.Services = {}));
})(Chores || (Chores = {}));
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
                this.weekstartDate = d;
                this._weekstart = d.getTime();
                this._thisweek = this.dateToString(d); // padding
            }
            Object.defineProperty(dateSvc.prototype, "thisWeek", {
                /**Returns the first day of the week in DDMMYYY */
                get: function () {
                    return this._thisweek;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(dateSvc.prototype, "weekDates", {
                /**Returns an array of timestamps representing each day of the week at midnight */
                get: function () {
                    var d = this.weekstartDate;
                    var ret = [d.getTime()];
                    var i = 0;
                    //Create an array of dates for this week all midnight
                    while (i < 7) {
                        var p = new Date(d.setDate(d.getDate() + 1));
                        p.setHours(0, 0, 0, 0);
                        ret.push(p.getTime());
                        i++;
                    }
                    return ret;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(dateSvc.prototype, "today", {
                /**Returns today at 23:59:59 in timestamp, used to filter 'Due' */
                get: function () {
                    var d = new Date();
                    d.setHours(23, 59, 59, 9999);
                    return d.getTime();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(dateSvc.prototype, "weekStart", {
                /**Returns the start of the week in timestamp form */
                get: function () {
                    return this._weekstart;
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
            function fireBaseSvc($q, dateSvc, AngularFireArray) {
                this.$q = $q;
                this.dateSvc = dateSvc;
                this.AngularFireArray = AngularFireArray;
                this.firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
                this.choresUrl = this.firebase.child("Chores");
                this.weekly = this.firebase.child("Weekly");
                this.meta = this.firebase.child("Meta");
                this.weekdate = dateSvc.thisWeek;
            }
            /**Checks if the current week already exists, if not, it creates it via createWeek */
            fireBaseSvc.prototype.checkWeek = function () {
                var _this = this;
                var exists = false;
                var p = this.$q.defer();
                //Short circuit here if value is found
                this.weekly.child(this.weekdate).once("value", function (data) {
                    if (data.val() !== null) {
                        p.resolve();
                    }
                    else {
                        _this.createWeek(_this.weekdate).then(function () {
                            p.resolve(true);
                        }, function (error) {
                            throw new Error(error);
                        });
                    }
                });
                return p.promise;
            };
            /** Returns the meta for each available week of chores */
            fireBaseSvc.prototype.getChoreHistory = function () {
                var p = this.$q.defer();
                this.firebase.child('Meta').once('value', function (data) {
                    p.resolve(data.val());
                });
                return p.promise;
            };
            /** Returns the profile of a user by UID - for execution after authorisatin */
            fireBaseSvc.prototype.getUserProfile = function (UID) {
                var p = this.$q.defer();
                this.firebase.child('Users').child(UID).once('value', function (d) {
                    p.resolve(d.val());
                });
                return p.promise;
            };
            /** Gets a to-do list for the chore-doer */
            fireBaseSvc.prototype.getChoreToDoList = function () {
                var _this = this;
                var p = this.$q.defer();
                var start = this.dateSvc.weekStart;
                var end = this.dateSvc.today;
                this.checkWeek().then(function () {
                    var query = _this.firebase.child('Weekly').child(_this.weekdate).orderByChild('completed').equalTo(false);
                    p.resolve(_this.AngularFireArray(query));
                });
                return p.promise;
            };
            fireBaseSvc.prototype.approveWeek = function () {
                var now = new Date().getTime();
                this.firebase.child('Meta').child(this.weekdate).update({ Completed: true, CompletedOn: now });
            };
            /** Creates a master record for the week on firebase */
            fireBaseSvc.prototype.createWeek = function (weekdate) {
                var _this = this;
                var t = {};
                var weeklyMeta = { Completed: false, CompletedOn: 0, Paid: false };
                var p = this.$q.defer();
                this.buildChoreList().then(function (data) {
                    _this.meta.child(_this.weekdate).set(weeklyMeta);
                    _this.weekly.child(weekdate).set(data);
                    p.resolve();
                });
                return p.promise;
            };
            /** Gets progress for this weeks chore (chore master view) */
            fireBaseSvc.prototype.getChoresOverView = function () {
                var _this = this;
                var p = this.$q.defer();
                this.checkWeek().then(function () {
                    _this.firebase.child('Weekly').child(_this.weekdate).once('value', function (d) {
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
                                    imgSource: chore.Image,
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
    var Controllers;
    (function (Controllers) {
        var AppController = (function () {
            function AppController(ModalService, sessionSvc, $rootScope) {
                this.ModalService = ModalService;
                this.sessionSvc = sessionSvc;
                this.$rootScope = $rootScope;
            }
            AppController.prototype.logIn = function () {
                this.ModalService.showModal({
                    controller: 'LoginModalCtrl',
                    templateUrl: './Views/Templates/LoginRegister.htm'
                }).then(function (modal) {
                    modal.close.then(function (a) {
                        console.log('Modal closed');
                    });
                });
            };
            AppController.prototype.logOut = function () {
                this.sessionSvc.logOut();
            };
            Object.defineProperty(AppController.prototype, "loggedIn", {
                get: function () {
                    return this.sessionSvc.userLoggedIn;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppController.prototype, "user", {
                get: function () {
                    return this.sessionSvc.Profile;
                },
                enumerable: true,
                configurable: true
            });
            AppController.$inject = ['ModalService', 'sessionSvc', '$rootScope'];
            return AppController;
        })();
        Controllers.AppController = AppController;
    })(Controllers = Chores.Controllers || (Chores.Controllers = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>"
;
var Chores;
(function (Chores) {
    var Controllers;
    (function (Controllers) {
        var LoginModalCtrl = (function () {
            function LoginModalCtrl($scope, close, sessionSvc) {
                var _this = this;
                this.sessionSvc = sessionSvc;
                $scope.LoginModalCtrl = this;
                this.display = true;
                this.loginForm = { email: '', password: '' };
                this.close = function () {
                    _this.display = false;
                    close();
                };
            }
            LoginModalCtrl.prototype.logIn = function () {
                var _this = this;
                this.sessionSvc.logIn(this.loginForm).then(function (a) {
                    _this.close();
                }).catch(function (e) {
                    _this.error = e.message;
                });
            };
            LoginModalCtrl.prototype.cancel = function () {
                this.close();
            };
            LoginModalCtrl.$inject = ['$scope', 'close', 'sessionSvc'];
            return LoginModalCtrl;
        })();
        Controllers.LoginModalCtrl = LoginModalCtrl;
    })(Controllers = Chores.Controllers || (Chores.Controllers = {}));
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
                templateUrl: './Views/Templates/ChoreTemplateList.html',
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
                templateUrl: './Views/Templates/ApprovalList.html',
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
                this.firebaseSvc.approveWeek();
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
                templateUrl: './Views/Templates/ChoreList.htm',
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
                    p.$loaded().then(function (d) {
                        _this.chorelist = d;
                    });
                });
                this.filterDate = dateSvc.today;
            }
            chorelistController.$inject = ['firebaseSvc', 'dateSvc'];
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
                templateUrl: './Views/Templates/ChoreCard.htm',
                controller: Chores.Controllers.ChoreController,
                //controllerAs: 'ChoreCtrl',
                bindToController: true,
                scope: false,
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
            function ChoreController($scope) {
                $scope.ChoreCtrl = this;
                this.chore = $scope.chore;
                this.imgSource = './Images/' + this.chore.Image + '.png';
            }
            ChoreController.$inject = ['$scope'];
            return ChoreController;
        })();
        Controllers.ChoreController = ChoreController;
    })(Controllers = Chores.Controllers || (Chores.Controllers = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Directives;
    (function (Directives) {
        function choreHistoryList() {
            return {
                restrict: 'E',
                controller: Chores.Controllers.ChoreHistoryCtrl,
                controlleras: 'HistoryCtrl',
                bindToController: true,
                replace: true,
                templateUrl: '/Views/Templates/ChoreHistoryList.htm'
            };
        }
        Directives.choreHistoryList = choreHistoryList;
    })(Directives = Chores.Directives || (Chores.Directives = {}));
})(Chores || (Chores = {}));
var Chores;
(function (Chores) {
    var Controllers;
    (function (Controllers) {
        var ChoreHistoryCtrl = (function () {
            function ChoreHistoryCtrl($scope, firebaseSvc) {
                var _this = this;
                this.firebaseSvc = firebaseSvc;
                $scope.ChoreHistoryCtrl = this;
                this.firebaseSvc.getChoreHistory().then(function (d) {
                    _this.historyList = d;
                });
            }
            ChoreHistoryCtrl.$inject = ['$scope', 'firebaseSvc'];
            return ChoreHistoryCtrl;
        })();
        Controllers.ChoreHistoryCtrl = ChoreHistoryCtrl;
    })(Controllers = Chores.Controllers || (Chores.Controllers = {}));
})(Chores || (Chores = {}));
///<reference path="../all.d.ts"/>
var Chores;
(function (Chores) {
    var app = angular.module('Chores', ['firebase', 'ngAnimate', 'ngTouch', 'ngRoute', , 'ngCookies', 'angularModalService'])
        .service('dateSvc', Chores.Services.dateSvc)
        .service('firebaseSvc', Chores.Services.fireBaseSvc)
        .service('sessionStorageSvc', Chores.Services.sessionStorageSvc)
        .service('sessionSvc', Chores.Services.sessionSvc)
        .controller(Chores.Controllers)
        .directive(Chores.Directives);
    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $routeProvider.
                when('/History', {
                templateUrl: 'Views/History.html',
                resolve: {}
            }).
                when('/Approve', {
                templateUrl: 'Views/Approval.html',
                resolve: {}
            }).
                when('/Settings', {
                templateUrl: 'Views/Settings.html',
                resolve: {}
            }).
                when('/', {
                templateUrl: 'Views/Chorelist.html',
                resolve: {}
            }).
                otherwise({
                redirectTo: '/'
            });
            $locationProvider.html5Mode(true);
        }]);
})(Chores || (Chores = {}));
