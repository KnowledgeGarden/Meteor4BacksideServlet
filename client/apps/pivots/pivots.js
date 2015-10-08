function pluckPivots (pivotList, nodeTypeList) {
//  console.log("PLUCKING "+JSON.stringify(pivotList));
  var result = [],
      struct,
      piv;
  if (pivotList) {
    var len2 = nodeTypeList.length;
        len = pivotList.length;
    for (var i=0; i<len; i++) {
      piv = pivotList[i];
      //seems that list elements are strings and not JSONObjects
      piv = JSON.parse(piv);
//      console.log("PLUCKED "+piv);
//      console.log("PTYPE "+piv.documentType+" | "+nodeType);
      for (var j=0; j<len2; j++) {
        if (piv.documentType === nodeTypeList[j]) {
          struct = {};
          struct.locator = piv.documentLocator;
          struct.image = piv.documentSmallIcon;
          struct.label = piv.documentLabel;
          result.push(struct);
          break;
        }
      }
    }
  }

  return result;
}

Template.tagPivot.helpers ({
  isAuthenticated: function() {
    return Session.get('isAuthenticated');
  },

  url: function() {
    var x = Session.get('SessionTopic');
    var result;
    if (x) {
      return encodeURIComponent(x.url);
    }
    return result;
  },

  tagP: function() {
    var x = Session.get('SessionTopic');
    if (x) {
      var l = [];
      l.push('TagNodeType');
      x = pluckPivots(x.pvL, l);
    }
    console.log('TagPivot '+JSON.stringify(x));
    return x;
  }
});

Template.docPivot.helpers ({
  docP: function() {
    var x = Session.get('SessionTopic');
    if (x) {
      var l = [];
      l.push('BookmarkNodeType');
      l.push('BlogNodeType');
      x = pluckPivots(x.pvL, l);
    }
    console.log('DocPivot '+JSON.stringify(x));
    return x;
  }

});

Template.userPivot.helpers ({

  userP: function() {
    var x = Session.get('SessionTopic');
    if (x) {
      var l = [];
      l.push('UserType');
      x = pluckPivots(x.pvL, l);
    }
    console.log('UserPivot '+JSON.stringify(x));
    return x;
  }

});
