/** What BacksideServlet sends for a user
 *  data starts at "data.cargo"
 {
     "statusCode": 200,
     "content": "{\"rMsg\":\"ok\",\"rToken\":\"537eb129-382f-4259-b428-005eb079951c\",\"cargo\":{\"uGeoloc\":\"|\",\"uEmail\":\"joe@sixpack.com\",\"uHomepage\":\"\",\"uName\":\"joe\",\"uFullName\":\"Joe Sixpack\",\"uRole\":\"rur, rfr\",\"uAvatar\":\"\"}}",
     "headers": {
         "date": "Wed, 02 Sep 2015 01:06:06 GMT",
         "content-type": "application/json; charset=UTF-8Access-Control-Allow-Origin: http://localhost:8080/",
         "content-length": "199",
         "server": "Jetty(9.2.11.v20150529)"
     },
     "data": {
         "rMsg": "ok",
         "rToken": "537eb129-382f-4259-b428-005eb079951c",
         "cargo": {
             "uGeoloc": "|",
             "uEmail": "joe@sixpack.com",
             "uHomepage": "",
             "uName": "joe",
             "uFullName": "Joe Sixpack",
             "uRole": "rur, rfr",
             "uAvatar": ""
         }
     }
 }*/
var undefined;

/**
 * Base64 copied from node-browser-compat/btoa on github
 * @param str (a password)
 * @return base64
 */
function btoa(str) {
  console.log("BTOA1 "+str);
  var buffer = new Buffer(str.toString(), 'binary');
  console.log("BTOA2 "+buffer);
  return buffer.toString('base64');
}

function doCall(method, urx, jsonQuery, options, callback) {
  console.log("DOCALL- "+method);
  var error,
      result;
  var baseURL = Meteor.settings.backsideURL+urx+JSON.stringify(jsonQuery);
  console.log("DOCALL1 "+baseURL);
  try {
    Meteor.http.call(method, baseURL, options, function(err, rslt) {
      console.log("DOCALL2 "+err+" | "+rslt);
      error = err;
      var rx = rslt;
      console.log("DOCALL2A "+JSON.stringify(rx));
      if (error === undefined || error === null) {
        //return data because we might need rToken and cargo
        rx = rslt.data;
        if (rx) {
          console.log("DOCALL3 "+jsonQuery.verb+"|"+JSON.stringify(rx));
        }
      }
      return callback(err, rx);
    });
  } catch (err) {
    console.log("DOCALL 5 "+JSON.stringify(err));
    return callback(error, result);
  }
}

var wrappedCall = Async.wrap(doCall);

