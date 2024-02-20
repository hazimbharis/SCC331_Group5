let currentType;
let selectedDate;
const todayFull = new Date();
const today = todayFull.toISOString().split("T");
let databaseData = []

document.getElementById("date").setAttribute("max", today[0]); //Set the max date in the date input box they can select to today

function drawGraph() {
    //API call to get the zone history data for the day selected
    $.get('http://localhost:5000/api/zoneHistory/' + selectedDate, (newData) => {
        if (currentType == "temp") { //Get the appropriate data depending on the user's selection of environment type
            databaseData = newData.map((row) => ({
                id: row.zoneID,
                val: row.temp,
                time: row.time
            }))
        }
        else if (currentType == "noise") {
            databaseData = newData.map((row) => ({
              id: row.zoneID,
              val: row.noise,
              time: row.time
            }))
        }
        else if (currentType == "light") {
            databaseData = newData.map((row) => ({
              id: row.zoneID,
              val: row.light,
              time: row.time
            }))
        }
        if (databaseData.length == 0) {
            document.getElementById("feedback").textContent = "No data for selected day"; //If no data for day selected, feedback to user
        }
        else {
          document.getElementById("feedback").textContent = ""; //Clear text if valid day
        }
        google.charts.load("current", {packages: ["corechart", "line"]}); //Specify line graph
        google.charts.setOnLoadCallback(draw);
    })
}

function draw() {
    var data = new google.visualization.DataTable(); //Use to DataTable class of Google charts to store data
    data.addColumn("timeofday", "Time"); //Add the data columns needed
    data.addColumn("number", "Gym");
    data.addColumn("number", "Canteen");
    data.addColumn("number", "Living room");
    data.addColumn("number", "Library")

    databaseData.forEach((entry) => { //For each data entry, convert to correct format for table
        var forTime = entry.time.split(":");
        var convEntry = [[parseInt(forTime[0]), parseInt(forTime[1]), parseInt(forTime[2])], null, null, null, null];
        convEntry[entry.id] = entry.val; //Only need to add to the right column for each entry
        data.addRows([convEntry]); //Add data to the line graph
    })

    var yTitle; //Change the y axis title to represent what is being displayed
    if (currentType == "temp") {
        yTitle = "Temperature (°C)";
    }
    else if (currentType == "noise") {
        yTitle = "Noise level (dB)";
    }
    else if (currentType == "light") {
        yTitle = "Light level (lx)";
    }

    var style = { //Style options for graph
        hAxis: {
            title: "Time (hh:mm:ss)",
            titleTextStyle: {
              bold: true,
              italic: false
            }
        },
        vAxis: {
            title: yTitle,
            titleTextStyle: {
              bold: true,
              italic: false
            }
        },
        height: 350,
        colors: ["red", "blue", "green", "purple"],
        tooltip: {
            textStyle: {
                fontName: "Verdana",
                fontSize: 12,
            }
        },
        animation: {
            duration: 200,
            startup: true
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById("graph"));
    chart.draw(data, style);
}

function temperature() {
    if (currentType != null) {
        document.getElementById(currentType).style.backgroundColor = ""; //If a previous type was selected, clear the hightlight that it was selected, reset style properties
        document.getElementById(currentType).style.color = "";
    }
    currentType = "temp";
    document.getElementById(currentType).style.backgroundColor = "#44414f"; //Highlight selected button corresponding to the correct type
    document.getElementById(currentType).style.color = "#e3d8d8";
    if (selectedDate != null) { //Draw graph if date is also inputted
        drawGraph();
    }
}

function noise() {
    if (currentType != null) {
        document.getElementById(currentType).style.backgroundColor = "";
        document.getElementById(currentType).style.color = "";
    }
    currentType = "noise";
    document.getElementById(currentType).style.backgroundColor = "#44414f";
    document.getElementById(currentType).style.color = "#e3d8d8";
    if (selectedDate != null) {
        drawGraph();
    }
}

function light() {
    if (currentType != null) {
        document.getElementById(currentType).style.backgroundColor = "";
        document.getElementById(currentType).style.color = "";
    }
    currentType = "light";
    document.getElementById(currentType).style.backgroundColor = "#44414f";
    document.getElementById(currentType).style.color = "#e3d8d8";
    if (selectedDate != null) {
        drawGraph();
    }
}

function date() {
    selectedDate = document.getElementById("date").value;
    if (currentType != null && selectedDate != null) { //Draw graph if date and type is inputted
        drawGraph();
    }
}