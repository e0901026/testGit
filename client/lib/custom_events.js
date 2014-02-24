//
// Save current presentation content after it has been edited
//


var saveSlides = function(direction) {
  // Remove any image selections
  $('img.selected').removeClass('selected');
  $('.iframe-embed-container.selected').removeClass('selected');
  
  // Disable draggable and resizable elements
  $('.ui-draggable').draggable('destroy');
  $('.ui-resizable').resizable('destroy');
  
 // $('.iframe-embed-container').resizable('destroy');
//  $('.iframe-embed-container').draggable('destroy');

  // Disable Hallo editor first, but only if it is enabled
  if(typeof($('section.editable').hallo)=='function') {
    $('section.editable').hallo({editable:false});
    $('.hallotoolbar').hide();
  }
    Session.set('awwx-go-offline-offline', false);
    Meteor.reconnect();
    
  // Getting html content of the presentation
  // removing extra linebreaks and whitespaces
  // from beginning and end
  var newContent = $.trim( $('.slides').html() );
  var pageData = {template: "slide_default", contents: newContent };
  
  // So we look for a page based on current slug
  var page = Pages.findOne({slug: Session.get('page-slug')});

  
  // Updating Pages collection
  // A fallback function will be called after update is complete
  // This is when we show notification and navigate to the new slide
  
  Pages.update({_id: page._id}, {$set: pageData}, function(error, count) {
    if(error) {
      $.pnotify({
        text: 'Error saving changes: ' + error.reason,
        type: 'error',
        icon: false,
        addclass: "stack-bottomright",
    		stack: utils.pnotify_stack_bottomright
      });
    } else {
      var notifyText = 'Your slide changes were saved.'
  
      switch(direction) {
      case 'right':
        notifyText += ' New slide added to the right.';
        Reveal.right();
        break;
      case 'bottom':
        notifyText += ' New slide added to the bottom.';
        Reveal.down();
        break;
      case 'remove':
        notifyText += ' Slide removed.';
      default:
        break;
      }
  
      // Success notification
      $.pnotify({
        text: notifyText,
        type: 'success',
        icon: false,
        addclass: "stack-bottomright",
    		stack: utils.pnotify_stack_bottomright
      });
    }
  });
  
  
};

$('.btn.slide-save-changes').live('click', function(e){
  saveSlides();
});

$(document).on('hallodisabled', function() {
  console.log('hallo disabled event');
});

$(document).on('hallodeactivated', function() {
  // Saving presentation changes
  console.log('hallo deactivated event');
  //saveSlides();
});

//
// Add new slide to the end of the presentation
//
$('div[data-direction=right]').live('click', function(e){
  e.preventDefault();
  
  // Figure out how much slides we have in total
  var slidesCount = $('.stack').length;
  
  var newSlideContent = '<section class="stack"><section class="editable"><h1>New slide #' + slidesCount + '</h1></section></section>';
  
  console.log('Adding new slide to the right');
  $(newSlideContent).insertAfter('.stack.present');
    
  // Save changes to DB
  saveSlides('right');
});

//
// Add new slide under the current slide
//
$('div[data-direction=bottom]').live('click', function(e){
  e.preventDefault();
  console.log('Adding new slide to the bottom');
  
  // Figure out how much slides we have in this stack
  var slidesCount = $('.stack.present > section').length;
  
  var newSlideContent = '<section class="editable"><h1>New nested slide #' + slidesCount + '</h1></section>';
  
  $(newSlideContent).insertAfter('.editable.present');
  
  // Save changes to DB
  saveSlides('bottom');
});

//
// Delete current slide
//
$('.btn.delete-slide').live('click', function(e){
  var currentSlide = Reveal.getCurrentSlide();
  
  // Check if this stack section doesn't contain any other slides
  // and remove the empty stack if so
  if ($(currentSlide).parent().children('section').length > 1) {
    // Remove current slide only
    $(currentSlide).remove();
  } else {
    // Remove the whole stack
    $(currentSlide).parent().remove();
  }
  
  saveSlides('remove');
});

//
// Duplicate current slide in the same stack
//
$('.btn.duplicate-slide-down').live('click', function(e){
  $(Reveal.getCurrentSlide()).clone().insertAfter(Reveal.getCurrentSlide());
  saveSlides('bottom');
});

//
// Duplicate current slide to a new parallel stack
//
$('.btn.duplicate-slide-right').live('click', function(e){    
    var newSlideContent = '<section class="stack"><section class="editable">' + $(Reveal.getCurrentSlide()).html() + '</section></section>';
  
    console.log('Copying slide to the right');
    $(newSlideContent).insertAfter('.stack.present');
    
    // Save changes to DB
    saveSlides('right');
});




