///<reference path="../all.d.ts"/>
interface ChoreList {[id: string]: ChoreTemplate};
interface WeeklyChorelist {chores: Chore[], Meta: ChoresMeta};
interface ChoresMeta {Completed: boolean, CompletedOn: Date|number, Paid: boolean}

interface $SyncChoreList extends AngularFireArray{
	chores: ChoreList,
	Meta: ChoresMeta
}