/** a place for stuff */
Meteor.methods({

  replaceAll: function(word, char1, replaceChar){
    console.log("ReplaceAll "+word);
  	var myword = word; //word.valueOf();
  	return myword.replace(new RegExp(char1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(replaceChar?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):replaceChar);
  }

});
