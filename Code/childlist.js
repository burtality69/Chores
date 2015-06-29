///<reference path="../all.d.ts"/>
function getList() {
    var d = new Date();
    var day = d.getDay();
    var diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    var weekstart = new Date(d.setDate(diff)).toString();
    var t = {};
    var ChoreTickList = {};
    // If this week doesn't exist, create it
    if (!choresUrl.child(weekstart)) {
        choresUrl.once("value", function parseChores(data) {
            t = data.val();
        });
        for (var p in t) {
            console.log(p);
        }
        choresUrl.child(weekstart).set(t);
    }
}
