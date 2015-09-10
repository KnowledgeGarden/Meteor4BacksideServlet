/** All values in Session are manipulated in admin */

Template.menu.onCreated(function() {
  var isA = Session.get('isAuthenticated');
  var st = Session.get('sToken');
  console.log("MenuBoot "+isA+" "+st);
  if (!isA) {
    //NOBODY is logged in, so initialize the session
    // Don't setPersistent -- that will happen in login
    Session.set('isNotAuthenticated', 'T');
    Session.set('isAuthenticated', 'F');
  }
});

Template.menu.helpers({

  isNotAuthenticated: function() {
    var t = Session.get('isNotAuthenticated');
    return (t === 'T');
  },
  isAuthenticated: function() {
    var t = Session.get('isAuthenticated');
    return (t === 'T');
  },
  isAdmin: function() {
    var t = Session.get('isAdmin');
    return (t === 'T');
  },

  userLocator: function() {
    return Session.get('userLocator');
  }
});
