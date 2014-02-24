// Utility methods common to many scripts

utils = {
  // Method for in-code parsing LESS CSS
  parseLess: function(source) {
    var parser = new less.Parser;
    
    var updatedSource = ".slides {" + source + "}";
    
    // Remove all !important occurences to avoid doubles
    updatedSource = updatedSource.replace(/!important/g, '');
    
    // Traverse through the source CSS and detect all style positions
    // We need to insert '!important' for every style
    
    positions = [];
    pos = updatedSource.indexOf(";");

    while ( pos != -1 ) {
      positions.push(pos);
      pos = updatedSource.indexOf( ";", pos + 1 );
    }
    
    // Extending String prototype to allow us easy inserting
    // of the substrings
    String.prototype.splice = function( idx, rem, s ) {
      return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
    };
    
    // Inserting !important to every style via LESS variable
    if( positions.length > 0 ) {
      var delta = 0;
      _.each(positions, function (position) {
        updatedSource = updatedSource.splice(position + delta, 0, ' @imp');
        delta += 5;
      });
    }
    
    updatedSource = "@imp: ~'!important'; " + updatedSource;
    console.log(updatedSource);
    
    var cssResult;
    parser.parse(updatedSource, function (err, tree) {
        if (err) { 
          // Error notification
          $.pnotify({
            text: 'Error parsing CSS',
            type: 'error',
            icon: false,
            addclass: "stack-bottomright",
        		stack: utils.pnotify_stack_bottomright
          });
          
          return console.error(err) 
        }
        cssResult = tree.toCSS();
    });
    
    return cssResult;
  },
  listAvailablePages: function() {
    if (!Meteor.userId()) {
      // User not logged in, displaying only public presentations
      // TODO: currently also including pages with not specified privacy value
      return Pages.find({$or: [{"privacy": "public"}, {"privacy": null}]});
    } else if (Roles.userIsInRole(Meteor.userId(), ['admin', 'author'])) {
      // Return all presentations for admins and authors
      // Assuming that there is one organization per instance
      // and authors belongs to the same organizations
      //
      // TODO: Need to implement presentation ownership at some point
      return Pages.find();
    } else if (Roles.userIsInRole(Meteor.userId(), ['viewer'])) {
      // Return public and registered users only presentations
      console.log("Returning public pages");
      return Pages.find({$or: [{"privacy": "registered"}, {"privacy": "public"}, {"privacy": null}]});
    } else {
      // Just return public content
      return Pages.find({$or: [{"privacy": "public"}, {"privacy": null}]});
    }
  },
  setSlideAspectRatio: function() {
    console.log('setting slide aspect ratio');
    $('.reveal').width('75%');
    $('.state-background').width('100%');
    console.log($('.reveal').width());
    $('.reveal').height($(window).width()/100.0*75/4.0*3);
    $('.state-background').height('100%');
    $('.state-background').css('left', '0');
    console.log($('.reveal').height());
  },
  
  // Overlay frame in slide editing mode
  setOverlayFrameAspectRatio: function() {
    $('#slide-frame-overlay').height($(window).width()/100.0*75/4.0*3);
  },
  saveCurrentSlideIndices: function() {
    // Save current slide to the Session
    // so we can sync the slide when in editing mode
    var currentSlideIndices = Reveal.getIndices();
    Session.set('currentSlideH', currentSlideIndices.h);
    Session.set('currentSlideV', currentSlideIndices.v);
  },
  restoreCurrentSlideIndices: function() {
    var slideH = Session.get('currentSlideH') || 0;
    var slideV = Session.get('currentSlideV') || 0;
    Reveal.slide(slideH, slideV);
  },
  initSlidesBackground: function() {
    // Initialize background of the current slide
    
    // Using Reveal.getCurrentSlide() is somewhat unreliable when reloading
    // pages
    //var slideBgImage = $(Reveal.getCurrentSlide()).attr('data-background-image');
    
    // Instead let's assume that we always need first slide in the presentation
    // when opening presentation
    
    // This doesn't work in editing mode when saving changes
    
//    var slideBgImage = $('.slides > section > section').attr('data-background-image');
    console.log(slideBgImage);
    console.log(Reveal.getIndices());
    
    var slideBgImage = $('.slides > section:nth-child(' + (Reveal.getIndices().h + 1) + ') > section:nth-child(' + (Reveal.getIndices().v + 1) + ')').attr('data-background-image');
    
    if(slideBgImage) {
      console.log('Bg image detected');
      $('.state-background').css('background-image', ('url('+ slideBgImage +')'));
      $('.state-background').addClass('background-image-scaled');
      
      console.log($('.state-background').css('background-image'));
    } else {
      console.log('Bg image NOT detected');
      
      // Default gradient background for the slides
      $('.state-background').css('background-image', '').addClass('slide-default-gradient');
    }
    
    var slideBgColor = $(Reveal.getCurrentSlide()).attr('data-background-color');
    if(slideBgColor) {
      $('.state-background').css('background-color', slideBgColor);
      $('.state-background').removeClass('slide-default-gradient');
    }
  },
  initSlidesBackgroundListener: function() {
    // set background-image when slides changed
    var stateBg = document.querySelector('.state-background');

    Reveal.addEventListener( 'slidechanged', function( event ) {
      utils.saveCurrentSlideIndices();
      
      slideBgImage = event.currentSlide.getAttribute('data-background-image');
      slideBgColor = event.currentSlide.getAttribute('data-background-color');

      if (slideBgImage) {
        console.log(slideBgImage);
        $('.state-background').css('background-image', ('url('+ slideBgImage +')'));
        $('.state-background').addClass('background-image-scaled');
        console.log($('.state-background').css('background-image'));
      } else {
        $('.state-background').css('background-image', '');
        // Default gradient background for the slides
        $('.state-background').css('background-image', '').addClass('slide-default-gradient');
      }
    
      if(slideBgColor) {
        $('.state-background').css('background-color', slideBgColor);
        $('.state-background').css('background-image', '').removeClass('slide-default-gradient');
      } else {
        $('.state-background').css('background-color', '');
      }
    
    });
  },
  
  getCurrentPage: function() {
    var page_slug = Session.get('page-slug');
    if (!page_slug)
      return {notFound: true, title: 'Sorry, we couldn\'t find the requested page'};
    return Pages.findOne({slug: page_slug});
  },
  getFormValues: function(selector) {
    var values = {};

    // Turn form into array and handle special cases
    $.each($(selector).serializeArray(), function(i, field) {
      // if (field.name == 'tags') field.value = field.value.split(',');
    	if (field.value == 'on') field.value = true;
      values[field.name] = field.value;
    });
    $.each($(selector).find(':checkbox:not(:checked)'), function(i, field) {
    	values[field.name] = false;
    });
    return values;
  },
  displayHumanReadableTime: function(timestamp){
    var a = new Date(timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = a.getMonth();
    var date = a.getDate();
    var hour = a.getHours();
    if(hour < 10) hour = "0" + hour;
    var min = a.getMinutes();
    if(min < 10) min = "0" + min;
    var sec = a.getSeconds();
    if(sec < 10) sec = "0" + sec;
    var time = date+'/'+month+'/'+year.toString().slice(2)+' @ '+hour+':'+min+':'+sec ;
    return time;
  },
  loadTemplate: function(template) {
    return Meteor.render(function () {
      return Template[ template ](); // this calls the template and returns the HTML.
    });
  },
  getSetting: function(settingName) {
    var settings = Settings.findOne();
    if (!settings || !settingName) return '';
    return Settings.findOne()[settingName];
  },
  pnotify_stack_bottomright: {
    addpos2: 300,
    animation: true,
    dir1: "up",
    dir2: "left",
    firstpos1: 25,
    firstpos2: 25,
    nextpos1: 113,
    nextpos2: 25
  },
  
  menyInit: function() {
    //asyncrously load meny js and initialize it.
    head.js('/meny.min.js', function(){ 

      // Create an instance of Meny
    window.meny = Meny.create({
    // The element that will be animated in from off screen
    menuElement: document.querySelector( '.meny' ),

    // The contents that gets pushed aside while Meny is active
    contentsElement: document.querySelector('.reveal' ),

    // [optional] The alignment of the menu (top/right/bottom/left)
    position: Meny.getQuery().p || 'left',

    // [optional] The height of the menu (when using top/bottom position)
    height: 100,

    // [optional] The width of the menu (when using left/right position)
    width: 260,

    // [optional] Distance from mouse (in pixels) when menu should open
    threshold: 40,

    // Don't use touch swipe events to open/close
    // since they are clashing with Reveal.js swipe events
    touch: false,
    
    // Only display menu via click on the dedicated button
    mouse: false
  });
  
  meny.addEventListener( 'open', function() {
    $('.toolbar-embed-multimedia').hide();
  } );

  meny.addEventListener( 'close', function() {
    $('.toolbar-embed-multimedia').show();
  } );

  // API Methods:
  // meny.open();
  // meny.close();
  // meny.isOpen();

  // Events:
  // meny.addEventListener( 'open', function(){ console.log( 'open' ); } );
  // meny.addEventListener( 'close', function(){ console.log( 'close' ); } );

  // Embed an iframe if a URL is passed in
  if( Meny.getQuery().u && Meny.getQuery().u.match( /^http/gi ) ) {
    var contents = document.querySelector( '#contents' );
    contents.style.padding = '0px';
    contents.innerHTML = '<div class="cover"></div><iframe src="'+ Meny.getQuery().u +'" style="width: 100%; height: 100%; border: 0; position: absolute;"></iframe>';
  }
});
  }
};