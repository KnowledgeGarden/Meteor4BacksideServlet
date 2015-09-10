/////////////////////////////////
// Base URL of BacksideServlet
/////////////////////////////////
Meteor.settings.backsideURL= "http://localhost:8080/"; //TODO CHANGE ME
//////////////////////////////////
// invitationOnly
// All user accounts are maintained by BacksideServlet. It performs
// authentication, and returns a SessionToken (sToken here) which must
// be returned for any POST operation.
// BacksideServlet maintains a database of email addresses submitted by
// a site administrtator.
// If invitationOnly = 'T', a user cannot use the Register form unless
// that user's email is in the invitation database.
//////////////////////////////////
Meteor.settings.invitationOnly= 'T'; // 'T' if true 'F' if false
//////////////////////////////////
// Keeping Local Topics
// Meteor works by sequestering objects in play in local collections.
// Working with a backside topicmap, there is risk of sequestered objects
// going stale.
// If keepLocalTopics = 'F', local Topic collection objects are removed
// from the local collection before they are fetched again.
// If keepLocalTopics = 'T', local Topics will remain sequestered
///////////////////////////////////
Meteor.settings.keepLocalTopics= 'F'; // 'T' if true

//@see https://atmospherejs.com/u2622/persistent-session
Meteor.settings.persistent_session = { "default_method": "persistent" };

Meteor.methods({

  /**
   * Return <code>true</code> if site requires invitations to signup
   */
  isInvitationOnly: function() {
    var f = Meteor.settings.invitationOnly;
    console.log("CheckingInvitation "+f);
    return (f === "T");
  },

  /**
   * Return <code>true</code> if fetched topics are to remain
   * in the <code>Topics</code> collection
   */
  isKeepLocalTopics: function() {
    var f = Meteor.settings.keepLocalTopics;
    return (f === "T");
  }
});
