Write to a deeply nested reference within an object.

Still working on the documentation, basically:

deepRef.set(object, path, value);

i.e.

var myObj = {};


deepRef.set(myObj, 'a.b.0', 'Deep so deep');

myObj is now:

{
	a: {
		b: [
			'Deep so deep'
		]
	} 
}