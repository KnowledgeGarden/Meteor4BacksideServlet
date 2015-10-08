/** routes to template names*/
Router.route('/simpletopics');
Router.route('/register');
Router.route('/admin');
Router.route('/layout');
Router.route('/users');
Router.route('/chat');
Router.route('/stashes');
//@see http://iron-meteor.github.io/iron-router/#route-parameters
Router.route('/userview/:id', function() {
  var id = this.params.id;
  console.log("Routing "+id);
  Session.set('UserTopicId', id);
  this.render('userview');
});
Router.route('/bookmark/:id', function() {
  var id = this.params.id;
  console.log("Routing "+id);
  Session.set('BookmarkId', id);
  this.render('bookmark');
});
Router.route('/tag/:id', function() {
  var id = this.params.id;
  console.log("Routing "+id);
  Session.set('TagId', id);
  this.render('tag');
});
Router.route('/tag/addtag/:url', function() {
  //For adding tags to a page
  var url = this.params.url;
  console.log("Routing "+url);
  Session.set('pageURL', url);
  this.render('tagForm');
});
Router.route('/errorPage/:msg', function() {
  var msg = this.params.msg;
  Session.set('ErrorMessage', msg);
  this.render('errorPage');
});
/*Router.route('/stash/:id', function() {
  var id = this.params.id;
  console.log("Routing "+id);
  Session.set('StashId', id);
  this.render('stash');
});*/

Router.route('/topic/:id', function() {
  var id = this.params.id;
  console.log("Routing "+id);
  Session.set('TopicId', id);
  this.render('topic');
});
Router.route('/tags');
Router.route('/bookmarks');
Router.route('/conversations');

Router.route('/conversation/:id', function() {
  var id = this.params.id;
  console.log("Routing "+id);
  Session.set('ConversationId', id);
  this.render('conversation');
});

Router.route('/tago/bm/:url/:title', function() {
  //This is the tag bookmarlet WebServices URL
  var url = this.params.url;
  var title = this.params.title;
  console.log("TAGO "+url+" "+title);
  Session.set('pageURL', url);
  Session.set('pageTitle', title);
  this.render('/tagForm');
});
Router.route('/tago/stash/:url', function() {
  //This is the stash bookmarlet WebServices URL
  var url = this.params.url;
  console.log("STASH "+url);
  Session.set('pageURL', url);
  this.render('/stashForm');
});
Router.route('/login');
Router.route('/logout');
Router.route('/userprofile');
Router.route('/notFound');
Router.route('/subclassTopicForm');
Router.route('/instanceTopicForm');
Router.route('/topicmap');
//By routing landingPage from here rather than calling it
// with a template call on main.html, we now liberate
// the landing page from all other pages. Otherwise,
// whatever is on landing page will paint every time an app
// is called from the menu
Router.route('', function() {
  this.render('landingPage');
});
