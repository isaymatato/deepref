var should = require('chai').should();
var deepref = require('../index');
var set = deepref.set;

describe('#set', function() {
  it('sets obj[0] to true', function() {
    var obj = set({}, '0', true);
    obj[0].should.equal(true);
  });

  it('sets obj.a to true', function() {
    var obj = set({}, 'a', true);
    obj.a.should.equal(true);
  });

  it('sets obj.a.b[0] to true', function() {
    var obj = set({}, 'a.b.0', true);
    obj.a.b[0].should.equal(true);
  });

  it('sets obj to ["a","b","c"]', function() {
    var obj = {};
    obj = set(obj, '0', 'a');
    obj = set(obj, '1', 'b');
    obj = set(obj, '2', 'c');
    obj[0].should.equal('a');
    obj[1].should.equal('b');
    obj[2].should.equal('c');
  });
});