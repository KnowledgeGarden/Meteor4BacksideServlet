

function _listBlogPosts(start, count, userId, userIP, sToken, callback) {
  //TODO
}
var wrappedListBookmarks = Meteor.wrapAsync(_listBlogPosts);

Meteor.methods ({

  listBlogPosts: function(start, count, userId, userIP, sToken, callback) {

  }
});
