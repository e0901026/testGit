Template.page_privacy_selector.templates = function() {
  return registry.pageTemplates;
}

Template.page_privacy_selector.events = {
  'change .page-privacy-selector': function() {
    var pageData = utils.getFormValues("#pageEditForm");
    Pages.update({_id: this._id}, {$set: pageData});
  }
}