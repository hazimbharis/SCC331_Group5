let temperature = document.getElementById('temperature');
let noise = document.getElementById('noise');
let light = document.getElementById('light');

var h1 = document.getElementById('heading');
let index = 0;
var zones = ['Gym', 'Canteen', 'Living Room', 'Library'];
let chosenZone = document.getElementById('chosen-zone');

function change_left() {
  index -= 1;
  if (index < 0) index = 3;
  h1.innerHTML = zones[Math.abs(index % 4)];
}

function change_right() {
  index += 1;

  h1.innerHTML = zones[Math.abs(index % 4)];
}

const show = (zone) => {
  chosenZone.placeholder = zone;
};

// Dropdown Menu
let dropdown = document.querySelector('.dropdown');
dropdown.onclick = function () {
  dropdown.classList.toggle('active');
};

function fetchPopulationData() {
  switch (Math.abs(index % 4)) {
    case 0:
      console.log('0');
      $.get('http://localhost:5000/api/gym', (data) => {
        // Update the 'values' array with the new data received
        values = data;
        console.log(data);
        temperature.innerHTML = values[0].temp + '°C';
        noise.innerHTML = values[0].noise + 'dB';
        light.innerHTML = values[0].light + 'lx';
      });
      break;
    case 1:
      console.log('1');
      $.get('http://localhost:5000/api/canteen', (data) => {
        // Update the 'values' array with the new data received
        values = data;
        console.log(data);
        temperature.innerHTML = values[0].temp + '°C';
        noise.innerHTML = values[0].noise + 'dB';
        light.innerHTML = values[0].light + 'lx';
      });
      break;
    case 2:
      console.log('2');
      $.get('http://localhost:5000/api/library', (data) => {
        // Update the 'values' array with the new data received
        values = data;
        console.log(data);
        temperature.innerHTML = values[0].temp + '°C';
        noise.innerHTML = values[0].noise + 'dB';
        light.innerHTML = values[0].light + 'lx';
        return;
      });
      break;
    case 3:
      console.log('3');
      $.get('http://localhost:5000/api/livingroom', (data) => {
        // Update the 'values' array with the new data received
        values = data;
        console.log(data);
        temperature.innerHTML = values[0].temp + '°C';
        noise.innerHTML = values[0].noise + 'dB';
        light.innerHTML = values[0].light + 'lx';
        return;
      });
      break;
  }
}

// //Fetched data from API
// const data = [
//   { title: 'temperature', value: 17 },
//   { title: 'noise', value: 24 },
//   {
//     title: 'light',
//     value: 100,
//   },
// ];

// data.forEach((item) => {
//   if (item.title === 'temperature') {
//     temperature.innerHTML = `${item.value}°C`;
//   } else if (item.title === 'noise') {
//     noise.innerHTML = `${item.value}`;
//   } else if (item.title === 'light') {
//     light.innerHTML = `${item.value}`;
//   }
// });

fetchPopulationData();
setInterval(fetchPopulationData, 1000);
