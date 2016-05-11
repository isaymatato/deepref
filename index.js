// @TODO - pointer,field should be a class

function Reference(pointer, field) {
  this.pointer = pointer;
  this.field = field
}

Reference.prototype.resolve = function() {
  return this.pointer[this.field];
};

Reference.prototype.set = function(value) {

};

function mapKeys(parent, pointer) {
  Object.keys(pointer).forEach(function(key) {
    parent.pointer[ parent.field ][key] = pointer[key];
  });
}

function isNumber(field) {
  return /^\d+$/.test(field);
}

function doThing(pointer,field){
  var isNum = /^\d+$/.test(field);
  var oldField = field;

  // if (isNum) {
  //   // Field is an integer
  //   field = parseInt(field);

  //   // Convert current obj to array if it isn't one already
  //   if (!Array.isArray(pointer) &&
  //       parent) {
  //     parent.pointer[ parent.field ] = [];
  //     mapKeys(parent, pointer);
  //     pointer = parent.pointer[ parent.field ];
  //   }
  // }

  if (typeof pointer[field] !== 'object') {
    pointer[field] = {};
  }

  parent = new Reference(pointer, field);

  // if (i < path.length - 1) {
  //   pointer = pointer[field];
  // }
}

function deepReference(object, path) {
  path = path.split('.');
  var field;
  var intField;
  var pointer = object;
  var parent = null;
  for (var i = 0; i < path.length; i += 1) {
    field = path[i];
    var isNum = /^\d+$/.test(field);
    var oldField = field;

    if (isNum) {
      // Field is an integer
      field = parseInt(field);

      // Convert current obj to array if it isn't one already
      if (!Array.isArray(pointer) &&
          parent) {
        parent.pointer[ parent.field ] = [];
        mapKeys(parent, pointer);
        pointer = parent.pointer[ parent.field ];
      }
    }

    if (typeof pointer[field] !== 'object') {
      pointer[field] = {};
    }

    parent = new Reference(pointer, field);

    if (i < path.length - 1) {
      pointer = pointer[field];
    }
  }
  return new Reference(pointer, field);
}

function deepSet(object, path, value) {
  var deep = deepReference(object, path);
  deep.pointer[deep.field] = value;
}

module.exports = {
  /**
  * Set a deeply nested value of an object
  * This alters the original object
  *
  * @param  {Object} object The object you want to alter
  * @param  {String} path The reference path
  * @param  {*} value The value you want to set
  * @return {Object} object Retuns the altered object
  */
  set: function(object, path, value) {
    var deep = deepReference(object, path);
    deep.pointer[deep.field] = value;
    return object;
  }
};
