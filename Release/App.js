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
            function sessionSvc($cookies, fireBaseSvc, userProfileSvc, $q) {
                this.$cookies = $cookies;
                this.fireBaseSvc = fireBaseSvc;
                this.userProfileSvc = userProfileSvc;
                this.$q = $q;
            }
            sessionSvc.prototype.logIn = function (credentials) {
                var _this = this;
                var p = this.$q.defer();
                this.fireBaseSvc.root.authWithPassword(credentials, function (e, a) {
                    if (e) {
                        p.reject(e);
                    }
                    _this.$cookies.put('Authtoken', a.token);
                    _this.userProfileSvc.loadUserProfile(a.uid).then(function (profile) {
                        p.resolve(a);
                    });
                });
                return p.promise;
            };
            sessionSvc.prototype.logOut = function () {
                this.$cookies.remove('Authtoken');
                this.userProfileSvc.purgeProfile();
            };
            Object.defineProperty(sessionSvc.prototype, "userLoggedIn", {
                get: function () {
                    return this.$cookies.get('Authtoken') != undefined;
                },
                enumerable: true,
                configurable: true
            });
            sessionSvc.$inject = ['$cookies', 'firebaseSvc', 'userProfileSvc', '$q'];
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
                var diff = d.getDate() - d.getDay() + (d.getDay() == 0 ? -6 : 1); // adjust when day is sunday
                d.setDate(diff);
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
            Object.defineProperty(dateSvc.prototype, "weekStartString", {
                get: function () {
                    return this._weekstart.toString();
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
        var firebaseSvc = (function () {
            function firebaseSvc($q, dateSvc, AngularFireArray) {
                this.$q = $q;
                this.dateSvc = dateSvc;
                this.AngularFireArray = AngularFireArray;
                this._firebase = new Firebase("https://shining-torch-394.firebaseio.com/");
                this._choresUrl = this._firebase.child("Chores");
                this._weekly = this._firebase.child("Weekly");
                this._meta = this._firebase.child("Meta");
                this._users = this._firebase.child("Users");
            }
            Object.defineProperty(firebaseSvc.prototype, "root", {
                get: function () { return this._firebase; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(firebaseSvc.prototype, "choresRoot", {
                get: function () { return this._choresUrl; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(firebaseSvc.prototype, "weeklyRoot", {
                get: function () { return this._weekly; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(firebaseSvc.prototype, "metaRoot", {
                get: function () { return this._meta; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(firebaseSvc.prototype, "usersRoot", {
                get: function () { return this._users; },
                enumerable: true,
                configurable: true
            });
            firebaseSvc.$inject = ['$q', 'dateSvc', '$firebaseArray'];
            return firebaseSvc;
        })();
        Services.firebaseSvc = firebaseSvc;
    })(Services = Chores.Services || (Chores.Services = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Services;
    (function (Services) {
        var choresDataSvc = (function () {
            function choresDataSvc(fb, dateSvc, $q) {
                this.fb = fb;
                this.dateSvc = dateSvc;
                this.$q = $q;
            }
            /**Checks if the current week already exists, if not, it creates it via createWeek */
            choresDataSvc.prototype.checkWeek = function () {
                var _this = this;
                var date = this.dateSvc.thisWeek;
                var exists = false;
                var p = this.$q.defer();
                //Short circuit here if value is found
                this.fb.weeklyRoot.child(date).once("value", function (data) {
                    if (data.val() !== null) {
                        p.resolve();
                    }
                    else {
                        _this.createWeek(date).then(function () {
                            p.resolve(true);
                        }, function (error) {
                            throw new Error(error);
                        });
                    }
                });
                return p.promise;
            };
            /** Returns the meta for each available week of chores */
            choresDataSvc.prototype.getChoreHistory = function () {
                var p = this.$q.defer();
                this.fb.metaRoot.once('value', function (data) {
                    p.resolve(data.val());
                });
                return p.promise;
            };
            choresDataSvc.prototype.addChore = function (c) {
                var p = this.$q.defer();
                this.fb.choresRoot.push(c, function (e) {
                    if (e) {
                        p.reject(e);
                    }
                    else {
                        p.resolve();
                    }
                });
                return p.promise;
            };
            /** Gets a to-do list for the chore-doer - angularFireArray*/
            choresDataSvc.prototype.getChoreToDoList = function () {
                var _this = this;
                var p = this.$q.defer();
                var start = this.dateSvc.weekStart;
                var end = this.dateSvc.today;
                this.checkWeek().then(function () {
                    var query = _this.fb.weeklyRoot.child(_this.dateSvc.thisWeek).orderByChild('completed').equalTo(false);
                    p.resolve(_this.fb.AngularFireArray(query));
                });
                return p.promise;
            };
            /** Approve a completed week's chores */
            choresDataSvc.prototype.approveWeek = function () {
                var now = this.dateSvc.dateToString(new Date());
                this.fb.metaRoot.child(this.dateSvc.thisWeek).update({ Completed: true, CompletedOn: now });
            };
            /** Creates a master record for the week on firebase */
            choresDataSvc.prototype.createWeek = function (weekdate) {
                var _this = this;
                var t = {};
                var weeklyMeta = { Completed: false, CompletedOn: 0, Paid: false };
                var p = this.$q.defer();
                this.buildChoreList().then(function (data) {
                    _this.fb.metaRoot.child(_this.dateSvc.thisWeek).set(weeklyMeta);
                    _this.fb.weeklyRoot.child(weekdate).set(data);
                    p.resolve();
                });
                return p.promise;
            };
            /** Gets progress for this weeks chore (chore master view) */
            choresDataSvc.prototype.getChoresOverView = function () {
                var _this = this;
                var p = this.$q.defer();
                this.checkWeek().then(function () {
                    _this.fb.weeklyRoot.child(_this.dateSvc.thisWeek).once('value', function (d) {
                        p.resolve(d.val());
                    });
                });
                return p.promise;
            };
            /** Gets the master template list */
            choresDataSvc.prototype.getChoreTemplates = function () {
                var p = this.$q.defer();
                this.fb.choresRoot.once('value', function (d) {
                    p.resolve(d.val());
                });
                return p.promise;
            };
            choresDataSvc.prototype.setChoreTemplates = function (list) {
                var p = this.$q.defer();
                this.fb.choresRoot.set(list, function (e) {
                    if (e) {
                        p.reject(e);
                    }
                    else {
                        p.resolve();
                    }
                });
                return p.promise;
            };
            /** Builds a list of due chores for current week from templates */
            choresDataSvc.prototype.buildChoreList = function () {
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
                                    Image: chore.Image || '',
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
            choresDataSvc.$inject = ['firebaseSvc', 'dateSvc', '$q'];
            return choresDataSvc;
        })();
        Services.choresDataSvc = choresDataSvc;
    })(Services = Chores.Services || (Chores.Services = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Services;
    (function (Services) {
        var userProfileSvc = (function () {
            function userProfileSvc(fb, $q, sessionStorageSvc) {
                this.fb = fb;
                this.$q = $q;
                this.sessionStorageSvc = sessionStorageSvc;
            }
            userProfileSvc.prototype.loadUserProfile = function (UID) {
                var _this = this;
                var p = this.$q.defer();
                this.fb.usersRoot.child(UID).once('value', function (d) {
                    _this._profile = d.val();
                    _this.sessionStorageSvc.put('Profile', JSON.stringify(d.val()));
                    p.resolve(d.val());
                });
                return p.promise;
            };
            Object.defineProperty(userProfileSvc.prototype, "userProfile", {
                get: function () {
                    if (!this._profile) {
                        return JSON.parse(this.sessionStorageSvc.get('Profile'));
                    }
                    return this._profile;
                },
                enumerable: true,
                configurable: true
            });
            userProfileSvc.prototype.purgeProfile = function () {
                this.sessionStorageSvc.delete('Profile');
            };
            userProfileSvc.$inject = ['firebaseSvc', '$q', 'sessionStorageSvc'];
            return userProfileSvc;
        })();
        Services.userProfileSvc = userProfileSvc;
    })(Services = Chores.Services || (Chores.Services = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Controllers;
    (function (Controllers) {
        var AppController = (function () {
            function AppController(ModalService, sessionSvc, $rootScope, userProfileSvc) {
                this.ModalService = ModalService;
                this.sessionSvc = sessionSvc;
                this.$rootScope = $rootScope;
                this.userProfileSvc = userProfileSvc;
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
                    return this.userProfileSvc.userProfile;
                },
                enumerable: true,
                configurable: true
            });
            AppController.$inject = ['ModalService', 'sessionSvc', '$rootScope', 'userProfileSvc'];
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
                controller: ChoreTemplateListCtrl,
                controllerAs: 'CTListCtrl',
                templateUrl: './Views/Templates/ChoreTemplateList.html',
                bindToController: true
            };
        }
        Directives.choreTemplateList = choreTemplateList;
        var ChoreTemplateListCtrl = (function () {
            function ChoreTemplateListCtrl(dataSvc) {
                this.dataSvc = dataSvc;
                this.load();
            }
            ChoreTemplateListCtrl.prototype.save = function () {
                var _this = this;
                this.dataSvc.setChoreTemplates(this.choretemplates)
                    .then(function () {
                    _this.load();
                })
                    .catch(function (e) {
                    console.log('There was an error saving the list');
                });
            };
            ChoreTemplateListCtrl.prototype.load = function () {
                var _this = this;
                this.dataSvc.getChoreTemplates().then(function (data) {
                    _this.choretemplates = data;
                });
            };
            ChoreTemplateListCtrl.$inject = ['choresDataSvc'];
            return ChoreTemplateListCtrl;
        })();
    })(Directives = Chores.Directives || (Chores.Directives = {}));
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
                controller: ApprovalListController,
                controllerAs: 'ApprovalCtrl',
                bindToController: true,
                replace: true
            };
        }
        Directives.approvalList = approvalList;
        var ApprovalListController = (function () {
            function ApprovalListController(dataSvc) {
                var _this = this;
                this.dataSvc = dataSvc;
                this.dataSvc.getChoresOverView().then(function (p) {
                    _this.chorelist = p;
                });
            }
            ApprovalListController.prototype.approve = function () {
                console.log('approving..');
                this.dataSvc.approveWeek();
            };
            ApprovalListController.$inject = ['choresDataSvc'];
            return ApprovalListController;
        })();
    })(Directives = Chores.Directives || (Chores.Directives = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Directives;
    (function (Directives) {
        function choreList() {
            return {
                restrict: 'EA',
                bindToController: true,
                controller: chorelistController,
                controllerAs: 'ChoreListCtrl',
                replace: true,
                template: "<div>\n\t\t\t\t\t\t\t<h1 class=\"header center orange-text\"> Chores </h1>\n\t\t\t\t\t\t\t<div class=\"container\" id=\"choreList\">\n\t\t\t\t\t\t\t\t<chore-card ng-animate=\"'animate'\" ng-repeat=\"chore in ChoreListCtrl.chorelist | filter: chore.Due < ChoreListCtrl.filterDate && !chore.completed\"\n\t\t\t\t\t\t\t\tchore=\"chore\"></chore-card>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t  </div>"
            };
        }
        Directives.choreList = choreList;
        var chorelistController = (function () {
            function chorelistController(dataSvc, dateSvc) {
                var _this = this;
                this.dataSvc = dataSvc;
                this.dataSvc.getChoreToDoList().then(function (p) {
                    p.$loaded().then(function (d) {
                        _this.chorelist = d;
                    });
                });
                this.filterDate = dateSvc.today;
            }
            chorelistController.$inject = ['choresDataSvc', 'dateSvc'];
            return chorelistController;
        })();
    })(Directives = Chores.Directives || (Chores.Directives = {}));
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
                controller: ChoreController,
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
        var ChoreController = (function () {
            function ChoreController($scope) {
                $scope.ChoreCtrl = this;
                this.chore = $scope.chore;
                this.imgSource = this.chore.Image;
            }
            ChoreController.$inject = ['$scope'];
            return ChoreController;
        })();
    })(Directives = Chores.Directives || (Chores.Directives = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Directives;
    (function (Directives) {
        function choreHistoryList() {
            return {
                restrict: 'E',
                controller: ChoreHistoryCtrl,
                controllerAs: 'HistoryCtrl',
                bindToController: true,
                replace: true,
                templateUrl: '/Views/Templates/ChoreHistoryList.htm'
            };
        }
        Directives.choreHistoryList = choreHistoryList;
        var ChoreHistoryCtrl = (function () {
            function ChoreHistoryCtrl($scope, dataSvc) {
                var _this = this;
                this.dataSvc = dataSvc;
                $scope.ChoreHistoryCtrl = this;
                this.dataSvc.getChoreHistory().then(function (d) {
                    _this.historyList = d;
                });
            }
            ChoreHistoryCtrl.$inject = ['$scope', 'choresDataSvc'];
            return ChoreHistoryCtrl;
        })();
    })(Directives = Chores.Directives || (Chores.Directives = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Directives;
    (function (Directives) {
        function choreEditor() {
            return {
                restrict: 'E',
                controller: ChoreEditorCtrl,
                controllerAs: 'choreEditCtrl',
                bindToController: true,
                templateUrl: 'Views/Templates/choreEditor.html'
            };
        }
        Directives.choreEditor = choreEditor;
        var ChoreEditorCtrl = (function () {
            function ChoreEditorCtrl(dataSvc) {
                this.dataSvc = dataSvc;
                this.load();
            }
            ChoreEditorCtrl.prototype.save = function () {
                var _this = this;
                this.dataSvc.addChore(this.chore)
                    .then(function () {
                    console.log('Chore Submitted succesfully');
                    _this.load();
                })
                    .catch(function (e) {
                    console.log('There was an error ' + e);
                });
            };
            ChoreEditorCtrl.prototype.toggleEditor = function () {
                this.expanded = !this.expanded;
            };
            ChoreEditorCtrl.prototype.load = function () {
                this.chore = {
                    Description: undefined,
                    Name: undefined,
                    Frequency: '',
                    Schedule: [false, false, false, false, false, false, false]
                };
                this.expanded = false;
            };
            ChoreEditorCtrl.$inject = ['choresDataSvc'];
            return ChoreEditorCtrl;
        })();
    })(Directives = Chores.Directives || (Chores.Directives = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Directives;
    (function (Directives) {
        function fileUpload() {
            return {
                restrict: 'EA',
                scope: {},
                controller: fileUploadCtrl,
                bindToController: true,
                require: '^ngModel',
                controllerAs: 'FileUploadCtrl',
                link: function (scope, el, attr, model) {
                    el.on('change', function (ev) {
                        ev.preventDefault();
                        var img = el[0].files[0];
                        scope.fileUploadCtrl.upload(img).then(function (result) {
                            model.$setViewValue(result);
                        });
                    });
                }
            };
        }
        Directives.fileUpload = fileUpload;
        var fileUploadCtrl = (function () {
            function fileUploadCtrl($scope, $http, $q) {
                this.$scope = $scope;
                this.$http = $http;
                this.$q = $q;
                $scope.fileUploadCtrl = this;
            }
            fileUploadCtrl.prototype.upload = function (f) {
                var p = this.$q.defer();
                var reader = new FileReader();
                reader.onload = function (e) { p.resolve(e.target.result); };
                reader.readAsDataURL(f);
                return p.promise;
            };
            fileUploadCtrl.$inject = ['$scope', '$http', '$q'];
            return fileUploadCtrl;
        })();
    })(Directives = Chores.Directives || (Chores.Directives = {}));
})(Chores || (Chores = {}));
///<reference path="../../all.d.ts"/>
var Chores;
(function (Chores) {
    var Directives;
    (function (Directives) {
        function userMenu() {
            return {
                restrict: 'E',
                templateUrl: 'Views/Templates/userMenu.html',
                controller: userMenuCtrl,
                bindToController: true,
                controllerAs: 'userMenuCtrl',
                link: function (scope, el, attrs) {
                }
            };
        }
        Directives.userMenu = userMenu;
        var userMenuCtrl = (function () {
            function userMenuCtrl() {
            }
            userMenuCtrl.prototype.toggle = function () {
                this.isopen = !this.isopen;
            };
            return userMenuCtrl;
        })();
    })(Directives = Chores.Directives || (Chores.Directives = {}));
})(Chores || (Chores = {}));
/// <reference path="../../all.d.ts" />
var Chores;
(function (Chores) {
    var directives;
    (function (directives) {
        function dropDown() {
            return {
                restrict: 'EA',
                controller: dropDownCtrl,
                controllerAs: 'dropDownCtrl',
                bindToController: true,
                link: function (scope, el, attrs) {
                    var menu = angular.element(el[0].getElementsByClassName('dropdown-list').item(0));
                    function toggle(ev) {
                        if (!scope.dropDownCtrl.expanded) {
                            menu.addClass('drop-down-show');
                        }
                        else {
                            menu.removeClass('drop-down-show');
                        }
                    }
                    scope.$watch('dropDownCtrl.expanded', toggle);
                }
            };
        }
        directives.dropDown = dropDown;
        var dropDownCtrl = (function () {
            function dropDownCtrl($scope) {
                $scope.dropDownCtrl = this;
                this.expanded = false;
            }
            dropDownCtrl.prototype.toggle = function () {
                console.log('expanded');
                this.expanded = !this.expanded;
            };
            return dropDownCtrl;
        })();
    })(directives = Chores.directives || (Chores.directives = {}));
})(Chores || (Chores = {}));
///<reference path="../all.d.ts"/>
var Chores;
(function (Chores) {
    var app = angular.module('Chores', ['firebase', 'ngAnimate', 'ngTouch', 'ngRoute', , 'ngCookies', 'angularModalService', 'ui.bootstrap'])
        .service('dateSvc', Chores.Services.dateSvc)
        .service('sessionStorageSvc', Chores.Services.sessionStorageSvc)
        .service('firebaseSvc', Chores.Services.firebaseSvc)
        .service('choresDataSvc', Chores.Services.choresDataSvc)
        .service('userProfileSvc', Chores.Services.userProfileSvc)
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
