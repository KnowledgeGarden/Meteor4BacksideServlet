var undefined;

function createBookmark(url, title, language, tagLabelArray,
                userId, userIP, sToken, callback) {
  console.log("CREATEBKMK "+url+" "+title+" | "+sToken);
  Meteor.call('findOrCreateBookmark', url, title, language, tagLabelArray, userId,
        userIP, sToken, function(err, rslt) {
    console.log("CREATEBKMK1 "+err+" "+JSON.stringify(rslt));
      return callback(err, rslt);
  });
}
var wrappedCreateBookmark = Meteor.wrapAsync(createBookmark);

Meteor.methods ({

  bookmarkPage: function(pageURL, pageTitle, tag1, tag2, tag3, tag4,
        userId, userIP, sToken) {
    console.log("BookmarkPage "+pageURL+" "+pageTitle+" | "+userId+" | "+userIP+" | "+sToken);

    var tagLabelArray = [];
    if (tag1 !== '')
      tagLabelArray.push(tag1);
    if (tag2 !== '')
      tagLabelArray.push(tag2);
    if (tag3 !== '')
      tagLabelArray.push(tag3);
    if (tag4 !== '')
      tagLabelArray.push(tag4);

    return wrappedCreateBookmark(pageURL, pageTitle, 'en', tagLabelArray,
          userId, userIP, sToken, function(err, rslt) {
      console.log("BookmarkPage1 "+JSON.stringify(rslt));
    });
  },

});
