// Accompanying JS file for the header template.
// Describes the page's metadata and actions.


Template.header.offline = function() {
  return Meteor.status().status !== 'connected';
};

Template.header.rendered = function() {
  
  // Set page title
  document.title = utils.getSetting('siteName');


  // Remove mobile/desktop loginButtons (having two {loginButtons} loaded causes errors with accounts-ui-bootstrap-dropdown)
  if($('.mobile-login').is(":visible")) {
    $('.desktop-login').remove();
  } else {
    $('.mobile-login').remove();
  }

  // FIXME: Find out why this template is being re-rendered e.g. when clicking login buttons ({{#isolate}} does not help)
  if(!this.headerRendered) {
    // Fade in the page
    $(".loading-overlay").fadeOut('slow', function() {
     $("#contents").hide().removeClass('hidden').fadeIn('slow');

   });

    this.headerRendered = true;
  };

  head.js('/screenfull.min.js', function(){  

   $( "#fullscreen" ).show();


   $('#fullscreen').click(function () {

    screenfull.toggle();

  });

      // trigger the onchange() to set the initial values
      screenfull.onchange();

    }); 
}

Template.header.events = function() {
  $(function() {
    $('#menu').mmenu();
  });
}

Template.header.helpers({
  displayName: function(){
    var user = Meteor.user();
    return (user.profile && user.profile.name) || user.username || (user.emails && user.emails[0] && user.emails[0].address);
  },
  loading : function() {
    return Session.get('loading');
  }
});

Template.header.headerNav = function () {
  var nav = Navigation.findOne({location: "header_active"});
  if (nav) return nav.pages;
  return false;
};

Template.header.pages = function () {
  
  // Return only presentations appropriate to the current user
  //utils.listAvailablePages();
  return Pages.find();
};