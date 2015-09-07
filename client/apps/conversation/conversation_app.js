/**
 * Session params used
 * conversationcursor
 *
 */
var NUM_ITEMS = 50;

function listConversations(start, count, callback) {
 Meteor.call('listConversations', start, count, 'SystemUser', '', null, function(err, rslt) {
   return callback(err,rslt);
 });
}

var wrappedListConversations = Meteor.wrapAsync(listConversations);

Template.conversations.created = function() {
  Session.set('conversationcursor', 0);
  listConversations(0, NUM_ITEMS, function(err, rslt) {
    console.log("LIST_CONVERSATIONS "+err+" "+ rslt);
    console.log(JSON.stringify(rslt.cargo));
  });
}

Template.bookmarks.helpers({

});
