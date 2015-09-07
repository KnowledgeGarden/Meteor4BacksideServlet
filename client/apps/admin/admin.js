/**
 * Session params:
 * isNotAuthenticated
 * isAuthenticated
 * sToken
 * uEmail
 * userId
 */


/**
 * @param boolean, <code>true</code> means is authenticated
 */
function handleAuthenticated(truth) {
  console.log("HANDLEAUTH "+truth);
  if (truth) {
    Session.setPersistent('isNotAuthenticated', 'F');
    Session.setPersistent('isAuthenticated', 'T');
  } else {
    Session.setPersistent('isNotAuthenticated', 'T');
    Session.setPersistent('isAuthenticated', 'F');
  }
  console.log("HANDLEAUTH+ "+Session.get('isAuthenticated'));
}
function checkAdmin(userJSON) {
  console.log("CHECKADMIN "+JSON.stringify(userJSON));
  var creds = userJSON.uRole;
  if (creds && (creds.indexOf('rar') > -1)) {
    Session.set('sToken', 'T');
  } else {
    Session.set('sToken', null);
  }
}

function authenticate(email, password, callback) {
  Meteor.call('login', email, password, function(error, rslt) {
    console.log("ADM2 "+error+" "+rslt);
    return callback(error, rslt);
  });
}

var wrappedAuthenticate = Meteor.wrapAsync(authenticate);

function validate(handle, callback) {
  Meteor.call('validateHandle', handle, function(error, rslt) {
    console.log("ADVAL "+error+" "+rslt);
    return callback(error, rslt);
  });
}

var wrappedValidate = Meteor.wrapAsync(validate);

function signup(email, fullName, handle, password, avatar,
                homepage, latitude, longitude, callback) {
  Meteor.call('signup', email, fullName, handle, password, avatar,
                  homepage, latitude, longitude, function(error, rslt) {
    console.log("ADMSUP "+error+" "+rslt);
    return (callback(error, rslt));
  });
}

var wrappedSignup = Meteor.wrapAsync(signup);

function signout(email, callback) {
  console.log("SIGNING OUT "+email);
  Meteor.call('logoutUser', email, function(err, rslt){
    console.log("SIGNED OUT+ "+err+" "+rslt);
    try {
      Session.clearPersistent();
    } catch (x) {}
    return callback(err, rslt);
  });
}

var wrappedSignout = Meteor.wrapAsync(signout);

function newInvite(email, callback) {
  console.log("NewInvite "+email);
  Meteor.call('createInvite', email, function(err, rslt){
    console.log("NewInvite+ "+err+" "+rslt);
    return callback(err, rslt);
  });
}

var wrappedNewInvite = Meteor.wrapAsync(newInvite);

function deleteInvite(email, callback) {
  console.log("DeleteInvite "+email);
  Meteor.call('removeInvite', email, function(err, rslt){
    console.log("NewInvite+ "+err+" "+rslt);
    return callback(err, rslt);
  });
}

var wrappedDeleteInvite = Meteor.wrapAsync(newInvite);

function getUser(email, callback) {
  console.log("GetUser "+email);
  Meteor.call('fetchUser', email, function(err, rslt){
    console.log("GetUser+ "+err+" "+rslt);
    return callback(err, rslt);
  });
}

var wrappedGetUser = Meteor.wrapAsync(getUser);

function changeRoles(roles, callback) {
  console.log("ChangeRoles "+roles);
  Meteor.call('updateUserRole', roles, function(err, rslt){
    console.log("ChangeRoles+ "+err+" "+rslt);
    return callback(err, rslt);
  });
}

var wrappedChangeRoles = Meteor.wrapAsync(changeRoles);

function listUsers(callback) {
  console.log("ListUsers "+roles);
  Meteor.call('listUsers', function(err, rslt){
    console.log("ListUsers+ "+err+" "+rslt);
    return callback(err, rslt);
  });
}

var wrappedListUsers = Meteor.wrapAsync(listUsers);

var undefined;

Template.login.created = function() {
  Session.set('adminErrors', {});
};

Template.logout.helpers({
  logout:  function() {
    console.log("LOGGINGOUT");
    wrappedSignout(Session.get('uEmail'), function(err, rslt) {
      console.log("DONELOGGINGOUT "+err+" "+rslt);
      Session.set('uEmail', null);
      handleAuthenticated(false);
      Router.go('/');
    });
  }
});

Template.register.created = function() {
  Session.set('adminErrors', {});
};

//Template.landingPage.created = function() {
//};

Template.login.helpers({
/*  errorMessage: function(field) {
    console.log("ERRORMESSAGE "+field);
    return Session.get('topicsErrors')[field];
  },
  errorClass: function (field) {
    console.log("ERRORCLASS "+field);
    return !!Session.get('topicSubmitErrors')[field] ? 'has-error' : '';
  }
*/
});

