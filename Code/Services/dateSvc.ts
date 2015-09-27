///<reference path="../../all.d.ts"/>

module Chores.Services {
	
	/** Contains date utilities commonly used across the app */
	export class dateSvc {
		private _thisweek: string;
		private _weekstart: number;
		private _today: number; 
		private weekstartDate;
		
		constructor(){
			var d = new Date();
      		var diff = d.getDate() - d.getDay() + (d.getDay() == 0 ? -6:1); // adjust when day is sunday
  			d.setDate(diff);
			this.weekstartDate = d; 
			this._weekstart = d.getTime();
			   
		   this._thisweek =  this.dateToString(d); // padding
  		}
		
		/**Returns the first day of the week in DDMMYYY */
	  	get thisWeek(){
			  return this._thisweek;
	  	}
		
		/**Returns an array of timestamps representing each day of the week at midnight */
		get weekDates() {
			
			var d = this.weekstartDate
			var ret: number[] = [d.getTime()];
			var i = 0; 
			//Create an array of dates for this week all midnight
			while(i<7) {
				var p = new Date(d.setDate(d.getDate()+1))
				p.setHours(0,0,0,0);
				ret.push(p.getTime())
				i++
			}
			return ret;
		}
		
		/**Returns today at 23:59:59 in timestamp, used to filter 'Due' */
		get today(): number {
			var d = new Date();
			d.setHours(23,59,59,9999)
			return d.getTime();
		}
		
		/**Returns the start of the week in timestamp form */
		get weekStart():number{
			return this._weekstart;
		}
		
		get weekStartString():string {
			return this._weekstart.toString();
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