/**
 * Session properties used here
 * isauthenticated  set in admin.login
 * sToken  set in admin.login
 * userId  set in admin.login
 */

 function submitInstanceTopic(jsonTopic, userId, userIP, sToken, callback) {
   console.log("SUBMITINST- "+userId);
   Meteor.call('submitNewInstanceTopic', jsonTopic, userId, userIP, sToken,
                 function(err, rslt) {
     console.log("SUBMITINST "+err+" | "+JSON.stringify(rslt));
     return callback(err, rslt);
   });
 }

 var wrappedSubmitInstanceTopic = Meteor.wrapAsync(submitInstanceTopic);


function submitSubclassTopic(jsonTopic, userId, userIP, sToken, callback) {
  console.log("SUBMITSUB- "+userId);
  Meteor.call('submitNewSubclassTopic', jsonTopic, userId, userIP, sToken,
                function(err, rslt) {
    console.log("SUBMITSUB "+err+" | "+JSON.stringify(rslt));
    return callback(err, rslt);
  });
}

var wrappedSubmitSubclassTopic = Meteor.wrapAsync(submitSubclassTopic);

function getSubclassShell(locator, superT, userId, label, details, language,
        lgImage, smImage, isPrivate, callback) {
  Meteor.call('createNewSubclassTopic', locator, superT, userId, label,
        details, language, lgImage, smImage, isPrivate, function(err, rslt) {
    console.log("GOTSUBSHELL "+err+" | "+JSON.stringify(rslt));
    return callback(err, rslt);
  });
}

function getInstanceShell(locator, superT, userId, label, details, language,
        lgImage, smImage, isPrivate, callback) {
  Meteor.call('createNewInstanceTopic', locator, superT, userId, label,
        details, language, lgImage, smImage, isPrivate, function(err, rslt) {
    console.log("GOTINSTANCE "+err+" | "+JSON.stringify(rslt));
    return callback(err, rslt);
  });
}

function getImage(image, callback) {
  Meteor.call(image, function(err, resp) {
    console.log("GETIMAGE "+err+" | "+resp);

    return callback(resp);
  });
}

Template.topicmap.created = function() {
//  console.log("TM created");
}

Template.topicmap.helpers({

  test: function() {},

  isAuthenticated: function() {
    var t = Session.get('isAuthenticated');
    return (t === 'T');
  }
});

Template.topicmap.events({
  'submit .createSubclassTopic': function(e, template) {
    e.preventDefault();
    console.log("CREATETOPIC");
    Router.go('/subclassTopicForm');
  },

  'submit .createInstanceTopic': function(e, template) {
    e.preventDefault();
    console.log("CREATETOPIC");
    Router.go('/instanceTopicForm');
  }

});

Template.instanceTopicForm.events({
  'submit .newTopic': function(e, template) {
    e.preventDefault();
    console.log("Handling New Instance Topic");
    var $lox = $(e.target).find('[name=locator]');
    var $typ = $(e.target).find('[name=typelocator]');
    var $lbl = $(e.target).find('[name=label]');
    var $det = $(e.target).find('[name=details]');
    var locator = $lox.val(),
        superT = $typ.val(),
        label = $lbl.val(),
        details = $det.val(),
        language = 'en', //TODO
        smImage,
        lgImage,
        isPrivate = false, //TODO
        userId = Session.get('userId');
      getImage('CLASS_ICON_SM', function(rslt) { //TODO
        smImage = rslt;
        getImage('CLASS_ICON', function(rslt) { //TODO
          lgImage = rslt;
          getInstanceShell(locator, superT, userId, label,
                          details, language, lgImage, smImage,
                          isPrivate, function(err, rslt) {
            var theTopic = rslt;
            console.log("Handling New Instance Topic "+err+" | "+theTopic);
            var sToken = Session.get('sToken'),
                userIP = '';
            console.log("NEWINSTANCE "+JSON.stringify(theTopic));
            wrappedSubmitInstanceTopic(theTopic, userId, userIP, sToken, function(err, rslt) {
              console.log("NEWINSTANCE++ "+JSON.stringify(rslt));
              Router.go('/topicmap');
            });

          });
        });
      });
    }
});

Template.subclassTopicForm.events({
  'submit .newTopic': function(e, template) {
    e.preventDefault();

    var $lox = $(e.target).find('[name=locator]');
    var $typ = $(e.target).find('[name=superlocator]');
    var $lbl = $(e.target).find('[name=label]');
    var $det = $(e.target).find('[name=details]');
    var locator = $lox.val(),
        superT = $typ.val(),
        label = $lbl.val(),
        details = $det.val(),
        language = 'en', //TODO
        smImage,
        lgImage,
        isPrivate = false, //TODO
        userId = Session.get('userId');
    getImage('CLASS_ICON_SM', function(rslt) { //TODO
      smImage = rslt;
      getImage('CLASS_ICON', function(rslt) { //TODO
        lgImage = rslt;
      //  getSubclassShell
        getSubclassShell(locator, superT, userId, label,
                        details, language, lgImage, smImage,
                        isPrivate, function(err, rslt) {
          var theTopic = rslt;
          console.log("Handling New Subclass Topic "+err+" | "+theTopic);
          var sToken = Session.get('sToken'),
              userIP = '';
          console.log("NEWSUBCLASS "+JSON.stringify(theTopic));
          wrappedSubmitSubclassTopic(theTopic, userId, userIP, sToken, function(err, rslt) {
            console.log("NEWSUBCLASS++ "+JSON.stringify(rslt));
            Router.go('/topicmap');
          });

        });
      });
    });
  }
});
