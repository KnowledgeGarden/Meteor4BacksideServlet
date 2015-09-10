/* A GOOD RESPONSE
{
    "statusCode": 200,
    "content": "{\"rMsg\":\"ok\",\"rToken\":\"\",\"cargo\":{\"crDt\":\"2015-08-31T07:09:24-07:00\",\"crtr\":\"SystemUser\",\"lox\":\"TypeType\",\"sIco\":\"\\/images\\/cogwheel_sm.png\",\"isPrv\":\"false\",\"_ver\":\"1441030164764\",\"lEdDt\":\"2015-08-31T07:09:24-07:00\",\"details\":\"Topic Map root type\",\"label\":\"Type type\",\"lIco\":\"\\/images\\/cogwheel.png\",\"isFederated\":false}}",
    "headers": {
        "date": "Mon, 31 Aug 2015 15:25:08 GMT",
        "content-type": "application/json; charset=UTF-8Access-Control-Allow-Origin: http://localhost:8080/",
        "content-length": "321",
        "server": "Jetty(9.2.11.v20150529)"
    },
    "data": {
        "rMsg": "ok",
        "rToken": "",
        "cargo": {
            "crDt": "2015-08-31T07:09:24-07:00",
            "crtr": "SystemUser",
            "lox": "TypeType",
            "sIco": "/images/cogwheel_sm.png",
            "isPrv": "false",
            "_ver": "1441030164764",
            "lEdDt": "2015-08-31T07:09:24-07:00",
            "details": "Topic Map root type",
            "label": "Type type",
            "lIco": "/images/cogwheel.png",
            "isFederated": false
        }
    }
}
*/
/**
 * Session params used:
 * TopicId  created by router for topic template
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
Template.topic.created = function() {
  var lox = Session.get('TopicId');
  console.log("TopicView "+lox);
  wrappedClientGrabTopic(lox, "SystemUser", '', null, function(err, result) {
    console.log("TopicGot "+JSON.stringify(result));
    //set that in Session for pivots
    Session.set('SessionTopic', result);
  });
}

Template.topic.helpers({
  myTopic: function() {
    return Topics.findOne(Session.get('TopicId'));
  }

});

Template.simpletopics.created = function() {
  Session.set('topicsErrors', {});
};

/*Template.topicView.helpers({
  myTopic: function() {
    return Session.get('myTopic');
  }
});*/
Template.simpletopics.helpers({
  errorMessage: function(field) {
    console.log("ERRORMESSAGE "+field);
    return Session.get('topicsErrors')[field];
  },
  errorClass: function (field) {
    console.log("ERRORCLASS "+field);
    return !!Session.get('topicSubmitErrors')[field] ? 'has-error' : '';
  },
  theTopic: function() {
    var result = "No topic selected";
    var lox = Session.get('myTopic');
    if (lox) {
      result = Topics.findOne(lox);
      if (result) {
        result = JSON.stringify(result);
      } else {
        result = JSON.stringify(Session.get('backsideError'));
      }
    }
    console.log("MYTOPIC "+lox+" | "+result);
    return result;
  }
});

Template.simpletopics.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var $body = $(e.target).find('[name=body]');
    var $theTopic = $(e.target).find('[name=theTopic]');
    console.log("TS "+$body+" "+$theTopic);
    var locator = $body.val();

    console.log("TS1 "+locator);
    var errors = {};
    if (! locator) {
      errors.body = "Please write a Locator";
      return Session.set('topicSubmitErrors', errors);
    }
  //  Topics.remove({_id:locator});
    Session.set('myTopic', locator);
    //Try to find locally first
  //  var myResult = Topics.findOne(locator);
  //  console.log("TS2 "+myResult);
//    if (!myResult) {
      console.log("TS3 "+Session.get('myTopic'));
      var userId = "guest"; //TODO get this from Session
      var userIP = "99.99.99.2"; // TODO get this from ajax
      var sToken = Session.get('sToken'); //will be null until logged in
      Session.set('backsideError', null);
      console.log("TS3A");
      wrappedClientGrabTopic(locator, userId, userIP, sToken,
          function(err, res) {
        console.log("TS4 "+err+" "+res);
        $body.val('');
        if (err) {
          Session.set('backsideError', err);
          Session.set('myTopic', null);
          Router.go('notFound');
        }
      });
//    } else {
//      $body.val('');
//    }
  }

});
