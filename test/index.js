var should = require('chai').should(),
    deepref = require('../index'),
    set = deepref.set;

describe('#set', function() {
  it('sets obj.a.b[0] to true', function() {
    var obj = set({},'a.b.0',true);
    obj.a.b[0].should.equal(true);
  });
});