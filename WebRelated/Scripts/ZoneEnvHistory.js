var h1 = document.getElementById('heading');
let index = 0;
var zones = ['Gym', 'Canteen', 'Living Room', 'Library']
let currentZone;
let selectedDate;



function change_left(){
    index -= 1;
    if (index < 0) index = 3
    h1.innerHTML = zones[Math.abs(index%4)]
}
  
function change_right(){
    index += 1;
    
    h1.innerHTML = zones[Math.abs(index%4)]
}

function temperature() {

}

function noise() {

}

function light() {

}

function date() {

}