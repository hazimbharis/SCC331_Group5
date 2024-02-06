let temperature = document.getElementById('temperature');
let noise = document.getElementById('noise');
let light = document.getElementById('light');

//Fetched data from API
const data = [
  { title: 'temperature', value: 17 },
  { title: 'noise', value: 24 },
  {
    title: 'light',
    value: 100,
  },
];

data.forEach((item) => {
  if (item.title === 'temperature') {
    temperature.innerHTML = `${item.value}°C`;
  } else if (item.title === 'noise') {
    noise.innerHTML = `${item.value}`;
  } else if (item.title === 'light') {
    light.innerHTML = `${item.value}`;
  }
});
