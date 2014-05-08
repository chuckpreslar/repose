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
  ],
  options: {
    resource: "users"
  }
});

describe("URLVisitor", function() {
  describe("#visit", function() {
    describe("#visitDirectNode", function() {
      it("should correctly compute simple URL for a DirectNode", function(done) {
        assert.equal("/users/1", User.find(1).toURL(), "failed to compute simple URL for DirectNode");
        done();
      });

      it("should correctly compute simple URL for a ResourceNode", function(done) {
        assert.equal("/users/1/posts", User.find(1).posts().toURL(), "failed to compute simple URL for ResourceNode");
        done();
      });

      it("should correctly compute simple URL for an collective ActionNode", function(done) {
        assert.equal("/users/1/posts/latest", User.find(1).posts().latest().toURL(), "failed to compute simple URL for ActionNode");
        done();
      });

      it("should correctly compute simple URL for an base collective", function(done) {
        assert.equal("/users/last", User.last().toURL(), "failed to compute simple URL for ActionNode");
        done();
      });
    });
  });
});
