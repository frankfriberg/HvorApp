$(function() {
  const touchzone = $('#touchzone');
  const seatings = $('#seatings');
  const pin = $('#pin');
  const loupe = $('#loupe');
  const dot = $('#dot');

  // Global variables
  var touchHeight;
  var touchWidth;
  var touchX;
  var touchY;
  var touchPercentageX;
  var touchPercentageY;
  var mapX;
  var mapY;
  var oldInput;

  // Finds the height and width for the map image
  if (($(window).height()) / 9 > $(window).width() / 5) {
    touchWidth = $(window).width();
    touchHeight = (touchWidth / 5) * 9;
  } else {
    touchHeight = $(window).height() - 40;
    touchWidth = (touchHeight / 9) * 5;
  }

  // Sets the height of map image and width of touchzone after image is loaded
  seatings.height(touchHeight);
  touchzone.width(touchWidth);

  // Starts listener for touch down
  touchzone.on('touchstart', function(event) {
    // Prevent touch drag and select on touch
    event.preventDefault();

    // Checks for cookie and deletes tips if exists
    if (getCookie('tutorial')) {
      $('.tips').remove();
    }

    // Moves pin out of view and hides it on touch
    pin.css({
      'top': -300,
      'left': touchX
    });
    pin.addClass('hidden');

    // Hides the share button, active links and logo on touch
    $('.sharebutton, .link, .logo, #tipone, #tiptwo').removeClass('active');
  });

  // Starts listener for touch move
  touchzone.on('touchmove', function(event) {
    // Prevent touch drag and select on touch move
    event.preventDefault();

    // Gets position of touch point inside touch container
    touchX = event.changedTouches[0].pageX - touchzone.offset().left;
    touchY = event.changedTouches[0].pageY - touchzone.offset().top;

    // Calculates percentage for responsive positioning
    touchPercentageX = touchX / touchzone.width() * 100;
    touchPercentageY = touchY / touchzone.height() * 100;

    // Calculates the loupe background position to be correlating
    // to the position of the touch point
    mapX = Math.round(touchX / touchzone.width() * 500 /* map src width */ - loupe.width() / 2) * -1;
    mapY = Math.round(touchY / touchzone.height() * 900 /* map src height */ - loupe.height() / 2) * -1;

    // Makes the loupe visible
    loupe.removeClass('hidden');
    dot.removeClass('hidden');

    // Sets the position of the loupe
    loupe.css({
      'top': touchPercentageY + '%',
      'left': touchPercentageX + '%',
      'background-position-x': mapX + 'px',
      'background-position-y': mapY + 'px'
    });
  });

  // Starts listener for touch end
  touchzone.on('touchend', function(event) {
    // Prevent touch drag and select on tounch end
    event.preventDefault();

    // Limits pin position to inside touch container
    if (touchY < 0) {
      touchY = 0;
    } else if (touchY > touchzone.height()) {
      touchY = touchzone.height();
    }

    // Sets the position of the pin
    pin.css({
      'top': touchPercentageY + '%',
      'left': touchPercentageX + '%'
    });

    // Hides the loupe
    loupe.addClass('hidden');
    dot.addClass('hidden');

    // Shows the pin
    pin.removeClass('hidden');

    // Shows the share button and logo again
    $('.sharebutton, .logo, #tipone').addClass('active');
  });

  // Creates the ad and positions it relative to where the pin is
  function ad() {
    var target = $('.ad');
    if (touchPercentageY < 50) {
      target.addClass('bellow');
    }
    target.toggleClass('hidden');
  }

  // Takes a screenshot of the map with the pin and saves it as a png
  function capture() {
    html2canvas(touchzone[0], {
      async: false,
      // backgroundColor: '#FFF',
      // logging: false,
      scale: 1
    }).then(function(canvas) {
      var base64 = canvas.toDataURL('image/png');
      var png = base64.split(',')[1];
      $('#imagevalue').val(png);
    });
  }

  // Sends the form to createpage.php in realtime
  function send() {
    var formData = $('form').serialize();
    var imageInput = $('input[name="image"]').val();
    if (imageInput == "" || imageInput == oldInput) {
      return setTimeout(send, 100);
    } else {
      $.ajax({
        type: 'POST',
        url: 'createpage.php',
        async: false,
        data: formData,
        dataType: "text",
        success: function(data) {
          // $('#telegramlink').attr('href', 'https://t.me/share/url?url=http://www.hvorsitterdu.no/' + data);
          // $('#whatsapplink').attr('href', 'whatsapp://send?text=http://www.hvorsitterdu.no/' + data);
          // $('#messagelink').attr('href', 'sms:&body=http://www.hvorsitterdu.no/' + data);
          // $('.link, #tiptwo').addClass('active');
          // $('.sharebutton, #tipone').removeClass('active');
        }
      });
    }
  }

  // function createCookie(cname, cvalue, exdays) {
  //   var date = new Date();
  //   date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
  //   var expires = 'expires' + date.toUTCString();
  //   document.cookie = cname + '=' + cvalue + ';' + expires;
  // }

  // function getCookie(cname) {
  //   var name = cname + "=";
  //   var decodedCookie = decodeURIComponent(document.cookie);
  //   var ca = decodedCookie.split(';');
  //   for (var i = 0; i < ca.length; i++) {
  //     var c = ca[i];
  //     while (c.charAt(0) == ' ') {
  //       c = c.substring(1);
  //     }
  //     if (c.indexOf(name) == 0) {
  //       return c.substring(name.length, c.length);
  //     }
  //   }
  //   return "";
  // }

  // function generate() {
  //   touchWidth = 500;
  //   touchHeight = 900;
  //   seatings.height(touchHeight);
  //   touchzone.width(touchWidth);
  //   pin.removeClass("hidden");
  //
  //   // for (var y = 1; y <= (touchHeight / 25); y++) {
  //   //   for (var x = 1; x <= (touchWidth / 25); x++) {
  //     for (var y = 1; y <= 1; y++) {
  //     for (var x = 1; x <= 1; x++) {
  //       pin.css({
  //         'top': (((25 * y) - 12.5) / touchHeight) * 100 + "%",
  //         'left': (((25 * x) - 12.5) / touchWidth) * 100 + "%"
  //       });
  //       capture();
  //       send();
  //     }
  //   }
  // }

  // Hijacks the submit function so it doesn't execute default action
  // $('form').submit(function(event) {
  //   capture();
  //   send();
  //   if (!getCookie('tutorial')) {
  //     createCookie('tutorial', 'true', 60);
  //   }
  //   event.preventDefault();
  // });
});

