// Helpers (additional public functions) for Handlebars templates

// Renders the header template (delaying load until site settings are available)
Handlebars.registerHelper('renderHeader', function (block) {
  if (settingsSubscription.ready()) {
    var fragment = Template['header'](); // this calls the template and returns the HTML.
    return fragment;
  } else {
    return '';
  }
});

// Renders the footer template (delaying load until site settings are available)
Handlebars.registerHelper('renderFooter', function (block) {
  if (settingsSubscription.ready()) {
    var fragment = Template['footer'](); // this calls the template and returns the HTML.
    return fragment;
  } else {
    return '';
  }
});

// Renders a form element using a template in views/form/
Handlebars.registerHelper("formHelper", function (options) {
  if(options.hash.type == 'wysiwyg') options.hash.uniqueId = options.hash.fieldName + '_' + Math.random().toString(36).substring(7);
  // FIXME: Return error if type not valid template
  return new Handlebars.SafeString(Template[options.hash.type](options.hash));
});


// Get a setting value
Handlebars.registerHelper("humanReadableTime", function (timestamp) {
  return utils.displayHumanReadableTime(timestamp);
});

// Get a setting value
Handlebars.registerHelper("getSetting", function (settingName) {
  var settingValue = utils.getSetting(settingName);
  if (settingValue) return utils.getSetting(settingName);
	else return '';
});

// Get a boolean setting value (i.e. check a setting's truth value to determine to display block)
Handlebars.registerHelper("ifSetting", function (settingName, block) {
	var settings = Settings.findOne();
	if (!settings || !settingName) return false;
	if (settings[settingName] != false) return block(this);
});


// Return the current page object
Handlebars.registerHelper("page", function () {
  return utils.getCurrentPage();
});

// Return true if a page slug is the current page's page slug
Handlebars.registerHelper("ifCurrentPage", function (slug, block) {
  if (utils.getCurrentPage().template == slug) return block(this);
  else return false;
});

// Return true if a page privacy equals to the requested privacy value
Handlebars.registerHelper("ifCurrentPagePrivacy", function (privacyValue, block) {
  console.log("Got " + privacyValue);
  if (utils.getCurrentPage().privacy == privacyValue) {
    console.log("Current page privace matches "+ privacyValue);
    return block(this);
  }
  else return false;
});

// Custom helper to meteor-roles package to test if user is an admin
Handlebars.registerHelper("ifAdmin", function (userId, block) {
  if (Roles.userIsInRole({_id: userId}, ['admin'])) return block(this);
  else return '';
});

// Custom helper to meteor-roles package to test if user is an admin
Handlebars.registerHelper("ifAuthor", function (userId, block) {
  if (Roles.userIsInRole({_id: userId}, ['author'])) return block(this);
  else return '';
});

// Custom helper to meteor-roles package to test if user is a viewer
Handlebars.registerHelper("ifViewer", function (userId, block) {
  if (Roles.userIsInRole({_id: userId}, ['viewer'])) return block(this);
  else return '';
});

Handlebars.registerHelper("isEditMode", function(){
  return Session.get('mode') == 'edit';
});

Handlebars.registerHelper("parseLess", function(options){  
  return utils.parseLess(options.fn(this));
});