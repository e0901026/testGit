/*
* Sidebar Meny related logic and events handling
*/

/* Following events are necessary for the touch events 
*  Meny.js does support swipe touch gestures for opening / closing
*  but they are clashing with Reveal.js touch events and so
*  we can't use those
*/

$('div.meny-arrow').live('click', function(e) {
  window.meny.open();
  $('div.meny-arrow').hide();
});

$('h2.close-meny').live('click', function(e) {
  window.meny.close();
  $('div.meny-arrow').show();
});

$('.reveal.default').live('click', function(e) {
  window.meny.close();
  $('div.meny-arrow').show();
});

/* If Meny stops closing when touch clicking outside of the
* menubar, this is the place to fix this. Most likely the DOM
* hierarchy has changed.
*/
$('.reveal div:nth-child(2)').live('click', function(e){
  console.log('got the event');
  if( window.meny.isOpen() ) {
    window.meny.close();
    $('div.meny-arrow').show();
  }
});
