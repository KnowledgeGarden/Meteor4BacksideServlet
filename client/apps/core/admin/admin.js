/**
 * Session params:
 * isNotAuthenticated
 * isAuthenticated
 * isAdmin
 * sToken
 * uEmail
 * userId
 * ErrorMessage set in router
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
    Session.set('isAdmin', 'T');
  } else {
    Session.set('isAdmin', 'F');
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
    console.log("DeleteInvite+ "+err+" "+rslt);
    return callback(err, rslt);
  });
}

var wrappedDeleteInvite = Meteor.wrapAsync(deleteInvite);

/**
 * Fetch a user from the User Database (not the topic map)
 * @param email
 * @param callback
 */
function getUser(email, callback) {
  console.log("GetUser "+email);
  Meteor.call('fetchUser', email, function(err, rslt){
    console.log("GetUser+ "+err+" "+rslt);
    return callback(err, rslt);
  });
}

var wrappedGetUser = Meteor.wrapAsync(getUser);

function changeEmail(userId, newEmail, callback) {
  Meteor.call('changeUserEmail', userId, newEmail, function(err, rslt) {
    console.log("ChangedEmail "+err+" | "+rslt);
    return callback(err, rslt);
  });
}

var wrappedChangeEmail = Meteor.wrapAsync(changeEmail);

function changePassword(userId, newPassword, callback) {
  Meteor.call('changeUserPassword', userId, newPassword, function(err, rslt) {
    console.log("ChangedPassword "+err+" | "+rslt);
    return callback(err, rslt);
  });
}

var wrappedChangePassword = Meteor.wrapAsync(changePassword);

function changeRoles(userId, roles, callback) {
  console.log("ChangeRoles "+roles);
  Meteor.call('updateUserRole', userId, roles, function(err, rslt){
    console.log("ChangeRoles+ "+err+" "+rslt);
    return callback(err, rslt);
  });
}

var wrappedChangeRoles = Meteor.wrapAsync(changeRoles);

function listUsers(callback) {
  console.log("ListUsers ");
  Meteor.call('listUsers', function(err, rslt){
    console.log("ListUsers+ "+err+" "+rslt);
    return callback(err, rslt);
  });
}

var wrappedListUsers = Meteor.wrapAsync(listUsers);

function listInvites(callback) {
  Meteor.call('listInvites', function(err, rslt){
    console.log("ListInvites+ "+err+" "+rslt);
    //"cargo":["ja","jackpark@gmail.com"]}
    var result = [];
    if (rslt) {
      var c = rslt.cargo,
          struct,
          len = c.length;
      for (var i=0;i<len; i++) {
        struct={};
        struct.uEmail = c[i];
        result.push(struct);
      }
    }

    return callback(err, result);
  });

}
var wrappedListInvites = Meteor.wrapAsync(listInvites);
var undefined;


Template.login.created = function() {
  Session.set('adminErrors', {});
};

Template.logout.helpers({
  logout:  function() {
    console.log("LOGGINGOUT");
    Session.set('uEmail', null);
    try {
      Session.clearPersistent();
    } catch (x) {}
    handleAuthenticated(false);
    Router.go('/');
  }
});

