///<reference path="../../all.d.ts"/>

module Chores.Services {
	
	export class dateSvc {
		_thisweek: string;
		
		constructor(){
			var d = new Date();
   			var yyyy = d.getFullYear().toString();
   			var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
			var dd  = d.getDate().toString();
   			this._thisweek =  yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
  		}
		  
	  	get thisWeek(){
			  return this._thisweek;
	  	}
		 
	}
}