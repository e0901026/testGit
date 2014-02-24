// Accompanying JS file for the page edit template.
// Describes the page's metadata and actions.

Template.slide_default_edit.events = {
  'submit #pageEditForm': events.savePage,
  'click #deletePage': events.showDeletePageModal,
  'click .delete-page': events.deletePage
};

// TODO: doesn't work 
if (Meteor.status().status == 'connected') {
//Offline.Collection = Meteor.Collection;
}





