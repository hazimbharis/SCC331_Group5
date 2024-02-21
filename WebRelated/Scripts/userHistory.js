    // Function to extract query parameters from the URL
    function getQueryVariable(variable) {
        let query = window.location.search.substring(1);
        let vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        console.error('Value not found: ', variable);
    }
    let x = getQueryVariable('prisonerID');
    var headerElement = document.getElementById("page-title");
    headerElement.innerHTML += x;

  // Data for the pie chart
  var data = {
    labels: ['Living Room', 'Gym', 'Canteen', 'Library'],
    datasets: [{
      data: [300, 50, 100, 40],
      backgroundColor: ['RGBA(68, 114, 196, 0.8)', 'RGBA(237, 125, 49, 0.8)', 'RGBA(165, 165, 165, 0.8)', 'RGBA(112, 173, 71, 0.8)']
    }]
  };

  // Configuration options
  var options = {
    responsive: true,
    maintainAspectRatio: false, // Prevents the chart from maintaining aspect ratio
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Custom Pie Chart'
    }
  };

  // Get the canvas element
  var ctx = document.getElementById('myPieChart').getContext('2d');

  // Create the pie chart
  var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: options
  });




