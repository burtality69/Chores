///<reference path="../../all.d.ts"/>

module Chores.Services {
	
	/** Contains date utilities commonly used across the app */
	export class dateSvc {
		_thisweek: string;
		startdate: Date;
		
		constructor(){
			var d = new Date();
   			//var yyyy = d.getFullYear().toString();
   			//var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
			//var day = d.getDay();
      		var diff = d.getDate() - d.getDay() + (d.getDay() == 0 ? -6:1); // adjust when day is sunday
  			d.setDate(diff);
   			//var dd = d.getDate().toString(); 
			this.startdate = d;
			   
		   this._thisweek =  this.dateToString(d); // padding
  		}
		  
	  	get thisWeek(){
			  return this._thisweek;
	  	}
		  
		get weekDates() {
			
			var d = this.startdate;
			var ret: number[] = [d.getTime()];
			var i = 0; 
			while(i<7) {
				var p = new Date(d.setDate(d.getDate()+1))
				ret.push(p.getTime())
				i++
			}
			return ret;
		}
		
		get today(): number {
			return new Date().getTime();
		}
		
		/**Converts a data to a string in MMDDYYYY */
		dateToString(d: Date) {
			var yyyy = d.getFullYear().toString();
			var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
			var dd = d.getDate().toString();
			
			return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]);
		}
	}
}