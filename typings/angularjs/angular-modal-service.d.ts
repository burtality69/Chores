

/// <reference path="angular.d.ts" />

declare module "angular-modal-service" {
    var _: string;
    export = _;
}

declare module angular.modalService{
 
 export interface modalService {
     showModal(options: modalOptions): ng.IPromise<modal>; 
 }
 
 export interface modalOptions {
     controller: Function | string,
     controllerAs?: string,
     templateUrl?: string,
     template?: string,
     inputs?: Object,
     appendElement?: HTMLElement   
 }
 
export interface modal{
     element: HTMLElement,
     scope: ng.IScope,
     controller: Function,
     close: ng.IPromise<any>
 }
 
}