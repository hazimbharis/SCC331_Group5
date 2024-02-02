let clockText = document.getElementById("clock-text");
let play = true;
let timeIncrementor = 30// minutes back and forth when user presses button



playClock()

function playClock() {
    play = true;
    if (play) {
        // Restart the clock if play is true
        setInterval(clockUpdater, 1);
    }
}
function pauseClock() {
    play = false;
}

function setTimeToLive(){

}

function clockUpdater() {
    if (play) {
        var dateNow = new Date();

        var hours = dateNow.getHours();
        var minutes = dateNow.getMinutes();
        var seconds = dateNow.getSeconds();
        var milliseconds = dateNow.getMilliseconds();

        milliseconds = ('000' + milliseconds).slice(-4);

        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;

        clockText.textContent = hours + ':' + minutes + ':' + seconds + ':' + milliseconds;
    }
}

clockUpdater();


