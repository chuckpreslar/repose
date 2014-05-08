var Node = require("./node");

function ActionNode(model, action, stack) {
  stack = stack || [];

  this.__defineGetter__("model", function() {
    return model;
  });

  this.__defineGetter__("action", function() {
    return action;
  });

  this.__defineGetter__("stack", function() {
    return stack;
  });

  stack.push(this);
}

ActionNode.prototype = new Node();
ActionNode.prototype.constructor = ActionNode;

module.exports = ActionNode;
