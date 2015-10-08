/**
 * Code inspired by:
 *http://sebastiandahlgren.se/2013/07/17/tutorial-writing-your-first-metor-application/
 */
Template.chat.created = function() {
  console.log("ChatStarting");
}

Template.chat.helpers({

  isAuthenticated: function() {
    return ('T' === Session.get('isAuthenticated'));
  },

  messages: function() {
    var x = Messages.findOne({'_id':'ChatCargo'});
    console.log("Chatting "+JSON.stringify(x));
    if (x) {
      x = x.list;
    }
    return x;
  /*  var x = [];
    var y = {};
    y.name = "testgeek";
    y.message = "Hello World!";
    x.push(y);
    return x; */
  }
});

Template.input.events = {
  'keydown input#message' : function (event) {
    if (event.which == 13) { // 13 is the enter key event

      var name = Session.get('userId');
      var message = document.getElementById('message').value;

      if (message.value != '') {
        console.log("InputAddingMessage "+message);
        Meteor.call('addMessage', name, message);
        document.getElementById('message').value = '';
      /*  Meteor.call('addMessage', name, message, function(err, rslt){
          console.log('ChatSent '+err+" "+rslt);
            document.getElementById('message').value = '';
        }); */


      }
    }
  }
}
