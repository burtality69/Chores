///<reference path="../all.d.ts"/>
interface Chore extends ChoreTemplate {
	completed: boolean,
	approved: boolean,
	Due: Date | string
}

interface $SyncChore extends AngularFireSimpleObject {
	completed: boolean,
	approved: boolean,
	Due: Date | String
}
