
/**
 * Create a new Topic node shell
 * @param locator can be <code>null</code>
 * @param userId  required
 * @param label can be <code>null</code>
 * @param details can be <code>null</code>
 * @param language can be <code>null</code>
 * @param largeImagePath should not be, but can be <code>null</code>
 * @param smallImagePath should not be, but can be <code>null</code>
 * @param isPrivate one of <code>true</code> or <code>false</code>
 * @return
 */
function newNode(locator, userId, label, details, language,
                largeImagePath, smallImagePath, isPrivate) {
  var result = {};
  if (null !== locator) {
    result.lox = locator;
  }
  result.crtr = userId;
  if (null !== language) {
    result.Lang = language;
  } else {
    result.Lang = 'en'; // default
  }
  //TODO MUST deail with language codeds other than english
  // this means cloning the language2label system
  if (null !== label) {
    result.label = label;
  }
  //TODO same issue with language
  if (null !== details) {
    result.details = details;
  }
  if (null !== largeImagePath) {
    result.lIco = largeImagePath;
  }
  if (null !== smallImagePath) {
    result.sIco = smallImagePath;
  }
  var p = "F";
  if (isPrivate) {
    p = "T";
  }
  result.isPrv = p;
  console.log("NEWNODE "+JSON.stringify(result));
  return result;
}



/**
 * Methods for creating and manipulating Topic objects
 */
Meteor.methods({

  verySimpleTest: function() {return "Hello SimpleTest"},

  createNewInstanceTopic: function(locator, typeLocator, userId, label,
                  details, language, largeImagePath, smallImagePath,
                  isPrivate) {
    var result =  newNode(locator, userId, label, details, language,
                  largeImagePath, smallImagePath, isPrivate);
    result.inOf = typeLocator;
    console.log("CREATENEWINST "+JSON.stringify(result));
    return result;
  },

  createNewSubclassTopic: function(locator, superClassLocator, userId, label,
                  details, language, largeImagePath, smallImagePath,
                  isPrivate) {
    console.log("CREATENEWSUB "+locator+" "+superClassLocator);
    var result = newNode(locator, userId, label, details, language,
                  largeImagePath, smallImagePath, isPrivate);
    result.sbOf = superClassLocator;
    console.log("CREATEDNEWSUB "+JSON.stringify(result));
    //"{"lox":"MyVeryFirstSubclassTopic","crtr":"sixer","lang":"en",
    //"label":"My very own first topic.",
    //"details":"In which it will be observed that this is, in fact,
    //the first topic by way of a Meteor application, except, or course,
    //the user topics.","lIco":"/images/cogwheel.png",
    //"sIco":"/images/cogwheel_sm.png","isPrv":"F","sbOf":"ClassType"}"
    return result;
  }
});
