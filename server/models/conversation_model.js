
function createConNode(jsonCargo, userId, userIP, sToken, callback) {
  Meteor.call('submitNewConversationNode', jsonCargo, userId,
        userIP, sToken, function(err, rslt) {
    console.log("NEWCONNODE "+err+" "+JSON.stringify(rslt));
      return callback(err, rslt);
    });
}

var wrappedCreateConNode = Meteor.wrapAsync(createConNode);

function _listConversations(start, count, userId, userIP, sToken, callback) {
  Meteor.call('listInstanceTopics', 'ConversationMapNodeType', start, count,
              userId, userIP, sToken, function(err, rslt) {
                console.log('LISTCONS '+err+" | "+JSON.stringify(rslt));
                return callback(err, rslt);
              });
}
var wrappedListConversations = Meteor.wrapAsync(_listConversations);

Meteor.methods ({

  /**
   * For the index view; only lists nodes of MapType
   * @param start
   * @param count
   * @param userId
   * @param userIP
   * @param sToken
   * @param callback
   */
  listConversations: function(start, count, userId, userIP, sToken) {
    return wrappedListConversations(start, count, userId, userIP, sToken);
  },

/////////////////////////////////////////////////////
// Conversation Nodes
//  Exist in the context of conversation tree structures
//  A node can be constructed as one of:
//    A conversation root node -- typically a Conversation Map node
//       though: any node in the system, e.g. blog node, can be a
//       conversation roog
//    A child of some other conversation node
//      Recall that any node in the system can be a conversation node
//      meaning: a (e.g.) blog node could be transcluded into a conversation
//      as a child of another conversation node -- typically as an evidence node
/////////////////////////////////////////////////////
  /**
   *
   * @param locator can be <code>null</code>
   * @param parentLocator can be <code>null</code>
   * @param label  required
   * @param details can be <code>null</code>
   * @param language required
   * @param isPrivate required boolean
   * @param userId
   * @param userIP
   * @param sToken
   * @param callback
   */
  newConversationMapNode: function(locator, parentLocator, label, details, language,
                                    isPrivate, userId, userIP, sToken, callback) {
    var nodeType = Meteor.call('CONVERSATION_MAP_TYPE');
    var cargo = {};
    cargo.inOf = nodeType;
    cargo.uName = userId;
    if (locator != null)
      cargo.lox = locator;
    cargo.label = label;
    cargo.Lang = language;
    if (details != null)
      cargo.details = details;
    if (isPrivate)
      cargo.isPrv = "T";
    else
      cargo.isPrv = "F";
    if (parentLocator != null && contextLocator != null) {
      cargo.ConParentLocator = parentLocator;
      cargo.ContextLocator = contextLocator;
    }
    return wrappedCreateConNode(cargo, userId, userIP, sToken, function(err, rslt) {
      //
    });
  },

  /**
   *
   * @param locator can be <code>null</code>
   * @param parentLocator can be <code>null</code>
   * @param label  required
   * @param details can be <code>null</code>
   * @param language required
   * @param isPrivate required boolean
   * @param userId
   * @param userIP
   * @param sToken
   * @param callback
   */
  newIssueNode: function(locator, parentLocator, label, details, language,
                                    isPrivate, userId, userIP, sToken, callback) {
    var nodeType = Meteor.call('ISSUE_TYPE');
    var cargo = {};
    cargo.inOf = nodeType;
    cargo.uName = userId;
    if (locator != null)
      cargo.lox = locator;
    cargo.label = label;
    cargo.Lang = language;
    if (details != null)
      cargo.details = details;
    if (isPrivate)
      cargo.isPrv = "T";
    else
      cargo.isPrv = "F";
    if (parentLocator != null && contextLocator != null) {
      cargo.ConParentLocator = parentLocator;
      cargo.ContextLocator = contextLocator;
    }
    wrappedCreateConNode(cargo, userId, userIP, sToken, function(err, rslt) {
      //
      console.log("WCCN");
      return callback(err, rslt);
    });
  },

  /**
   *
   * @param locator can be <code>null</code>
   * @param parentLocator can be <code>null</code>
   * @param label  required
   * @param details can be <code>null</code>
   * @param language required
   * @param isPrivate required boolean
   * @param userId
   * @param userIP
   * @param sToken
   * @param callback
   */
  newPositionNode: function(locator, parentLocator, label, details, language,
                                    isPrivate, userId, userIP, sToken, callback) {
    var nodeType = Meteor.call('POSITION_TYPE');
    var cargo = {};
    cargo.inOf = nodeType;
    cargo.uName = userId;
    if (locator != null)
      cargo.lox = locator;
    cargo.label = label;
    cargo.Lang = language;
    if (details != null)
      cargo.details = details;
    if (isPrivate)
      cargo.isPrv = "T";
    else
      cargo.isPrv = "F";
    if (parentLocator != null && contextLocator != null) {
      cargo.ConParentLocator = parentLocator;
      cargo.ContextLocator = contextLocator;
    }
    return wrappedCreateConNode(cargo, userId, userIP, sToken, function(err, rslt) {
      //
    });
  },

  /**
   *
   * @param locator can be <code>null</code>
   * @param parentLocator can be <code>null</code>
   * @param label  required
   * @param details can be <code>null</code>
   * @param language required
   * @param isPrivate required boolean
   * @param userId
   * @param userIP
   * @param sToken
   * @param callback
   */
  newProArgumentNode: function(locator, parentLocator, label, details, language,
                                    isPrivate, userId, userIP, sToken, callback) {
    var nodeType = Meteor.call('PRO_TYPE');
    var cargo = {};
    cargo.inOf = nodeType;
    cargo.uName = userId;
    if (locator != null)
      cargo.lox = locator;
    cargo.label = label;
    cargo.Lang = language;
    if (details != null)
      cargo.details = details;
    if (isPrivate)
      cargo.isPrv = "T";
    else
      cargo.isPrv = "F";
    if (parentLocator != null && contextLocator != null) {
      cargo.ConParentLocator = parentLocator;
      cargo.ContextLocator = contextLocator;
    }
    return wrappedCreateConNode(cargo, userId, userIP, sToken, function(err, rslt) {
      //
    });
  },

  /**
   *
   * @param locator can be <code>null</code>
   * @param parentLocator can be <code>null</code>
   * @param contextLocator must coincide with <code>parentLocator</code>
   * @param label  required
   * @param details can be <code>null</code>
   * @param language required
   * @param isPrivate required boolean
   * @param userId
   * @param userIP
   * @param sToken
   * @param callback
   */
  newConArgumentNode: function(locator, parentLocator, contextLocator, label, details, language,
                                    isPrivate, userId, userIP, sToken, callback) {
    var nodeType = Meteor.call('CON_TYPE');
    var cargo = {};
    cargo.inOf = nodeType;
    cargo.uName = userId;
    if (locator != null)
      cargo.lox = locator;
    cargo.label = label;
    cargo.Lang = language;
    if (details != null)
      cargo.details = details;
    if (isPrivate)
      cargo.isPrv = "T";
    else
      cargo.isPrv = "F";
    if (parentLocator != null && contextLocator != null) {
      cargo.ConParentLocator = parentLocator;
      cargo.ContextLocator = contextLocator;
    }
    return wrappedCreateConNode(cargo, userId, userIP, sToken, function(err, rslt) {
      //
    });
  },

  /**
   *
   * @param url  of the resource being referenced
   * @param locator can be <code>null</code>
   * @param parentLocator can be <code>null</code>
   * @param label  required
   * @param details can be <code>null</code>
   * @param language required
   * @param isPrivate required boolean
   * @param userId
   * @param userIP
   * @param sToken
   * @param callback
   */
  newReferenceNode: function(url, locator, parentLocator, label, details, language,
                                    isPrivate, userId, userIP, sToken, callback) {
    var nodeType = Meteor.call('RESOURCE_TYPE');
    var cargo = {};
    cargo.inOf = nodeType;
    cargo.uName = userId;
    if (locator != null)
      cargo.lox = locator;
    cargo.label = label;
    cargo.Lang = language;
    if (details != null)
      cargo.details = details;
    if (isPrivate)
      cargo.isPrv = "T";
    else
      cargo.isPrv = "F";
    if (parentLocator != null && contextLocator != null) {
      cargo.ConParentLocator = parentLocator;
      cargo.ContextLocator = contextLocator;
    }
    //TODO this MUST add URL to the node and resave it
    return wrappedCreateConNode(cargo, userId, userIP, sToken, function(err, rslt) {
      //TODO
    });
  }

  /**
   * NOT YET
   * @param locator can be <code>null</code>
   * @param parentLocator can be <code>null</code>
   * @param label  required
   * @param details can be <code>null</code>
   * @param language required
   * @param isPrivate required boolean
   * @param userId
   * @param userIP
   * @param sToken
   * @param callback
   * /
  newDecisionNode: function(locator, parentLocator, label, details, language,
                                    isPrivate, userId, userIP, sToken, callback) {
    //TODO
  }
  */


});
