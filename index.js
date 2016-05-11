function checkIfStringIsNumber(field) {
  return /^\d+$/.test(field);
}

function Reference(pointer, field, parent) {
  this.pointer = pointer;
  this.field = field;
  this.parent = parent || null;
}

Reference.prototype.copy = function(reference) {
  this.pointer = reference.pointer;
  this.field = reference.field;
  this.parent = reference.parent;
  return this;
};

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
  if (!this.field) {
    return this.pointer;
  } else {
    return this.pointer[this.field];
  }
};

Reference.prototype.getType = function(value) {
  return typeof this.pointer[this.field];
};

Reference.prototype.set = function(value) {
  if (typeof this.field === 'undefined') {
    throw new Error('Cannot set, field is undefined');
    return null;
  }
  this.pointer[this.field] = value;
  return this;
};

Reference.prototype.resolve = function() {
  var reference = this;
  while (reference.parent) {
    reference = reference.getParent();
  }
  return reference;
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
  if (!this.parent) {
    throw new Error('Cannot convert to array without a parent reference!');
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

Reference.createFromPath = function(pointer, path) {
  var reference = new Reference(pointer);
  path = path.split('.');
  path.forEach(function(field, index) {
    var isNumber = checkIfStringIsNumber(field);
    var hasParent = reference.getParent() ? true : false;
    if (isNumber && hasParent) {
      field = parseInt(field);
      reference.convertToArray();
    }
    reference = reference.getChild(field);
  });
  return reference;
};

/**
  * Set a deeply nested value of an object
  * This alters the original object
  *
  * @param  {Object} object The object you want to alter
  * @param  {String} path The reference path
  * @param  {*} value The value you want to set
  * @return {Object} object Retuns the altered object
  */
Reference.set = function(object, path, value) {
  var reference = Reference.createFromPath(object, path);
  reference.set(value);
  return reference.resolve();
};

module.exports = Reference;
