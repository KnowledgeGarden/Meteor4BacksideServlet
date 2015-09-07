

function _listConversations(start, count, userId, userIP, sToken, callback) {
  //TODO
}
var wrappedListConversations = Meteor.wrapAsync(_listConversations);

Meteor.methods ({

  listConversations: function(start, count, userId, userIP, sToken, callback) {

  }
});
