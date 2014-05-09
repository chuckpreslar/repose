var Node         = require("./node"),
    ActionNode   = require("./action"),
    ResourceNode = require("./resource");

function DirectNode(model, id, stack) {
  stack = stack || [];

  var scheme        = model.scheme,
      actions       = scheme.actions || [],
      relationships = scheme.relationships || [];

  this.__defineGetter__("model", function() {
    return model;
  });

  this.__defineGetter__("id", function() {
    return id;
  });

  this.__defineGetter__("stack", function() {
    return stack;
  });

  actions.forEach(function(action) {
    if ("member" !== action.on) {
      return;
    } else if ("undefined" !== typeof this[action.name]) {
      // FIXME: Adjust this error message.
      throw new Error("");
    }

    this.__defineGetter__(action.name, function() {
      return function() {
        return new ActionNode(this, action, stack);
      }.bind(this);
    }.bind(this));
  }.bind(this));

  relationships.forEach(function(relationship){
    if ("undefined" === typeof relationship.hasMany) {
      return;
    }

    var related  = relationship.hasMany,
        resource = related.resource;

    this.__defineGetter__(resource, function() {
      return function() {
        return new ResourceNode(model, related, stack);
      }.bind(this)
    }.bind(this));
  }.bind(this));

  stack.push(this);
}

DirectNode.prototype = new Node();
DirectNode.prototype.constructor = DirectNode;

module.exports = DirectNode;
