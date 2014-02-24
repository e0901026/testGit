

Template.slide_default_slideedit.created = function() {
  $(window).off('resize');
  $(window).resize(function(e) {
    utils.setOverlayFrameAspectRatio();
  });
};

// Accompanying JS file for the page edit template.
// Describes the page's metadata and actions.

$('.attach-image').live('click', function(){
  filepicker.setKey('A9G4KqAfThmRBA9LtRNIQz');
  
  // Alternatively, key can be obtained from the Settings
  //filepicker.setKey(Settings.findOne().filepickerKey);
  
  filepicker.pickAndStore({mimetype:"image/*"},
    { location:"S3", access: "public" }, 
     function(InkBlob){
     var newImgUrl = 'http://buorre.presis.s3.amazonaws.com/' + InkBlob[0].key;
     var newImg = $('section.editable.present').append('<div class="embedded-image-wrapper"><img src="' + newImgUrl + '" class="embedded-image"></div>');
    });
});

// Image toolbar buttons
$('.btn.image-resize').live('click', function(e){
  $('img.embedded-image.selected').resizable({
    aspectRatio: true,
    stop: function(e, ui) {
      // Synchronizing width and height to the wrapper element
      
      var width = $(e.target).css("width");
      var height = $(e.target).css("height");
      
      $(e.target).parent().css({width: width, height: height});
      
    }
  });
});

// Delete currently selected image
$('.btn.image-delete').live('click', function(e){
  $('img.embedded-image.selected').remove();
  $('.embedded-image-toolbar').hide();
});

// Setting current image url as the current slide background
$('.btn.image-make-background').live('click', function(e){
  $('img.embedded-image.selected').parent().parent().attr('data-background-image', $('img.embedded-image.selected').attr('src'));
  console.log('New bg is set');
  
  $('.state-background').css('background-image', ('url(' + $('img.embedded-image.selected').attr('src') + ')'));
  
});

$('.btn.slide-bg-reset').live('click', function(e){
  $('.state-background').css('background-image', '').addClass('slide-default-gradient');
});

Template.slide_default_slideedit.events = {
  'submit #pageEditForm': events.savePage,
  'click #deletePage': events.showDeletePageModal,
  'click .delete-page': events.deletePage,
  
  // Selecting images on slide
  'click .embedded-image': function(e) {
    if($(e.target).hasClass('selected')) {
      $(e.target).removeClass('selected');
      $('.embedded-image-toolbar').hide();
    } else {
      $(e.target).addClass('selected');
      $(e.target).parent().draggable();
      $('.embedded-image-toolbar').show();
    }
  },
  
  'click .iframe-embed-container': function(e) {
    if($(e.target).hasClass('selected')) {
      $(e.target).removeClass('selected');
      $(e.target).resizable('destroy');
      $(e.target).draggable('destroy');
      $('.embedded-image-toolbar').hide();
    } else {
      $(e.target).addClass('selected');
      $(e.target).resizable();
      $(e.target).draggable();
      $('.embedded-image-toolbar').show();
    }
  },
  
  'click .iframe-embed-container.overlay': function(e) {
    console.log('Overlay click detected');
  },
  
  // Move selected image
  'click .btn.image-move': function (e) {
    $('.selected').parent().draggable();
  },
  
  'click .insert-iframe-code': function(e){
    console.log($('.iframe-code-area').val());
    $('#myModal').hide();
    $('section.editable.present').append('<div class="iframe-embed-container"  class="ui-widget-content">' + $('.iframe-code-area').val() + '</div>');
    $(".iframe-embed-container").resizable({
        helper: "ui-resizable-helper"
    });
    $(".iframe-embed-container").draggable();
    setIframeEmbedContainerBorder();
  }
};

function setIframeEmbedContainerBorder() {
  console.log("Setting iframe embed container border");
  $('.iframe-embed-container').css('border', '15px dotted #efefef');
};

// Removing selection from the image if clicked outside
$(document).mouseup(function (e) {
  var container = $('img.selected');
  if (!container.is(e.target) && container.has(e.target).length === 0) {
    if ($(e.target).closest('.embedded-image-toolbar').length > 0) {
      // Click is registered on image toolbar
      // not doing anything
    } else {
      // Clicked outside of image and image toolbar buttons
      // Deselecting image, hiding toolbar
      $('img.selected').removeClass('selected');
      $('.embedded-image-toolbar').hide();
    }
  } 
});

// Slide copy functionality
$('button.slide-copy').live('click', function (e) {
  Session.set('slide-copy-position', Reveal.getIndices());
  
  // Using little trick to copy the html content of the selected
  // jQuery object
  Session.set('slide-copy-content', $('<div>').append($(Reveal.getCurrentSlide()).clone()).html());
  
  // Copy notification
  $.pnotify({
    text: "Slide copied to clipboard",
    type: 'success',
    icon: false,
    addclass: "stack-bottomright",
		stack: utils.pnotify_stack_bottomright
  });
});

// Slide paste functionality
$('button.slide-paste').live('click', function (e) {
  var copySlide = Session.get('slide-copy-content');
  if(copySlide) {
    newSlideContent = Session.get('slide-copy-content');
    $(newSlideContent).insertAfter('.stack.present');
    
    // Navigate to a new slide
    Reveal.right();
  
    // Copy notification
    $.pnotify({
      text: "Slide inserted from clipboard. Don't forget to save changes.",
      type: 'success',
      icon: false,
      addclass: "stack-bottomright",
  		stack: utils.pnotify_stack_bottomright
    });  
  }
});

// TODO: proper offline / online mode support
if (Meteor.status().status == 'connected') {
  //console.log('Offline collection = Meteor collection');
  
  //Offline.Collection = Meteor.Collection;
}

// Check offline staus

Template.slide_default_slideedit.offline = function() {
  return Meteor.status().status !== 'connected';
};

Template.slide_default_slideedit.rendered = function() {
  Session.set('mode', 'edit');
  
  setIframeEmbedContainerBorder();
  
  // Enable toolbars and buttons
  $('div[data-direction=right]').show();
  $('div[data-direction=bottom]').show();
  $('.slide-toolbar').show();
    
  head.js('/jquery.ui.touch-punch.js');
  
  utils.menyInit();
  $('div.meny-arrow').css('opacity', 1);


    
    
    //asyncrously load reveal js and initialize it.
    head.js('/reveal.min.js', function(){ 
      Reveal.initialize({
        transition: 'none',
        center: false,
        hideAddressBar: true
      });
      utils.initSlidesBackground();
      utils.initSlidesBackgroundListener();
      utils.restoreCurrentSlideIndices();
      utils.setOverlayFrameAspectRatio();
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

          
          jQuery(document).ready(function() {            
            rangy.init();
            
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




