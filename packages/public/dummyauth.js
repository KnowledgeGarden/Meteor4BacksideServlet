/** Authenticate a dummy user */
Meteor.methods({

  authenticate: function() {
    var userEmail = Meteor.settings.userEmail,
        userPwd = Meteor.settings.userPwd.
        console.log("Authenticating "+userEmail+" "+userPwd);
  }
});
