///<reference path="../all.d.ts"/>
interface Chore extends IChoreTemplate {
	completed: boolean,
	approved: boolean,
	Due: number
	Image: string
}

interface $SyncChore extends AngularFireSimpleObject {
	completed: boolean,
	approved: boolean,
	Due: number,
	Image: string
}
