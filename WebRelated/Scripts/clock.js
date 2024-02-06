let clockText = document.getElementById("clock-text");
let play = true;
let timeIncrementor = 30// minutes back and forth when user presses button
let dateNow = new Date();
let hours = dateNow.getHours();
let minutes = dateNow.getMinutes();
let seconds = dateNow.getSeconds();
let milliseconds = dateNow.getMilliseconds();


playClock();

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


