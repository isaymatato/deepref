// @TODO - pointer,field should be a class

function checkIfStringIsNumber(field) {
  return /^\d+$/.test(field);
}

function Reference(pointer, field, parent) {
  this.pointer = pointer;
  this.field = field;
  this.parent = parent || null;
}

Reference.prototype.mapKeys = function(source) {
  if (typeof source !== 'object') {
    throw new Error('Cannot map from source, source is not an object');
    return null;
  }

  Object.keys(source).forEach(function(key) {
    this.pointer[ this.field ][key] = pointer[key];
  });

  return this;
};

Reference.prototype.get = function() {
  return this.pointer[this.field];
};

Reference.prototype.getType = function(value) {
  return typeof this.pointer[this.field];
};

Reference.prototype.set = function(value) {
  return this.pointer[this.field] = value;
};

Reference.prototype.initializeChildAsObject = function() {
  if (this.getType() !== 'object') {
    this.set({});
  }
  return this;
};

Reference.prototype.convertChildToArray = function() {
  var child = this.get();

  // Pointer already references an array
  if (Array.isArray(child)) {
    return this;
  }

  this.set([]);
  this.mapKeys(child);
  return this.get();
};

Reference.prototype.convertToArray = function() {
  // Cannot convert without a parent!
  if (!this.parent) {
    return null;
  }

  this.pointer = this.parent.convertChildToArray();
};

Reference.prototype.getChild = function(field) {
  if (typeof field !== 'string') {
    throw new Error(
      'Reference.getChild: field must be a string, type:' + typeof field);
    return null;
  }
  this.initializeAsObject();
  var parent = this;
  var pointer = this.get();

  return new Reference(pointer, field, parent);
};

Reference.prototype.getParent = function() {
  return this.parent || null;
};


function doThing(pointer,field){

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
