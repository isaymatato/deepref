// @TODO - pointer,field should be a class

function mapKeys(parent, pointer) {
  Object.keys(pointer).forEach(function(key) {
    parent.pointer[ parent.field ][key] = pointer[key];
  });
}

function deepReference(object, path) {
  path = path.split('.');
  var field;
  var intField;
  var pointer = object;
  var parent = null;
  for (var i = 0; i < path.length; i += 1) {
    field = path[i];
    intField = parseInt(field);

    if (!isNaN(intField)) {
      // Field is an integer
      field = intField;

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
    parent = {
      pointer: pointer,
      field: field
    };
    if (i < path.length - 1) {
      pointer = pointer[field];
    }
  }
  return {
    pointer: pointer,
    field: field
  };
}

function deepSet(object, path, value) {
  var deep = deepReference(object, path);
  deep.pointer[deep.field] = value;
}

module.exports = {
  set: function(object, path, value) {
    var deep = deepReference(object, path);
    deep.pointer[deep.field] = value;
  }
};
