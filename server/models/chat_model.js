/**
 * A small ringbuffer
 * If we put a ringbuffer in the client, it's local only.
 * This must be in the server, which might or might not work.
 * The big issue is making it reactive in clients; that's what Mondgo did
 * so well.
 * Perhaps if we write a ringstruct and just update Mongo with that, then
 * we won't overflow Mongo.
 */

var maxlen = 20, //A fixed size TODO make a settings value
    cargo = {},
    data = [];

function add(jsonMessage) {
  if (data.length >= maxlen) {
    data.shift();
  }
  data.push(jsonMessage);
}

Meteor.methods({


  addMessage: function(userId, message) {
    cargo._id = 'ChatCargo';
    cargo.list = null;
    // create a message
    var m = {};
    m.name = userId;
    m.message = message;
    m.time = Date().now;
    //add it to data

    var x = Messages.findOne({'_id':'ChatCargo'});
    var y;
    console.log("ChatAddMessage "+JSON.stringify(x));
    try {
      y = x.list;
    } catch (ex) {
      console.log("CHATERROR "+ex);
    }
    if (y) {
      cargo = x;
      cargo._id = 'ChatCargo';
      data = y;
      add(m);
      cargo.list = data;
      console.log("ChatUpdate "+JSON.stringify(cargo));
      Messages.update({'_id':'ChatCargo'}, cargo,  { upsert: true });
    } else {
      cargo = {};
      cargo._id = 'ChatCargo';
      data = [];
      add(m);
      cargo.list = data;
      console.log("ChatInsert "+JSON.stringify(cargo));
      Messages.insert(cargo);
    }
  }

});