const touchzone = $('#touchzone');
const seatings = $('#seatings');
const pin = $('#pin');
const loupe = $('#loupe');
const dot = $('#dot');

// Global variables
var touchHeight;
var touchWidth;
var touchX;
var touchY;
var touchPercentageX;
var touchPercentageY;
var mapX;
var mapY;
var oldInput;

// Finds the height and width for the map image
// if (($(window).height()) / 9 > $(window).width() / 5) {
//   touchWidth = $(window).width();
//   touchHeight = (touchWidth / 5) * 9;
// } else {
//   touchHeight = $(window).height() - 40;
//   touchWidth = (touchHeight / 9) * 5;
// }
//
// // Sets the height of map image and width of touchzone after image is loaded
// seatings.height(touchHeight);
// touchzone.width(touchWidth);

// Starts listener for touch down
touchzone.on('touchstart', function(event) {
  // Prevent touch drag and select on touch
  event.preventDefault();

  // Checks for cookie and deletes tips if exists
  if (getCookie('tutorial')) {
    $('.tips').remove();
  }

  // Moves pin out of view and hides it on touch
  pin.css({
    'top': -300,
    'left': touchX
  });
  pin.addClass('hidden');

  // Hides the share button, active links and logo on touch
  $('.sharebutton, .link, .logo, #tipone, #tiptwo').removeClass('active');
});

// Starts listener for touch move
touchzone.on('touchmove', function(event) {
  // Prevent touch drag and select on touch move
  event.preventDefault();

  // Gets position of touch point inside touch container
  touchX = event.changedTouches[0].pageX - touchzone.offset().left;
  touchY = event.changedTouches[0].pageY - touchzone.offset().top;

  // Calculates percentage for responsive positioning
  touchPercentageX = touchX / touchzone.width() * 100;
  touchPercentageY = touchY / touchzone.height() * 100;

  // Calculates the loupe background position to be correlating
  // to the position of the touch point
  mapX = Math.round(touchX / touchzone.width() * 500 /* map src width */ - loupe.width() / 2) * -1;
  mapY = Math.round(touchY / touchzone.height() * 900 /* map src height */ - loupe.height() / 2) * -1;

  // Makes the loupe visible
  loupe.removeClass('hidden');
  dot.removeClass('hidden');

  // Sets the position of the loupe
  loupe.css({
    'top': touchPercentageY + '%',
    'left': touchPercentageX + '%',
    'background-position-x': mapX + 'px',
    'background-position-y': mapY + 'px'
  });
});

