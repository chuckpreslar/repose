var path = require("path");

var rhetoric = require("rhetoric");

var ActionNode   = require("./nodes/action"),
    DirectNode   = require("./nodes/direct"),
    FilterNode   = require("./nodes/filter"),
    ResourceNode = require("./nodes/resource");

/**
 *
 */

function Model(attributes) {
  attributes = attributes || {};

  var scheme     = this.scheme,
      presenters = scheme.presenters || {},
      actions    = scheme.actions || [];

  for (var attribute in scheme.attributes) {
    this[attribute] = attributes[attribute];
  }

  for (var presenter in presenters) {
    if ("undefined" !== typeof this[presenter]) {
      throw new Error("model defined in `" +
        module.parent.filename + "` " + "has defined " +
        "multiple members using `" + presenter + "`");
    }

    this.__defineGetter__(presenter, presenters[presenter].bind(this));
  }

  for (var i = 0, il = actions.length; i < il; i++) {
    var action = actions[i];

    if ("member" !== action.on) {
      continue;
    } else if ("undefined" !== typeof this[action.name]) {
      throw new Error("model defined in `" +
        module.parent.filename + "` " + "has defined " +
        "multiple members using `" + action.name + "`");
    }

    this.__defineGetter__(action.name, function() {
      return function() {
        return new ActionNode(this, action);
      }.bind(this);
    }.bind(this));
  }
}

Model.find  = function(id) {
  return new DirectNode(this, id);
};

Model.where = function(filter) {
  return new FilterNode(this, filter);
};

/**
 *
 */

Model.extend = function(scheme) {
  var options = scheme.options || {},
      actions = scheme.actions || [];

  function $Model(attributes) {
    Model.call(this, attributes);
  }

  for (var method in Model) {
    if (Model.hasOwnProperty(method)) {
      $Model[method] = Model[method].bind($Model);
    }
  }

  $Model.__defineGetter__("scheme", function() {
    return scheme;
  });

  $Model.prototype.__defineGetter__("scheme", function() {
    return scheme;
  });

  $Model.__defineGetter__("resource", function() {
    return options.resource || rhetoric.pluralize(path.basename(module.parent.filename, ".js"));
  });

  $Model.prototype.__defineGetter__("resource", function() {
    return options.resource || rhetoric.pluralize(path.basename(module.parent.filename, ".js"));
  });

  actions.forEach(function(action) {
    if ("member" === action.on) {
      return;
    } else if ("undefined" !== typeof this[action.name]) {
      throw new Error("model defined in `" +
        module.parent.filename + "` " + "has defined " +
        "multiple members using `" + action.name + "`");
    }

    $Model.__defineGetter__(action.name, function() {
      return function() {
        return new ActionNode(this, action);
      }.bind(this);
    }.bind(this));
  }.bind($Model));

  return $Model;
}

module.exports = Model;