Template.register.helpers({
  errorMessage: function(field) {
    console.log("ERRORMESSAGE "+field);
    return Session.get('topicsErrors')[field];
  },
  errorClass: function (field) {
    console.log("ERRORCLASS "+field);
    return !!Session.get('topicSubmitErrors')[field] ? 'has-error' : '';
  },

  invitationOnly: function() {
    Meteor.call('isInvitationOnly', function(err, resp) {
      console.log("INV "+resp);
      return resp;
    });
  }
});
Template.register.events({
  'submit .validate': function(e, template) {
    e.preventDefault();
    var $unm = $(e.target).find('[name=vhandle]');
    var handle = $unm.val();
    $unm.val('');

    console.log("Validating "+handle);
    wrappedValidate(handle, function(err, rslt) {
      console.log("Validated "+JSON.stringify(rslt));
      if (!rslt) {
        var $hdl = $(document).find('[name=handle]');
        console.log("VX "+$hdl);
        if ($hdl) { $hdl.val(handle);}
      }
      $unm.val('');
    });
  },

  'submit .signup': function(e, template) {
    e.preventDefault();
    var $emx = $(e.target).find('[name=email]');
    var $pwx = $(e.target).find('[name=password]');
    var $fnm = $(e.target).find('[name=fullname]');
    var $unm = $(e.target).find('[name=handle]');
    var $avt = $(e.target).find('[name=avatar]');
    var $hmp = $(e.target).find('[name=homepage]');
    var $lat = $(e.target).find('[name=Latitude]');
    var $lnt = $(e.target).find('[name=Longitude]');
    var email = $emx.val(),
        pwd = $pwx.val(),
        handle = $unm.val(),
        fullname = $fnm.val(),
        avatar = $avt.val(),
        homepage = $hmp.val(),
        latitude = $lat.val(),
        longitude = $lnt.val();
    var errors = {};
    if (! email) {
      errors.body = "Valid email required.";
      return Session.set('adminErrors', errors);
    }
    if (! pwd) {
      errors.body = "Valid password required.";
      return Session.set('adminErrors', errors);
    }
    if (! fullname) {
      errors.body = "Valid full name required.";
      return Session.set('adminErrors', errors);
    }

    console.log("Signing up "+email+" "+handle+" "+fullname);
    wrappedSignup(email, fullname, handle, pwd, avatar,
                    homepage, latitude, longitude, function(err, rslt) {
      console.log("Signed up "+err+" | "+rslt);
      $emx.val('');
      $pwx.val('');
      $fnm.val('');
      $unm.val('');
      $avt.val('');
      $hmp.val('');
      $lat.val('');
      Router.go('/');
    });
  }
});

////////////////////////////////////////
// Login must set the Session sToken which is returned by BacksideServlet
// if the user does authenticate.
// It must also call handleAuthenticated(true) in that case
// An authenticated user's profile is iin the Users collection, indexed
// by user's email -- perhaps userEmail needs to go into session as well!!!
////////////////////////////////////////
Template.login.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var $emx = $(e.target).find('[name=email]');
    var $pwx = $(e.target).find('[name=password]');
    var email = $emx.val(),
        pwd = $pwx.val();
    var errors = {};
    if (! email) {
      errors.body = "Valid email required.";
      return Session.set('adminErrors', errors);
    }
    if (! pwd) {
      errors.body = "Valid password required.";
      return Session.set('adminErrors', errors);
    }
    console.log("ADM1 "+email+" "+pwd);
    wrappedAuthenticate(email, pwd, function(err, rslt) {
      console.log("AUTH "+err+" "+rslt);
      if (rslt) {
        console.log("AUTH2 "+JSON.stringify(rslt));
      }
      try {
        //BacksideServlet will just return an empty rToken
        // if login failed
        if (rslt.rToken && rslt.rToken !== '' && !err) {
          console.log("AUTH3 ");
          checkAdmin(rslt.cargo);
            handleAuthenticated(true);
          Session.setPersistent('sToken', rslt.rToken);
          Session.setPersistent('uEmail', email);
          Session.setPersistent('userId', rslt.cargo.uName);
          $emx.val('');
          $pwx.val('');
          Router.go('/');
        } else {
          //TODO need some kind of error message
        }
      } catch (e) {}
    });

  }
});

Template.userprofile.helpers({

  fullName: function() {
    var email = Session.get('uEmail');
    var ux = Users.findOne(email);
    console.log("PROFILEFULLNAME "+email+" "+ux);
    return ux.uFullName;
  }

});

//Template.admin.rendered = function() {
//  if (window.location.hash)
//    $('a[href="' + window.location.hash+'"]').tab('show');
//}

Template.admin.events({

  'submit .addInvite': function(e, template) {
    e.preventDefault();
    console.log("AddInvite");
    var $emx = $(e.target).find('[name=iEmail]');
    var email = $emx.val();
    if (email === '') {return;}
    wrappedNewInvite(email, function(err, rslt) {
      console.log("DID INVITE "+email+" "+err+" "+rslt);
      $emx.val('');
    });
  },

  'submit .removeInvite': function(e, template) {
    e.preventDefault();
    console.log("DelInvite");
    var $emx = $(e.target).find('[name=rEmail]');
    var email = $emx.val();
    if (email === '') {return;}
    wrappedDeleteInvite(email, function(err, rslt) {
      console.log("DID DELETE "+email+" "+err+" "+rslt);
      $emx.val('');
    });
  },

  'submit .listUsers': function(e, template) {
    e.preventDefault();
    console.log("ListUsrs");
    wrappedListUsers(function(err, rslt) {
      console.log("LISTING USERS "+JSON.stringify.rslt);
      //TODO
    });
  },

  'submit .fetchUser': function(e, template) {
    e.preventDefault();
    console.log("FetchUser");
    var $emx = $(e.target).find('[name=uEmail]');
    var email = $emx.val();
    if (email === '') {return;}
    wrappedGetUser(email, function(err, rslt) {
      console.log("FETCHUSR "+JSON.stringify(rslt));
      if (rslt) {
        //TODO get .uRole

        var roles = "test"; //TOODO
        var $rls = $(document).find('[name=uRoles]');
        $rls.val(roles);
      }
    });
  },

  'submit .changeRole': function(e, template) {
    e.preventDefault();
    console.log("ChangeRole");
    var $rls = $(e.target).find('[name=uRoles]');
    var roles = $rls.val();
    if (roles === '') {return;}
    wrappedChangeRoles(roles, function(err, rslt) {
      console.log("CHANGED ROLES");
      //TODO ???
    });
  }


});
