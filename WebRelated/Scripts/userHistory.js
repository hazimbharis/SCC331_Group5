

// Function to extract query parameters from the URL
var timeInEachZone = [0, 0, 0, 0];

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

// Call this function to initialize your page
function initializePage() {
    let urlData = getQueryVariable('prisonerID');
    var headerElement = document.getElementById("page-title");
    headerElement.innerHTML += urlData;
    getMovementHistiory(urlData);

    
    $.get('http://localhost:5000/api/UserHistoryData/' + urlData, (newData) => {
        let userInfo = newData.map((item) => ({
            id: item.id,
            firstName: item.firstNames,
            lastName: item.lastName,
            dob: item.dob,
            gender: item.gender,
            medCond: item.medCond,
            type: item.type,
        }));
        console.log(userInfo);
        var info1 = document.getElementById("info1");
        var info2 = document.getElementById("info2");
        var info3 = document.getElementById("info3");
        var info4 = document.getElementById("info4");
        var info5 = document.getElementById("info5");
        info1.innerHTML += userInfo[0].firstName + " " + userInfo[0].lastName;
        info2.innerHTML += userInfo[0].dob;
        info3.innerHTML += userInfo[0].gender;
        switch(userInfo[0].type){
            case 'P':
                info4.innerHTML += "Prisoner";
                break;
            case 'V':
                info4.innerHTML += "Visitor";
                break;
            case 'S':
                info4.innerHTML += "Staff";
                break;
            default:
                info4.innerHTML += "No Role";   
        }
        if( userInfo[0].medCond != undefined ){
            info5.innerHTML += userInfo[0].medCond;            
        }else{info5.innerHTML += "None on file"}

    });

}

function getMovementHistiory(userID) {
    $.get('http://localhost:5000/api/UserHistory/' + userID, (newData) => {
        movementData = newData.map((item) => ({
            zoneID: item.zoneID,
            timeSpent: item.time_spent,
        }));
        console.log(userID);
        console.log(movementData);

        // Reset timeInEachZone
        timeInEachZone = [0, 0, 0, 0];

        // Loop through movementData to populate timeInEachZone
        for (var x = 0; x < movementData.length; x++) {
            switch (movementData[x].zoneID) {
                case 4:
                    timeInEachZone[0] = movementData[x].timeSpent; // Add to existing value
                    break;
                case 1:
                    timeInEachZone[1] = movementData[x].timeSpent; // Add to existing value
                    break;
                case 2:
                    timeInEachZone[2] = movementData[x].timeSpent; // Add to existing value
                    break;
                case 3:
                    timeInEachZone[3] = movementData[x].timeSpent; // Add to existing value
                    break;
            }
        }

        console.log(timeInEachZone);

        // Rest of your code for creating the pie chart
        // Assuming the data and options are correctly formatted
var data = {
    labels: ['Living Room', 'Gym', 'Canteen', 'Library'],
    datasets: [{
      data: timeInEachZone, // Using the timeInEachZone array
      backgroundColor: ['RGBA(68, 114, 196, 0.8)', 'RGBA(237, 125, 49, 0.8)', 'RGBA(165, 165, 165, 0.8)', 'RGBA(112, 173, 71, 0.8)']
    }]
  };
  
  var options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Custom Pie Chart'
    }
  };
  
  // Get the canvas element
  var ctx = document.getElementById('myPieChart');
  
  // Ensure ctx is not null before creating the chart
  if (ctx) {
    // Create the pie chart
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: options
    });
  } else {
    console.error('Canvas element not found.');
  }
  
    });
}

// Call initializePage when the DOM is ready
$(document).ready(function() {
    initializePage();
});




