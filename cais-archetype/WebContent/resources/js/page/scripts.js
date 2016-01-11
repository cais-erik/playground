/* CAIS script fixes */

jQuery(document).ready(function($) {
 
  // two possible heights
  var proportion_width = ($('body').hasClass('.front') || $('body').hasClass('.page-user')) ? 0.6171875: 0.5390625;
  var proportion_height = ($('body').hasClass('.front') || $('body').hasClass('.page-user')) ? 1.620253165: 1.855072464;
  
  var page_height = $('#page').height() + 130, screen_height = $(window).height(), screen_width = $(window).width(), bg_width = screen_width, bg_height = Math.round(bg_width * proportion_width);

  $('#page-background').css({'height': page_height + 'px', 'width': screen_width + 'px'});  
  //$('#page-background').hide();
  //alert(page_height);
  // fill page width with background image proportionately  
  if(screen_width > 1280) {
    //alert(screen_width);
    //$('body>#page').css('background-size', bg_width + 'px ' + bg_height + 'px');
    $('#page-background-image').css({'width': bg_width + 'px', 'height': bg_height + 'px', 'left': 0});
    //$('#page-background').delay(0).fadeIn(0);
  }
  // fill page height with background image proportionately
  if((page_height > bg_height) || (screen_width < screen_height)) {
    //alert(screen_width);
    bg_width = Math.round(page_height * proportion_height);
    bg_left = Math.round((bg_width - screen_width)/2);
    //$('body>#page').css('background-size', bg_width + 'px ' + page_height + 'px');
    $('#page-background-image').css({'width': bg_width + 'px', 'height': page_height + 'px', 'left': -bg_left + 'px'});
    //$('#page-background').delay(0).fadeIn(0);
  }
    
  $(window).resize(function() {
    screen_width = $(window).width();
    screen_height = $(window).height();
    bg_width = screen_width;
    bg_height = Math.round(bg_width * proportion_width);
    page_height = $('#page').height() + 130;

    $('#page-background').css({'height': page_height + 'px', 'width': screen_width + 'px'});  
    
    //alert(screen_width);
    // fill page width with background image proportionately
    if(screen_width > 1280) {
      //$('body>#page').css('background-size', bg_width + 'px ' + bg_height + 'px');
      //$('#page-background').css({'background-size': bg_width + 'px ' + bg_height + 'px', 'height': page_height + 'px'});
      $('#page-background-image').css({'width': bg_width + 'px', 'height': bg_height + 'px', 'left': 0});
    } 
    
    // fill page height with background image proportionately
    if((page_height > bg_height) || (screen_width < screen_height)) {
      //alert(screen_width);
      bg_width = Math.round(page_height * proportion_height);
      bg_left = Math.round((bg_width - screen_width)/2);
      //$('body>#page').css('background-size', bg_width + 'px ' + page_height + 'px');
      //$('#page-background').css({'background-size': bg_width + 'px ' + page_height + 'px', 'height': page_height + 'px'});
      $('#page-background-image').css({'width': bg_width + 'px', 'height': page_height + 'px', 'left': -bg_left + 'px'});
    }     
  });

$('#webform-component-resume').mouseenter(function() {
  $('#webform-client-form-39 #webform-component-upload a').css('color', '#fff');
}).mouseleave(function() {
  $('#webform-client-form-39 #webform-component-upload a').css('color', '#7AC7EA');
});

});


 
