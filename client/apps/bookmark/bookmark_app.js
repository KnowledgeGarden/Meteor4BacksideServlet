/**
 * Session params used
 * bookmarkcursor
 * BookmarkId  set in router
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
      } catch (err) {console.log("DANG!"); t = res;}
    }
    console.log("TS99 "+error+" "+JSON.stringify(t));
    return callback(error, t);
  });
}

var wrappedClientGrabTopic = Meteor.wrapAsync(clientGrabTopic);
function listBookmarks(start, count, callback) {
  console.log('ClientListBookmarks');
  Meteor.call('listBookmarkTopics', start, count, 'SystemUser', '', null, function(err, rslt) {
    return callback(err,rslt);
  });
}

var wrappedListBookmarks = Meteor.wrapAsync(listBookmarks);

Template.bookmarks.created = function() {
  Session.set('bookmarkcursor', 0);
  wrappedListBookmarks(0, NUM_ITEMS, function(err, rslt) {
    console.log("LIST_BOOKMARKS "+err+" "+ rslt);
    if (rslt)
      console.log(JSON.stringify(rslt.cargo));
  });
}

Template.bookmarks.helpers({
  bookmarks: function() {
    console.log("FiringListBookmarks ");
      return Topics.findOne('ListBookmarks');
  }

});

Template.bookmark.created = function() {
  var lox = Session.get('BookmarkId');
  console.log("UserView "+lox);
  wrappedClientGrabTopic(lox, "SystemUser", '', null, function(err, result) {
    console.log("BookmarkGot "+JSON.stringify(result));
  });

}

Template.bookmark.helpers({
  myBookmark: function() {
    return Topics.findOne(Session.get('BookmarkId'));
  }

});