// Starts listener for touch end
touchzone.on('touchend', function(event) {
  // Prevent touch drag and select on tounch end
  event.preventDefault();

  // Limits pin position to inside touch container
  if (touchY < 0) {
    touchY = 0;
  } else if (touchY > touchzone.height()) {
    touchY = touchzone.height();
  }

  // Sets the position of the pin
  pin.css({
    'top': touchPercentageY + '%',
    'left': touchPercentageX + '%'
  });

  // Hides the loupe
  loupe.addClass('hidden');
  dot.addClass('hidden');

  // Shows the pin
  pin.removeClass('hidden');

  // Shows the share button and logo again
  $('.sharebutton, .logo, #tipone').addClass('active');
});

// Creates the ad and positions it relative to where the pin is
function ad() {
  var target = $('.ad');
  if (touchPercentageY < 50) {
    target.addClass('bellow');
  }
  target.toggleClass('hidden');
}
// Takes a screenshot of the map with the pin and saves it as a png
function capture() {
  var png;
  var base64;
  html2canvas(touchzone[0], {
    async: false,
    // backgroundColor: '#FFF',
    // logging: false,
    scale: 1
  }).then(function(canvas) {
    base64 = canvas.toDataURL('image/png');
    png = base64.split(',')[1];
  });

  return png;
}

// Sends the form to createpage.php in realtime
function send() {
  var formData = $('form').serialize();
  var imageInput = $('input[name="image"]').val();
  if (imageInput == "" || imageInput == oldInput) {
    return setTimeout(send, 100);
  } else {
    $.ajax({
      type: 'POST',
      url: 'createpage.php',
      data: formData,
      dataType: "text",
      // success: function(data) {
      //   $('#telegramlink').attr('href', 'https://t.me/share/url?url=http://www.hvorsitterdu.no/' + data);
      //   $('#whatsapplink').attr('href', 'whatsapp://send?text=http://www.hvorsitterdu.no/' + data);
      //   $('#messagelink').attr('href', 'sms:&body=http://www.hvorsitterdu.no/' + data);
      //   $('.link, #tiptwo').addClass('active');
      //   $('.sharebutton, #tipone').removeClass('active');
      // }
    });
  }
}

function createCookie(cname, cvalue, exdays) {
  var date = new Date();
  date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = 'expires' + date.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires;
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var images = [];
var coordinates = [];

async function generate() {
  touchWidth = 500;
  touchHeight = 900;
  seatings.height(touchHeight);
  touchzone.width(touchWidth);
  pin.css({
    'top': (((25 * 1) - 12.5) / touchHeight) * 100 + "%",
    'left': (((25 * 1) - 12.5) / touchWidth) * 100 + "%"
  });
  pin.removeClass("hidden");

  var startTime = new Date();
  console.log("Started: " + startTime.getHours() + ":" + startTime.getMinutes() + ":" + startTime.getSeconds());
  for (var y = 1; y <= (touchHeight / 10); y++) {
    for (var x = 1; x <= (touchWidth / 10); x++) {
  // for (var y = 1; y <= 8; y++) {
  //   for (var x = 1; x <= 10; x++) {

      var node = document.getElementById('touchzone');

      await domtoimage.toPng(node)
        .then((dataUrl) => {
          // var img = new Image();
          // img.src = dataUrl;
          // images.push(img.src.split(',')[1]);
          images.push(dataUrl);
          coordinates.push("Y" + y + "X" + x);
        }).catch((error) => {
          console.log("Error: " + error);
        }).then(() => {
          pin.css({
            'top': (((10 * y) - 10) / touchHeight) * 100 + "%",
            'left': ((10 * x) / touchWidth) * 100 + "%"
          });
        }
      );
    }
  }
  var endTime = new Date();
  console.log("Ended: " + endTime.getHours() + ":" + endTime.getMinutes() + ":" + endTime.getSeconds());
}



// Hijacks the submit function so it doesn't execute default action
$('form').submit(function(event) {
  event.preventDefault();
  $.ajax({
    type: 'POST',
    url: 'generate.php',
    data: {
      images: images,
      coordinates: coordinates
    },
    success: function(data) {
      console.log(data);
    }
  });
});
