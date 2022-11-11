let str = "/I/love /javaScript";

// these two tests do the same
console.log( /love/i.test(str) && /java/i.test(str)); // true
console.log( str.search(/love/i) != -1 ); // true