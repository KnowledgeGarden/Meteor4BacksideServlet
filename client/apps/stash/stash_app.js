/**
 * StashApp just uses localstore
 * Session params
 * StashId  set in router
 * pageURL set in router
 * The bookmarklet
 * javascript:location.href='http://localhost:3000/tago/stash/'+
 * encodeURIComponent(location.href)
 *
 */

 Template.stashes.helpers({
   stashes: function() {
     var x = Stash.findOne(Session.get('userId'));
     console.log("Firing Stashes "+Session.get('userId')+" "+JSON.stringify(x));
     return x;
   }
 });

 Template.stashForm.created = function() {
   //check for authentication
   var isA = Session.get('isAuthenticated');
   console.log('TAGO LI '+isA+" | "+Session.get('uEmail'));
   if (isA !== 'T') {
     Router.go('/login');
   }
 }

 Template.stashForm.helpers ({

   pageURL: function() {
     console.log("TAGFORMURL "+Session.get('pageURL'));
     return Session.get('pageURL');
   }
 });

 Template.stashForm.events ({
   'submit .stash': function(e, template) {
     e.preventDefault();
     console.log("AddInvite");
     var $url = $(e.target).find('[name=pageURL]');
     var $cmt = $(e.target).find('[name=details]');
     var url = $url.val(),
        comment = $cmt.val();
     console.log("STASHFORM "+url+" | "+comment);
     Meteor.call('addToStash', Session.get('userId'), url, comment, function(err, rslt) {
       console.log("STASHED");
       Router.go('/');
     });
   }
 });
