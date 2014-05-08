var Visitor = require("../visitors/url");

function Node() {
  this.stack = [];
}

Node.prototype.toURL = function() {
  return Visitor.accept(this.stack);
}

module.exports = Node;
