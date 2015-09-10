
Meteor.methods({

  addMessage: function(userId, message) {
    var m = {};
    m.name = userId;
    m.message = message;
    m.time = Date().now;
    Messages.insert(m);
  }
});
