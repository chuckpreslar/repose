var assert = require("assert");

var Model = require("../lib/repose/model");

var User = Model.extend({
  attributes: {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String }
  },
  presenters: {
    fullName: function() {
      return this.firstName + " " + this.lastName;
    }
  },
  actions: [
    { name: "latest",  on: "collection" },
    { name: "details", on: "member" },
    { name: "last" }
  ]
});

describe("Model", function() {
  describe("#extend", function() {
    it("should create a new instance of a model with attributes", function(done) {
      var user = new User({ firstName: "Jon", lastName: "Doe", email: "jondoe@example.com" });

      assert.equal(user.firstName, "Jon", "failed to set firstName attribute");
      assert.equal(user.lastName, "Doe", "failed to set firstName attribute");
      assert.equal(user.email, "jondoe@example.com", "failed to set email attribute");

      done();
    });

    it("should create getters for presenters", function(done) {
      var user = new User({ firstName: "Jon", lastName: "Doe", email: "jondoe@example.com" });

      assert.equal(user.fullName, "Jon Doe", "failed to establish getter for formatter");

      done();
    });

    it("should provide collection actions", function(done) {
      assert.equal("function", typeof User.find, "failed to add `find` for collection");
      assert.equal("function", typeof User.where, "failed to add `where` for collection");

      assert.equal("function", typeof User.latest, "failed to add declared action on collection");
      assert.equal("function", typeof User.last, "failed to add undeclared action on collection");
      assert.equal("undefined", typeof User.details, "set member action on collection");

      var user = new User();

      assert.equal("function", typeof user.details, "failed to set action on member");

      done();
    });
  });
});
