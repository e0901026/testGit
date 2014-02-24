/* init.js
 *
 * Startup code for the front-end.
 *
 */
/*Offline.subscriptions([
  ["pages"],
  ["user_list"],
  ["settings"],
  ["navigation"]
]);*/

/*Pages = new Offline.Collection("pages");
User_list = new Offline.Collection("user_list");
Settings = new Offline.Collection("settings");
Navigation = new Offline.Collection("navigation");*/

Pages = new Meteor.Collection("pages");
User_list = new Meteor.Collection("user_list");
Settings = new Meteor.Collection("settings");
Navigation = new Meteor.Collection("navigation");

// ID of currently selected page
Session.set('page-slug', null);

pagesSubscription = Meteor.subscribe('pages');
user_listSubscription = Meteor.subscribe('user_list');
rolesSubscription = Meteor.subscribe('roles');
settingsSubscription = Meteor.subscribe('settings');
navigationSubscription = Meteor.subscribe('navigation');

