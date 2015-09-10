/**
 * Session params used here
 * ErrorMessage  set in Router
 */


Template.errorPage.helpers({

  errorMessage: function() {
    return Session.get('ErrorMessage');
  }
});

Meteor.methods ({

  showErrorMessage: function(errorMessage) {
    var msg = encodeURIComponent(errorMessage);
    return Router.go('/errorPage/'+msg);

  }
});
