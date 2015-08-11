///<reference path="../all.d.ts"/>
interface ChoreList {[id: string]: ChoreTemplate};
interface WeeklyChorelist {chores: ChoreList, Meta: ChoresMeta};
interface ChoresMeta {Completed: boolean, CompletedOn: Date|number, Paid: boolean}

interface $syncChoreList extends AngularFireArray{
	chores: ChoreList,
	Meta: ChoresMeta
}