// import highland from 'highland';
// import dump from 'main/dump';



// var s, s1, s2, tot;



// s = highland([1,2,3,4,5,6,7,8,9,10]);

// s2 = s.observe().map(x => x/tot).tap(dump);

// s.fork().reduce(0, (a,b) => a+b).apply(x => {
//     tot = x;
//     s2.resume();
// });






var m = new Map();
if (m.get("foo") === undefined) {
    m.set("foo", { a: [] });
}
m.get("foo").a.push(4);
console.log("%o",m);