Meteor.methods ({
  /**
   *Authenticate a user
   * #param userEmail
   * @param password
   * @return (error, userProfile)
   */
  login: function(userEmail, password) {
    var urx = 'auth/',
        tok = userEmail+':'+password,
        verb = Meteor.call('AUTHENTICATE'),
        query = Meteor.call('getCoreQuery', verb, "SystemUser", '', null);
    var options = {};
    options.auth = tok;
    console.log("LOGIN "+userEmail);
    var x = {};
    x._id=userEmail;
    //NOTE that if login fails at wrappedCall, there is an exception tossed
    // and stack trace right here, even though Call actually ran and returned
    // an error message, etc.
    return wrappedCall("GET", urx, query, options);
    // what the auth looks like to BacksideServlet
    // Basic am9lQHNpeHBhY2suY29tOmpvZQ==
  },

  /**
   * Validate a new user's candidate handle, which must be
   * <em>unique</em> in the topic map as a topic locator.
   * @param handle
   * @return boolean  <code>true</code> if unique
   */
  validateHandle: function(handle) {
    var urx = 'auth/',
        verb = Meteor.call('VALIDATE'),
        query = Meteor.call('getCoreQuery', verb, handle, '', null),
        options = {};
    return wrappedCall("GET", urx, query, options);
  },

  /**
   * Register a new user account, which also creates a topic in the topic map
   * for that user.
   * @param email  required
   * @param fullName required
   * @param handle required
   * @param password required
   * @param avatar  can be <code>null</code>
   * @param homepage (URL) can be <code>null</code>
   * @param latitude (geo) can be <code>null</code>
   * @param longitude (geo) can be <code>null</code>
   * @return (error)
   */
  signup: function(email, fullName, handle, password, avatar,
                  homepage, latitude, longitude) {
    var verb, query;
    var options = {};

    if (!Meteor.call('isInvitationOnly')) {
      verb = Meteor.call('NEW_USER');
      query = Meteor.call('getCoreQuery', verb, 'SystemUser', '', null);
      query.uEmail = email;
      query.uName = handle;
      query.uFullName = fullName;
      if (avatar === null) {
        query.uAvatar = '';
      } else {
        query.uAvatar = avatar;
      }
      query.uPwd = btoa(password);
      if (longitude === null) {
        query.uGeoLoc = '';
      } else {
        query.uGeoloc = latitude + "|" + longitude;
      }
      query.uHomepage = ''; // TODO
      //query.uHomepage = encodeURI(homepage);
      console.log("SIGNUP "+JSON.stringify(query));
      return wrappedCall("POST",'user/', query, options);
    } else {
      //first check to see if email is on invitation list
    }

  },

  /**
   * Add an <code>email</code> to the invited database
   * @param email
   * @return (error)
   */
  createInvite: function(email) {
    var urx = 'admin/',
        verb = Meteor.call('NEW_INVITE'),
        query = Meteor.call('getCoreQuery', verb, "SystemUser", '', null);
        query.uEmail = email;
        options = {};
    return wrappedCall("POST", urx, query, options);
  },

  /**
   * Remove a <code>email</code> from the invited database
   * @param email
   * @return (error)
   */
  removeInvite: function(email) {
    var urx = 'admin/',
        verb = Meteor.call('REMOVE_INVITE'),
        query = Meteor.call('getCoreQuery', verb, "SystemUser", '', null);
        query.uEmail = email;
        options = {};
    console.log("USER.removeInvite "+JSON.stringify(query));
    return wrappedCall("POST", urx, query, options);
  },

  listInvites: function() {
    var urx = 'admin/',
        verb = Meteor.call('LIST_INVITES'),
        query = Meteor.call('getCoreQuery', verb, "SystemUser", '', null);
        options = {};
    return wrappedCall("GET", urx, query, options);
  },

  /**
   * For admin messing with roles
   */
  listUsers: function(start, count) {
    var urx = 'admin/',
        verb = Meteor.call('LIST_USERS'),
        query = Meteor.call('getCoreQuery', verb, "SystemUser", '', null);
        query.from = start;
        query.count = count;
        options = {};
    console.log("Users.ListUsers "+JSON.stringify(query));
    var result = wrappedCall("GET", urx, query, options);
    console.log("Users.listUsers+ "+JSON.stringify(result));
    return result;
  },

  fetchUser: function(email) {
    var urx = 'user/',
        verb = Meteor.call('GET_USER'),
        query = Meteor.call('getCoreQuery', verb, "SystemUser", '', null);
        query.uEmail = email;
        options = {};
    return wrappedCall("GET", urx, query, options);
  },

  /**
   * for admins only
   * @param userId -- NOT the id of the logged in user; rather the user being updated
   * @param jsonUserRole  a [] filled with roles
   */
  updateUserRole: function(userId, jsonUserRole) {
    var urx = 'admin/',
        verb = Meteor.call('UPDATE_ROLE'),
        query = Meteor.call('getCoreQuery', verb, "SystemUser", '', null);
        query.uRole = jsonUserRole;
        query.uName = userId;
        options = {};
    return wrappedCall("POST", urx, query, options);
  },
///////////////////////////////
// User Profile
///////////////////////////////
  /**
   * for users
   */
  changeUserEmail: function(userId, newEmail) {
    var urx = 'admin/',
        verb = Meteor.call('UPDATE_EMAIL'),
        query = Meteor.call('getCoreQuery', verb, userId, '', null);
        query.uEmail = newEmail;
        options = {};
    return wrappedCall("POST", urx, query, options);
  },

  changeUserPassword: function(userId, newPwd) {
    var urx = 'user/',
        verb = Meteor.call('UPDATE_PASSWORD'),
        query = Meteor.call('getCoreQuery', verb, userId, '', null);
        query.uPwd = btoa(newPwd);
        options = {};
    return wrappedCall("POST", urx, query, options);
  },

  changeUserHomepage: function(userId, newURL) {

  },

  changeUserGeolocation: function(userId, newLatitude, newLongitude) {

  }

});
