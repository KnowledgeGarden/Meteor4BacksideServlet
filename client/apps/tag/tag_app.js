/**
 * Session params used here
 * pageTitle set in router
 * pageURL set in router
 * tagcursor
 * isAuthenticated set in admin login
 * TagId  set in router
 * Bookmark templates
 * javascript:location.href='http://localhost:3000/tago/bm/'+
 * encodeURIComponent(location.href)+'/'+encodeURIComponent(document.title)
 */
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

function bookmark(pageURL, pageTitle, tag1, tag2, tag3, tag4,
      userId, userIP, sToken, callback) {
  Meteor.call('bookmarkPage', pageURL, pageTitle, tag1, tag2, tag3, tag4,
        userId, userIP, sToken, function(err, rslt) {
    console.log("BOOKMARK "+err+" "+JSON.stringify(rslt));
    return callback(err, rslt);
  });
}
var wrappedBookmark = Meteor.wrapAsync(bookmark);

var NUM_ITEMS = 50;

function listTags(start, count, callback) {
 Meteor.call('listTagTopics', start, count, 'SystemUser', '', null, function(err, rslt) {
   return callback(err,rslt);
 });
}

var wrappedListTags = Meteor.wrapAsync(listTags);

Template.tags.created = function() {
  Session.set('tagcursor', 0);
  wrappedListTags(0, NUM_ITEMS, function(err, rslt) {
    console.log("LIST_TAGS "+err+" "+ rslt);
    if (rslt)
      console.log(JSON.stringify(rslt.cargo));
  });
}

Template.tags.helpers({
  tags: function() {
    console.log("FiringListTags ");
      return Topics.findOne('ListTags');
  }
});
Template.tagForm.created = function() {
  //check for authentication
  var isA = Session.get('isAuthenticated');
  console.log('TAGO LI '+isA+" | "+Session.get('uEmail'));
  if (isA !== 'T') {
    Router.go('/login');
  }
}

Template.tagForm.helpers ({

  pageTitle: function() {
    return Session.get('pageTitle');
  },

  pageURL: function() {
    console.log("TAGFORMURL "+Session.get('pageURL'));
    return Session.get('pageURL');
  }
});

Template.tagForm.events ({
  'submit .tagForm': function(e, template) {
    e.preventDefault();
    console.log("AddInvite");
    var $ttl = $(e.target).find('[name=pageTitle]');
    var $url = $(e.target).find('[name=pageURL]');
    var $t1 = $(e.target).find('[name=tag1]');
    var $t2 = $(e.target).find('[name=tag2]');
    var $t3 = $(e.target).find('[name=tag3]');
    var $t4 = $(e.target).find('[name=tag4]');
    var title = $ttl.val(),
        url = $url.val(),
        tag1 = $t1.val(),
        tag2 = $t2.val(),
        tag3 = $t3.val(),
        tag4 = $t4.val();
    console.log("TAGOFORM "+title+" | "+url+" | "+tag1+" | "+
                  tag2+" | "+tag3+" | "+tag4);
    wrappedBookmark(url, title, tag1, tag2, tag3, tag4,
          Session.get('userId'), '', Session.get('sToken'), function(err, rslt) {
      console.log("BOOKMARK DID");
      if (!err)
        Router.go('/');
    });
  },
});

Template.tag.created = function() {
  var lox = Session.get('TagId');
  console.log("TagView "+lox);
  wrappedClientGrabTopic(lox, "SystemUser", '', null, function(err, result) {
    console.log("TagGot "+JSON.stringify(result));
  });

}

Template.tag.helpers({
  myTag: function() {
    console.log('FiringMyTag');
    return Topics.findOne(Session.get('TagId'));
  }

});
