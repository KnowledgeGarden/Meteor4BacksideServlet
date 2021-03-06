/**
 * Session variables:
 * usercursor -- current start for listing users
 * UserTopicId  set in router
 * SessionTopic  set in various apps for pivot painting
 */
 var NUM_ITEMS = 50;

function listUsers(start, count, callback) {
  Meteor.call('listUserTopics', start, count, 'SystemUser', '', null, function(err, rslt) {
    return callback(err,rslt);
  });
}

var wrappedListUsers = Meteor.wrapAsync(listUsers);


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
Template.users.created = function() {
  Session.set('usercursor', 0);
  wrappedListUsers(0, NUM_ITEMS, function(err, rslt) {
    console.log("LIST_USERS "+err+" "+ rslt);
    console.log(JSON.stringify(rslt.cargo));
    Session.set('ListUsers', rslt.cargo);
  });
};

Template.userview.created = function() {
  var lox = Session.get('UserTopicId');
  console.log("UserView "+lox);
  wrappedClientGrabTopic(lox, "SystemUser", '', null, function(err, result) {
    console.log("UserGot "+JSON.stringify(result));
    //set that in Session for pivots
    Session.set('SessionTopic', result);
  });
}
Template.userview.helpers({
  myUser: function() {
    return Session.get('MyTopic');
  }
});

Template.users.helpers({
  //TODO
  // issue is to return something from Topics -- a LIST_USERS
  // but that list must be fetched; waiting for the fetch
  // kills the event
  tmusers: function() {
    return Session.get('ListUsers');
  }

});
