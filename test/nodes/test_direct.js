var assert = require("assert");

var Model      = require("../../lib/repose/model")
  , DirectNode = require("../../lib/repose/nodes/direct");

var Post = Model.extend({
  attributes: {
    title: { type: String },
    body: { type: String },
    authorId: { type: Number, foreignKey: User }
  },
  relationships: [
    { belongsTo: User }
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

describe("DirectNode", function() {
  describe("Model#find", function() {
    it("should return a DirectNode instance", function(done) {
      assert((User.find(3)) instanceof DirectNode, "failed to return a DirectNode instance");
      done();
    });
  });

  it("should have methods for each member action", function(done) {
    assert.equal("function", typeof User.find(3).details, "failed to define member action");
    assert.equal("undefined", typeof User.find(3).latest, "defined collection action on member");
    assert.equal("undefined", typeof User.find(3).last, "defined collection action on member");
    done();
  });

  it("should define methods for each hasMany relationship", function(done) {
    assert.equal("function", typeof User.find(3).posts, "failed to define hasMany relationship");
    done();
  });
});
