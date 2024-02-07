let clockText = document.getElementById("clock-text");
let play = true;
let timeIncrementor = 30// minutes back and forth when user presses button
let dateNow = new Date();
let hours = dateNow.getHours();
let minutes = dateNow.getMinutes();
let seconds = dateNow.getSeconds();
let milliseconds = dateNow.getMilliseconds();


playClock();

function toggleDropdown() {
    var dropdownContent = document.querySelector('.Drop-down-content');
    if (dropdownContent) {
        dropdownContent.classList.toggle('active');
    } else {
        console.error('Dropdown content element not found.');
    }
  }
function playClock() {
    play = true;

}
function pauseClock() {
    play = false;
}
function prevEvent() {
    play = false
    hours -=1;
    setInterval(clockUpdater, 1);
}
function nextEvent() {
    play = false
    hours +=1;
    setInterval(clockUpdater, 1);
    
}
function scrollToHeight(height) {
    window.scrollTo({
      top: height,
      behavior: 'smooth'
    });
  }
function clockUpdater() {
    if (play) {
        dateNow = new Date();

        hours = dateNow.getHours();
        minutes = dateNow.getMinutes();
        seconds = dateNow.getSeconds();
        milliseconds = dateNow.getMilliseconds();

        milliseconds = ('000' + milliseconds).slice(-4);

        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
    }
        clockText.textContent = hours + ':' + minutes + ':' + seconds + ':' + milliseconds;

}
if (play) {
    // Restart the clock if play is true
    setInterval(clockUpdater, 1);
}
clockUpdater();


