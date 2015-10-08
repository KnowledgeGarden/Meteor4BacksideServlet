/**
 * Session params used
 * conversationcursor
 * ConversationId  set in Router
 */
var NUM_ITEMS = 50;

function clientGrabTopic(locator, userId, userIP, sToken, callback) {
  console.log("TS55 "+locator);
  Meteor.call('grabTopic', locator, userId, userIP, sToken, function(error, res) {
    console.log("TS96 "+error+" "+JSON.stringify(res));
    //when error, TS96 Internal server error [500] undefined
    // we see an error string, and undefined res
    var t = res;
    if (!error) {
      try {
        t = t.data.cargo;
        Session.set('MyTopic', t);
      } catch (err) {console.log("DANG!"); t = res;}
    }
    console.log("TS99 "+error+" "+JSON.stringify(t));
    return callback(error, t);
  });
}

var wrappedClientGrabTopic = Meteor.wrapAsync(clientGrabTopic);

function listConversations(start, count, callback) {
 Meteor.call('listConversations', start, count, 'SystemUser', '', null, function(err, rslt) {
   console.log("LLCC "+rslt);
   return callback(err,rslt);
 });
}

var wrappedListConversations = Meteor.wrapAsync(listConversations);

Template.conversation.created = function() {
  var lox = Session.get('ConversationId');
  console.log("ConversationView "+lox);
  wrappedClientGrabTopic(lox, "SystemUser", '', null, function(err, result) {
    console.log("ConversationGot "+JSON.stringify(result));
    //set that in Session for pivots
    Session.set('SessionTopic', result);
  });
}

Template.conversation.helpers ({
  myConversation: function() {
    return Session.get('SessionTopic');
  }
});

Template.conversations.created = function() {
  Session.set('conversationcursor', 0);
  listConversations(0, NUM_ITEMS, function(err, rslt) {
    console.log("LIST_CONVERSATIONS "+err+" "+ rslt);
    console.log(JSON.stringify(rslt.cargo));
    Session.set("ListConversations", rslt.cargo);
  });
}

Template.conversations.helpers({

  isAuthenticated: function() {
    return (Session.get('isAuthenticated') === 'T');
  },

  conversations: function() {
    return Session.get('ListConversations');
  }
});
