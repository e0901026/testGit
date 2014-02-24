Template.slide_default.created = function() {
  $(window).off('resize');
  $(window).resize(function(e) {
    //utils.setSlideAspectRatio();
  });
};

// Accompanying JS file for the page template.
// Describes the page's metadata and actions.

Template.slide_default.label = 'Default Presentation Template';
Template.slide_default.description = 'Basic presentation layout';

if (Meteor.status().status == 'connected') {
  //Offline.Collection = Meteor.Collection;
}

// This important method hooks the template into the CMS
registry.pageTemplate({name: 'slide_default', label: 'Slide Default'})

Template.slide_default.rendered = function() {  
  console.log('Trying to print custom_css attr');
  console.log(this.custom_css);
  
  
  
  Session.set('mode', 'presentation');
  
  $('.iframe-embed-container').css('border', 'none');

  // Initializing Meny.js for the sidebar menu
  utils.menyInit();
  $('div.meny-arrow').css('opacity', 1);
        
  // Asyncrously load reveal js and initialize it.
  head.js('/reveal.min.js', function(){ 
      Reveal.initialize({
      backgroundTransition: 'slide',
      transition: 'default',
      hideAddressBar: true,
      center: false
      });
      utils.initSlidesBackground();
      utils.initSlidesBackgroundListener();
      utils.restoreCurrentSlideIndices();

      // Set aspect ratio
      //utils.setSlideAspectRatio();
  });

  Deps.autorun(function(){
      if (Meteor.user()){ 
          Reveal.configure({keyboard:true, history: true,  loop: true, touch: true, controls: true})
      }
      else Reveal.configure({keyboard:true,  history: true, loop: true, touch: true, controls: true})    
  })
  

  
  head.js('/rangy-core.js', function(){           
           });
  head.js('/hallo.js', function(){  

    
  jQuery('#enable').button().click(function() {
        jQuery('.editable').hallo({
          plugins: {
            'halloindicator': {},
            'halloformat': {},
            'halloheadings': {},
            'hallojustify': {},
            'hallolists': {},
            'hallolink': {},
            'hallolists': {},
            'halloreundo': {}
          },
          editable: true,
          toolbar: 'halloToolbarFixed'
        })
        .hallo('protectFocusFrom', jQuery('#enable'));
        jQuery('.editable').bind('hallomodified', function(event, data) {
            jQuery('#modified').html("Editables modified");
        });
        jQuery('.editable').bind('halloselected', function(event, data) {
            jQuery('#modified').html("Selection made");
        });
        jQuery('.editable').bind('hallounselected', function(event, data) {
            jQuery('#modified').html("Selection removed");
        });
      });

      });

    }
