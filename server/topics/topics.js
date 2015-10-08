/**
 * Returns a JSON ball which includes the results
 * @param jsonQuery a query string built according to BacksideServlet requirements
 * @oaran cakkbacj (error, result)
 */
function doGet(locator, jsonQuery, callback) {
  console.log("DOGET- ");
  var error;
  var baseURL = Meteor.settings.backsideURL+"tm/"+JSON.stringify(jsonQuery);
  console.log("DOGET "+baseURL);
  //TODO
  // Meteor hurls chunks if a 404 not found is returned
  // Need to bury this inside a try-catch to see if that
  // can be caught and worked around
  Meteor.http.get(baseURL, function(err, rslt) {
    console.log("DOGET2 "+err+" "+rslt);
    if (rslt) {
      console.log("DOGET3 "+JSON.stringify(rslt));
    }
    return callback(err, rslt);
  });

  //returns the full data package
  //actual result is response.data.cargo
  //if now found, returns something like this:
  //  {"rMsg":"Not found","rToken":""}  withstatus code 404
}

function doCall(method, urx, jsonQuery, options, callback) {
  console.log("DOCALL- "+method);
  var error,
      result;
  var baseURL = Meteor.settings.backsideURL+urx+
          encodeURIComponent(JSON.stringify(jsonQuery));
  console.log("DOCALL1 "+baseURL);
  try {
    Meteor.http.call(method, baseURL, options, function(err, rslt) {
      console.log("DOCALL2 "+err+" | "+rslt);
      error = err;
      var rx = rslt;
      console.log("DOCALL2A "+JSON.stringify(rx));
      if (error === undefined || error === null) {
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

/**
 * @param locdator
 * @param userId
 * @param userIP  -- the IP address of this client
 * @param sToken can be <code>null</code> until user authenticates
 * @param callback (error, result)
 */
function _grabTopic(locator, userId, userIP, sToken, callback) {
  console.log("GRABBING "+locator);
  var unDefined,
      error,
      lox = locator;
      result = {}; //for testing
  result.message = locator +"not found";
  console.log('Fetching '+lox);
    var userId = userId,
        verb = Meteor.call('GET_TOPIC'),
        userIP = userIP,
        sToken = sToken;
    console.log("FetchingTopic2 "+verb);

    var query = Meteor.call('getCoreQuery', verb, userId, userIP, sToken);
    query.lox = locator; //lox is constants.TOPIC_LOCAtoR
    console.log('Query1 '+JSON.stringify(query));
    doGet(locator, query, function(_error, _result) {
      result = _result;
      try {
        if (result !== null && result.cargo) {
          result = result.cargo;
        }
      } catch (err) {}
      error = _error;
      return callback (error, result);
      if (result) {
        console.log("FetchingTopic3 "+JSON.stringify(result));
      }

    });
}

var wrappedGrabTopic = Async.wrap(_grabTopic);

Meteor.methods ({

  /**
   * Fetch a topic identified by <code>locator</code>
   * @param locator
   * @param userId
   * @param userIP
   * @param sToken can be <code>null</code>
   */
  grabTopic: function(locator, userId, userIP, sToken) {
    console.log("xGRABBING- "+locator);
    return wrappedGrabTopic(locator, userId, userIP, sToken);
  },

  getTopicByURL: function(url, userId, userIP, sToken, callback) {
    var urx = 'tm/',
        verb = Meteor.call('GET_TOPIC_BY_URL'),
        query = Meteor.call('getCoreQuery', verb, userId, userIP, sToken);
        query.url = url;
        options = {};
    console.log("GETBYURL "+JSON.stringify(query));

    var result =  wrappedCall("GET", urx, query, options);
    console.log("GETBYURL+ "+JSON.stringify(result));
    return result;
  },

  /**
   * If a bookmark node exists for the given <code>url</code>, return it.
   * Otherwise, create a new bookmark node and return it.
   * @param url
   * @param title
   * @param language
   * @param tagLabelArray  can be empty array or null
   * @param userId
   * @param userIP
   * @param sToken
   * @param callback
   */
  findOrCreateBookmark: function(url, title, language, tagLabelArray,
        userId, userIP, sToken, callback) {
    console.log("FOCB "+url+" | "+title+" | "+language+" | "+tagLabelArray+
        " | "+userId+" | "+userIP+" | "+sToken);
    var urx = 'tm/',
        verb = Meteor.call('FIND_OR_CREATE_BOOKMARK'),
        query = Meteor.call('getCoreQuery', verb, userId, userIP, sToken);
        query.url = url;
        query.label = title;
        query.Lang = language;
        if (tagLabelArray !== null)
          query.ListProperty = tagLabelArray;
        options = {};
    console.log("FindOrCreateBookmark "+JSON.stringify(query));
    var result = wrappedCall("POST", urx, query, options);
    console.log("FindOrCreateBookmark+ "+JSON.stringify(result));
    return result;
  },

  /**
   * Does not really return anything except a success message unless errors
   * @param bookmarkLocator -- the bookmark node for which tags are related
   * @param tagLabelArray -- a list of tagLabel strings
   * @param language
   * @param userId
   * @param userIP
   * @param sToken
   * @param callback
   */
  findOrProcessTags: function(bookmarkLocator, tagLabelArray, language, userId,
          userIP, sToken, callback) {
    var urx = 'tm/',
        verb = Meteor.call('FIND_OR_PROCESS_TAG'),
        query = Meteor.call('getCoreQuery', verb, userId, userIP, sToken);
        query.lox = bookmarkLocator;
        query.ListProperty = tagLabelArray;
        query.Lang = language;
        options = {};
    console.log("FindOrProcessTag "+JSON.stringify(query));
    var result = wrappedCall("POST", urx, query, options);
    console.log("FindOrProcessTag+ "+JSON.stringify(result));
    return result;
  },

  listUserTopics: function(start, count, userId, userIP, sToken) {
    var urx = 'tm/',
        verb = Meteor.call('LIST_USERS'),

        query = Meteor.call('getCoreQuery', verb, userId, userIP, sToken);
        query.from = start.toString();
        query.count = count.toString();
        query.localVerb = "ListUsers";
        options = {};
    return wrappedCall("GET", urx, query, options);
  },

  listInstanceTopics: function(typeLocator, start, count, userId, userIP, sToken) {
    var urx = 'tm/',
        verb = Meteor.call('LIST_INSTANCE_TOPICS'),
        query = Meteor.call('getCoreQuery', verb, userId, userIP, sToken),
        options = {};
        query.from = start.toString();
        query.count = count.toString();
        query.inOf = typeLocator;
        return wrappedCall("GET", urx, query, options);
  },

  listSubclassTopics: function(superClassLocator, start, count, userId, userIP, sToken) {
    //TODO
  },

  submitNewInstanceTopic: function(jsonTopic, userId, userIP, sToken, callback) {
    console.log("SubmitNewInstanceTopic "+jsonTopic+" "+userId+" "+userIP+" "+sToken);
    var urx = 'tm/',
        verb = Meteor.call('NEW_INSTANCE_TOPIC'),
        query = Meteor.call('getCoreQuery', verb, userId, userIP, sToken),
        options = {};
    query.cargo = jsonTopic;
    console.log("SubmitNewInstanceTopic+ "+JSON.stringify(query));
    return wrappedCall("POST", urx, query, options);
  },

  submitNewSubclassTopic: function(jsonTopic, userId, userIP, sToken, callback) {
    console.log("SubmitNewSubclassTopic "+jsonTopic+" "+userId+" "+userIP+" "+sToken);
    var urx = 'tm/',
        verb = Meteor.call('NEW_SUBCLASS_TOPIC'),
        query = Meteor.call('getCoreQuery', verb, userId, userIP, sToken),
        options = {};
        query.cargo = jsonTopic;
        console.log("SubmitNewSubclassTopic+ "+JSON.stringify(query));
        return wrappedCall("POST", urx, query, options);
  },

  /**
   * Ask Backside to create a new ConversationMapNode
   * @param jsonCargo must conform to cargo requirement of backside servlet
   * @param userId
   * @param userIP,
   * @param sToken,
   * @param callback -- will return the created node
   */
  submitNewConversationNode: function(jsonCargo, userId, userIP, sToken, callback) {
    var urx = 'tm/',
        verb = Meteor.call('NEW_CONVERSATION_NODE'),
        query = Meteor.call('getCoreQuery', verb, userId, userIP, sToken),
        options = {};
        query.cargo = jsonTopic;
        console.log("NewConversationNode+ "+JSON.stringify(query));
        return wrappedCall("POST", urx, query, options);
  },

  ///////////////////////////////////////////////
  // Below, we have app-specific index fetches
  // We use the concept of "localVerb" because the generalized
  // BacksideServlet is LIST_INSTANCE_TOPICS,  and that's not specific
  // enough for the function "checkVerb" defined above.
  // The process is first: remove the list object from Topics, then
  // later insert it back after the fetch, ready for the client to paint
  ////////////////////////////////////////////////
  listBookmarkTopics: function(start, count, userId, userIP, sToken) {
    console.log("ServerListBookmarkTopics-");
    console.log("ServerListBookmarkTopics-1");
    var urx = 'tm/',
        verb = 'ListInstances', //' Meteor.call('LIST_INSTANCE_TOPICS'),
        query = Meteor.call('getCoreQuery', verb, userId, userIP, sToken);
        query.from = start.toString();
        query.count = count.toString();
        query.inOf = 'BookmarkNodeType';
        query.localVerb = "ListBookmarks";
        options = {};
        console.log("ServerListBookmarkTopics "+JSON.stringify(query));
    return  wrappedCall("GET", urx, query, options);
  },

  listTagTopics: function(start, count, userId, userIP, sToken) {
    var urx = 'tm/',
        verb = 'ListInstances', //' Meteor.call('LIST_INSTANCE_TOPICS'),
        query = Meteor.call('getCoreQuery', verb, userId, userIP, sToken);
        query.from = start.toString();
        query.count = count.toString();
        query.inOf = 'TagNodeType';
        query.localVerb = "ListTags";
        options = {};
        console.log("ServerListTagTopics "+JSON.stringify(query));
    return  wrappedCall("GET", urx, query, options);
  }
});

/** What a reasonable submitNewSubclassTopic should look like
{
    "verb": "NewSub",
    "uIP": "",
    "uName": "sixer",
    "sToken": "123839d9-b324-4ca7-84c3-d53fd0edbe16",
    "cargo": {
        "lox": "MyVeryFirstSubclassTopic",
        "crtr": "sixer",
        "lang": "en",
        "label": "My very own first topic.",
        "details": "In which it will be observed that this is, in fact, the very first topic from a Meteor app, except, of course, for the user account topics.",
        "lIco": "/images/cogwheel.png",
        "sIco": "/images/cogwheel_sm.png",
        "isPrv": "F",
        "sbOf": "ClassType"
    }
}
AFTER SENDING, what is returned:

{
    "rMsg": "ok",
    "rToken": "",
    "cargo": {
        "crDt": "2015-09-04T15:30:57-07:00",
        "trCl": [
            "ClassType"
        ],
        "crtr": "sixer",
        "sbOf": [
            "ClassType"
        ],
        "lox": "MyVeryFirstSubclassTopic",
        "sIco": "/images/cogwheel_sm.png",
        "isPrv": "false",
        "_ver": "1441405857177",
        "lEdDt": "2015-09-04T15:30:57-07:00",
        "details": [
            "In which it will be observed that this is, in fact, the very first topic created by a Meteor app, except, of course, the user account topics."
        ],
        "label": [
            "My very own first topic."
        ],
        "lIco": "/images/cogwheel.png"
    }
}
*/
