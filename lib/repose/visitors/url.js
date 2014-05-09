function URLVistor(stack) {}

URLVistor.prototype.visit = function(node) {
  var constructor = node.constructor.name;
  switch (constructor) {
    case "ActionNode":
      return this.visitActionNode(node);
    case "DirectNode":
      return this.visitDirectNode(node);
    case "FilterNode":
      return this.visitFilterNode(node);
    case "ResourceNode":
      return this.visitResourceNode(node);
    default:
      throw new Error("no visitor method defined for `" + constructor + "`");
  }
};

URLVistor.prototype.visitDirectNode = function(node) {
  return "/" + node.model.resource + "/" + node.id;
};

URLVistor.prototype.visitResourceNode = function(node) {
  return "/" + node.related.resource;
};

URLVistor.prototype.visitActionNode = function(node) {
  if ("DirectNode" === node.model.constructor.name)
    return "/" + node.action.name;
  return "/" + node.model.resource + "/" + node.action.name;
};

URLVistor.accept = function(stack) {
  var visitor = new URLVistor(),
      url     = "",
      node;

  while ((node = stack.pop())) {
    url = visitor.visit(node) + url;
  }

  return url;
}

module.exports = URLVistor;
