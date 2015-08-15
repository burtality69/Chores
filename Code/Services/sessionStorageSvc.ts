///<reference path="../../all.d.ts"/>

module Chores.Services{
	
	export class sessionStorageSvc {
		
		constructor(public $window: Window) {
		}	
		
		put(key: string, value: string) {
			this.$window.sessionStorage.setItem(key,value);
		}
		
		get(key:string) {
			return this.$window.sessionStorage.getItem(key);
		}
		
		delete(key: string){
			this.$window.sessionStorage.removeItem(key);
		}
	}
}