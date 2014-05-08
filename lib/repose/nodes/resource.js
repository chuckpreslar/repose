var Node       = require("./node"),
    ActionNode = require("./action");

function ResourceNode(owner, related, stack) {
  stack = stack || [];

  this.__defineGetter__("owner", function() {
    return owner;
  });

  this.__defineGetter__("related", function() {
    return related;
  });

  this.__defineGetter__("stack", function() {
    return stack;
  });

  var scheme  = related.scheme,
      actions = scheme.actions || [];

  actions.forEach(function(action) {
    if ("member" === action.on) {
      return;
    } else if ("undefined" !== typeof this[action.name]) {
      throw new Error("model defined in `" +
        module.parent.filename + "` " + "has defined " +
        "multiple members using `" + action.name + "`");
    }

    this.__defineGetter__(action.name, function() {
      return function() {
        this.__remove__();
        return new ActionNode(this.related, action, this.stack);
      }.bind(this);
    }.bind(this));
  }.bind(this));

  stack.push(this);
}

ResourceNode.prototype = new Node();
ResourceNode.prototype.constructor = ResourceNode;

ResourceNode.prototype.find = function(id) {
  this.__remove__();
  return new DirectNode(this.related, id, this.stack);
};

ResourceNode.prototype.where = function(filter) {
  this.__remove__();
  return new DirectNode(this.related, filter, this.stack);
};

ResourceNode.prototype.__remove__ = function() {
  var index = this.stack.indexOf(this);
  this.stack.splice(index, 1);
};

module.exports = ResourceNode;
