/**
 * Session params used
 * blogcursor
 *
 */
var NUM_ITEMS = 50;

function listBlogPosts(start, count, callback) {
 Meteor.call('listBlogPosts', start, count, 'SystemUser', '', null, function(err, rslt) {
   return callback(err,rslt);
 });
}

var wrappedListBlogPosts = Meteor.wrapAsync(listBlogPosts);

Template.blogs.created = function() {
  Session.set('blogcursor', 0);
  wrappedListBlogPosts(0, NUM_ITEMS, function(err, rslt) {
    console.log("LIST_BLOGS "+err+" "+ rslt);
    console.log(JSON.stringify(rslt.cargo));
  });
}

Template.bookmarks.helpers({

});
