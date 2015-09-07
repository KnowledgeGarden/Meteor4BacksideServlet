/**
 * Basic Stash structure:
 {
     "userId": "someuserId",
     "cargo":[
         {
             "url": "url1",
             "comments": [
                 "something",
                 "another"
             ]
         },
         {
             "url": "url2",
             "comments": [
                 "something else, "yetmore"]
         }
  ]}
*/

function findEntry(url, cargoArray) {
  var result;
  var e;
  for (var i=0; i< cargoArray.length; i++) {
    e = cargoArray[i];
    if (e.url === url) {
      return e;
    }
  }
  return result;
}
function _addToStash(userId, url, comment, callback) {
  console.log("ADDTOSTASH "+userId, url, comment);
  var undefined;
  var myStash = Stash.findOne({_id:userId});
  console.log("STARTINGSTASH "+JSON.stringify(myStash));
  var cargo,
      entry,
      comments;
  if (!myStash) {
    console.log("STASH-1 ");
    myStash={};
    myStash._id = userId;
    cargo = [];
    entry = {};
    entry.url = url;
    comments = [];
    comments.push(comment);
    entry.comments = comments;
    cargo.push(entry);
    myStash.cargo = cargo;
    Stash.insert(myStash);
  } else {
    cargo = myStash.cargo;
    entry = findEntry(url, cargo);
    console.log("STASH-2 "+entry);
    if (!entry) {
        // we have cargo, but no entry for this URL
        console.log("STASH-3 ");
        entry = {};
        entry.url = url;
        comments = [];
        comments.push(comment);
        entry.comments = comments;
        console.log("STASH-4 "+JSON.stringify(entry));
        cargo.push(entry);
        myStash.cargo = cargo;
      } else {
        // here we have an entry
        console.log("STASH-5 ");
        comments = entry.comments;
        comments.push(comment);
        entry.comments = comments;
        cargo.push(entry);
        myStash.cargo = cargo;
      }
      Stash.update({ _id: userId }, myStash);
      console.log("UPDATEDSSTASH "+JSON.stringify(myStash));

    }
  return callback(undefined, undefined);
}
var wrappedAddToStash = Meteor.wrapAsync(_addToStash);
Meteor.methods({

  addToStash: function(userId, url, comment) {
    return wrappedAddToStash(userId, url, comment);
  }

});
