let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.onload = function() {
  const touchzone = document.getElementById('touchzone');
  const seatings = document.getElementById('seatings').getBoundingClientRect();
  const pin = document.getElementById('pin');
  const loupe = document.getElementById('loupe');
  const logo = document.getElementById('logo');
  const links = document.getElementById('links');

  // Global variables
  let touchX;
  let touchY;
  let touchPercentageX;
  let touchPercentageY;
  let mapX;
  let mapY;

  // Hides target if not, and shows target if hidden
  function toggle(...elements) {
    const target = 'hidden';
    for (let element of elements) {
      if (element.classList.contains(target)) {
        element.classList.remove(target);
      } else {
        element.classList.add(target);
      }
    }
  }

  function touchstart(event) {
    // Prevent touch drag and select on touch
    event.preventDefault();

    // Moves pin out of view and hides it on touch
    pin.style.top = '-300px'

    // Hides the share button, active links, logo and pin on touch
    links.classList.add('hidden');
    toggle(pin, logo);
  }
  
  function touchmove(event) {
    // Prevent touch drag and select on touch move
    event.preventDefault();

    touchX = event.changedTouches[0].pageX;
    touchY = event.changedTouches[0].pageY;

    // Limits pin position to inside touch container
    if (touchY < seatings.top) {
      touchY = seatings.top;
    } else if (touchY > seatings.bottom) {
      touchY = seatings.bottom;
    }

    if (touchX < seatings.left) {
      touchX = seatings.left;
    } else if (touchX > seatings.right) {
      touchX = seatings.right;
    }

    // Calculates percentage for responsive positioning
    touchPercentageX = (((touchX - seatings.left) / seatings.width)) * 100;
    touchPercentageY = ((touchY - seatings.top) / seatings.height) * 100;
    // Calculates the loupe background position to be correlating
    // to the position of the touch point
    mapX = Math.round(((touchX - seatings.left) / seatings.width) * 500 - (loupe.clientWidth / 2)) * -1;
    mapY = Math.round(((touchY - seatings.top) / seatings.height) * 900 - (loupe.clientHeight / 2)) * -1;

    // Makes the loupe visible
    loupe.classList.remove('hidden');

    // Sets the position of the loupe
    if (touchPercentageY < 20) {
      loupe.style.top = seatings.top + loupe.clientHeight + 'px';

      if (touchPercentageX < 20) {
        loupe.style.left = touchX + loupe.clientWidth + 'px';
      } else {
        loupe.style.left = touchX - loupe.clientWidth + 'px';
      }
    } else {
      loupe.style.top = touchY + 'px';
      loupe.style.left = touchX + 'px';
    }

    loupe.style.backgroundSize = seatings.width * 2;

    loupe.style.backgroundPositionX = mapX + 'px';
    loupe.style.backgroundPositionY = mapY + 'px';
  }

  function touchend(event) {
    // Prevent touch drag and select on tounch end
    event.preventDefault();

    // Sets the position of the pin
    pin.style.top = touchY + 'px';
    pin.style.left = touchX + 'px';

    // Hides the loupe and shows the pin, links and logo again
    loupe.classList.add('hidden');
    if(touchX == null) {
      toggle(logo);
    } else {
      toggle(pin, links, logo);
    }

    let columns = seatings.width / 50;
    let rows = seatings.height / 100;
    let generated = 'Y' + Math.round((touchY - seatings.top) / rows) + 'X' + Math.round((touchX - seatings.left) / columns);
    let url = 'https://hvor.app/salen/' + generated + '.png';

    gtag('event', 'pin_drop', { 'event_label' : generated });

    document.getElementById('telegramlink').href = 'https://t.me/share/url?url=' + url;
    document.getElementById('whatsapplink').href = 'whatsapp://send?text=' + url;
    // document.getElementById('messagelink').href = 'sms:&body=' + url;
  }

  function clickend(event) {
    event.preventDefault();

    pin.style.top = event.pageY + 'px';
    pin.style.left = event.pageX+ 'px';
  }

  touchzone.addEventListener('touchstart', touchstart, false);
  touchzone.addEventListener('touchmove', touchmove, false);
  touchzone.addEventListener('touchend', touchend, false);
  touchzone.addEventListener('click', clickend, false);
  
  window.onorientationchange = function() {
    seatings = document.getElementById('seatings').getBoundingClientRect();
  }
};