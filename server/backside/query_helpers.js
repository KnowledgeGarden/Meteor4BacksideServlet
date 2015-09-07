Meteor.methods({

  createReturnObject: function(error, result) {
    var r = {};
    r.error = error;
    r.result = result;
    return r;
  },

  validateBackside: function() {
    console.log("VALIDATE "+Meteor.settings.backsideURL);
  },
  /**
   * Create a full query where <code>cargo</code> is involved, by adding
   * a <em>cargo</em> section to <code>coreQuery</code>
   * @param coreQuery
   * @param cargo
   * @returns {*}
   */
  buildQuery: function(coreQuery, cargo) {
      var result = coreQuery;
      result.cargo = cargo;
      return result;
  },

  /**
   * Create a cire query object
   * @param verb
   * @param userId
   * @param userIP
   * @param sToken
   * @return {*}
   */
  getCoreQuery: function(verb, userId, userIP, sToken) {
    console.log("COREQUERY "+sToken);
    var query = {};
    query.verb = verb;
    query.uIP = userIP;
    query.uName = userId;
    query.sToken = sToken;
    return query;
  }

});
