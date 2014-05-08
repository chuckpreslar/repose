var assert = require("assert");

var Model      = require("../../lib/repose/model")
  , ResourceNode = require("../../lib/repose/nodes/resource");

var Post = Model.extend({
  attributes: {
    title: { type: String },
    body: { type: String },
    authorId: { type: Number, foreignKey: User }
  },
  relationships: [
    { belongsTo: User }
  ],
  actions: [
    { name: "latest", on: "collection" },
    { name: "last" }
  ],
  options: {
    resource: "posts"
  }
})

var User = Model.extend({
  attributes: {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String }
  },
  formatters: {
    fullName: function() {
      return this.firstName + " " + this.lastName;
    }
  },
  actions: [
    { name: "latest",  on: "collection" },
    { name: "details", on: "member" },
    { name: "last" }
  ],
  relationships: [
    { hasMany: Post }
  ]
});

describe("ResourceNode", function() {
  it("should define actions for collections", function(done) {
    var latest = User.find(3).posts().latest;
    var last   = User.find(3).posts().last;
    assert.equal("function", typeof latest, "failed to add declared action on collection");
    assert.equal("function", typeof last, "failed to add undeclared action on collection");
    done()
  });
});