Template.register.created = function() {
  Session.set('adminErrors', {});
  Meteor.call('isInvitationOnly', function(err, rslt) {
    if (rslt) {
      Session.set('InviteOnly', 'T');
    } else {
      Session.set('InviteOnly', 'F');
    }
    console.log("Register "+Session.get('InviteOnly'));
  });

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
    return (Session.get('InviteOnly') === 'T');
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

    if (! email) {
      return Meteor.call('showErrorMessage', 'Valid email required.' );
    }
    if (! handle) {
      return Meteor.call('showErrorMessage', 'Valid handle required' );
    }

    if (! pwd) {
      return Meteor.call('showErrorMessage', 'Valid password required' );
    }
    if (! fullname) {
      return Meteor.call('showErrorMessage', 'Valid full name required' );
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
      if (!rslt) {
        console.log('SUP0');
        var s = '';
        if (Session.get('InviteOnly') === 'T') {
          s = ' Invitation required';
        }
        console.log("SUP1 "+s);
        var msg = "Unable to process Registration."+s;
        msg = encodeURIComponent(msg);
        console.log("SUP2 "+msg);
        return Meteor.call('showErrorMessage', msg);
      }
      return Router.go('/');
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
          Session.setPersistent('MyUser', rslt.cargo);
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

////////////////////////////////////////
// Theoretically speaking, when a user authenticates, that
// is when we capture that user object and stash it in
// session 'MyUser' together with Session 'uEmail'
//  A user looks like this:
// {"rMsg":"ok","rToken":"","cargo":{"uGeoloc":"|","uEmail":"joe@sixpack.com",
// "uHomepage":"","uName":"joe","uFullName":"Joe Sixpack","uRole":"rur","uAvatar":""}}
////////////////////////////////////////

//profile.html
Template.userprofile.helpers({
  //TODO lots more support required

  fullName: function() {
    var ux = Session.get('MyUser');
    console.log("PROFILEFULLNAME "+JSON.stringify(ux));
    return ux.uFullName;
  },
  email: function() {
    return Session.get('uEmail');
  },
  homepage: function() {
    return ""; //TODO
  },
  latitude: function() {
    return ""; //TODO
  },
  longitude: function() {
    return ""; //TODO
  }


});

Template.userprofile.events({
  'submit .changeEmail': function(e, template) {
    e.preventDefault();
    var $uEmail = $(e.target).find('[name=uEmail]');
    var email = $uEmail.val();
    $uEmail.val('');

    console.log("Changing Email "+email);
    wrappedChangeEmail(Session.get('userId'), email, function(err, rslt) {
      console.log("ChgdEmail "+JSON.stringify(rslt));
      var x = Session.get('MyUser');
      x.uEmail = email;
      Session.setPersistent('MyUser'. x);
      Session.setPersistent('uEmail', email);
      Router.go('/userprofile');
    });
  },
  'submit .changePwd': function(e, template) {
    e.preventDefault();
    var $uPwd = $(e.target).find('[name=password]');
    var pwd = $uPwd.val();
    $uPwd.val('');

    console.log("Changing Password ");
    wrappedChangePassword(Session.get('userId'), pwd, function(err, rslt) {
      console.log("ChgdPWD "+JSON.stringify(rslt));
      Router.go('/userprofile');
    });
  }

});

//Template.admin.rendered = function() {
//  if (window.location.hash)
//    $('a[href="' + window.location.hash+'"]').tab('show');
//}
Template.admin.helpers( {
  userList: function() {
    var x = Session.get('UserListing');
    //Session.set('UserListing', null); //One shot; don't leave it around
    return x;
  },

  inviteList: function() {
    var x = Session.get('InviteListing');
    console.log("INVITATIONS "+JSON.stringify(x));
    return x;
  }

});

Template.admin.events({

  'submit .addInvite': function(e, template) {
    e.preventDefault();
    console.log("AddInvite");
    var $emx = $(e.target).find('[name=iEmail]');
    var email = $emx.val();
    //sanity checks
    if (email === '') {return;}
    if (email.indexOf('@')<0) {return;}
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
  'submit .listInvites': function(e, template) {
    e.preventDefault();
    console.log("ListUsrs");
    wrappedListInvites(function(err, rslt) {
      console.log("LISTING Invites "+JSON.stringify(rslt));
      Session.set('InviteListing', rslt);
    });
  },

  'submit .listUsers': function(e, template) {
    e.preventDefault();
    console.log("ListUsrs");
    wrappedListUsers(function(err, rslt) {
      console.log("LISTING USERS "+JSON.stringify(rslt));
      Session.set('UserListing', rslt.cargo);
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
        //{"rMsg":"ok","rToken":"",
        //"cargo":{"uGeoloc":"|",uEmail":"joe@sixpack.com","uHomepage":"",
        //"uName":"joe","uFullName":"Joe Sixpack","uRole":"rur","uAvatar":""}}"
        Session.set('ModUser', rslt.cargo);
        var roles = rslt.cargo.uRole;
        var $rls = $(document).find('[name=uRoles]');
        $rls.val(roles);
      }
    });
  },

  'submit .changeRole': function(e, template) {
    e.preventDefault();

    var $rls = $(e.target).find('[name=uRoles]');
    var roles = $rls.val();
    console.log("ChangeRole "+roles);
    if (roles === '') {return;}
    var usr = Session.get('ModUser');
    if (!usr) {return;}
    wrappedChangeRoles(usr.uName, roles, function(err, rslt) {
      console.log("CHANGED ROLES");
      Session.set('ModUser', null);
      $rls.val('');
      $(document).find('[name=uEmail]').val('');
    });
  }


});
