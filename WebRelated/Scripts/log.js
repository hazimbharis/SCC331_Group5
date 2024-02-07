
//incident logs, to begin with, will only support entities in rooms they are not mean to be in.
const logsQueue = [];
logsQueue.push(getTimeStamp() + ": Entity type was detected in Room Room number should be in Room number");
logsQueue.push(getTimeStamp() + ": Entity type was detected in Room Room number should be in Room number");
logsQueue.push(getTimeStamp() + ": Entity type was detected in Room Room number should be in Room number");

function addToTerminal(message, icon) {
    const terminal = document.getElementById('Terminal');
    const newLine = document.createElement('div');
    newLine.textContent = message;
    console.log(icon);
    if (icon) {
        newLine.append(icon);
        
    }
    terminal.prepend(newLine); // Add message to the top
  }
  function getTimeStamp(){
    var dateNow2 = new Date();
  
    var date2 = dateNow2.getDate();
    var hours2 = dateNow2.getHours();
    var minutes2 = dateNow2.getMinutes();
    var seconds2 = dateNow2.getSeconds();
    var milliseconds2 = dateNow2.getMilliseconds();
    var day = String(dateNow2.getDate()).padStart(2, '0');
    var month = String(dateNow2.getMonth() + 1).padStart(2, '0');
    var year = dateNow2.getFullYear();
  
    milliseconds = ('000' + milliseconds).slice(-3);
  
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
  
    return hours + ':' + minutes + ':' + seconds + ':' + milliseconds + " " + day + "/" + month + "/" + year;
  
  }

export function addToLog(newEntry, icon) {
    console.log(newEntry);
    var queueSize = logsQueue.push(newEntry);
    console.log(queueSize-1);
    addToTerminal(logsQueue[queueSize-1], icon);
}


