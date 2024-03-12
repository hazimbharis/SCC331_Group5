let currentType;
let selectedDate;
var todayFull = new Date();
const today = todayFull.toISOString().split("T");
let databaseData = []
let data
let count

document.getElementById("date").setAttribute("max", today[0]); //Set the max date in the date input box they can select to today

function drawGraph() {
    //API call to get the zone history data for the day selected
    $.get('http://localhost:5000/api/zoneCount/' + selectedDate + '/' + selectedDate, (newData) => {
        count = newData.noOfZones;
        $.get('http://localhost:5000/api/zoneHistory/' + selectedDate, (newData) => {
            if (currentType === "temp") { //Get the appropriate data depending on the user's selection of environment type
                databaseData = newData.map((row) => ({
                    id: row.zoneID,
                    val: row.temp,
                    time: row.time
                }))
            }
            else if (currentType === "noise") {
                databaseData = newData.map((row) => ({
                    id: row.zoneID,
                    val: row.noise,
                    time: row.time
                }))
            }
            else if (currentType === "light") {
                databaseData = newData.map((row) => ({
                    id: row.zoneID,
                    val: row.light,
                    time: row.time
                }))
            }
            if (databaseData.length === 0) {
                document.getElementById("feedback").textContent = "No data for selected day"; //If no data for day selected, feedback to user
            }
            else {
                document.getElementById("feedback").textContent = selectedDate;
                google.charts.load("current", {packages: ["corechart", "line"]}); //Specify line graph
                google.charts.setOnLoadCallback(draw);
            }
        })
    })
}

function draw() {
    data = new google.visualization.DataTable(); //Use to DataTable class of Google charts to store data
    data.addColumn("timeofday", "Time"); //Add the data columns needed, first column always time, else each column represents a zone
    for (var i = 1 ; i <= count; i++) {
        data.addColumn("number", String(i))
    }

    databaseData.forEach((entry) => { //For each data entry, convert to correct format for table
        var forTime = entry.time.split(":");
        var convEntry = new Array(count + 1);
        for (var i = 0; i < count + 1; i++) { //Initialise array with nulls
            convEntry[i] = null;
        }
        convEntry[0] = [parseInt(forTime[0]), parseInt(forTime[1]), parseInt(forTime[2])];
        convEntry[entry.id] = entry.val; //Only need to add to the right column for each entry
        data.addRows([convEntry]); //Add data to the line graph
    })

    var yTitle; //Change the y axis title to represent what is being displayed
    if (currentType === "temp") {
        yTitle = "Temperature (°C)";
    }
    else if (currentType === "noise") {
        yTitle = "Noise level (dB)";
    }
    else if (currentType === "light") {
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

function drawDoors() { //Door history visualisation uses a different type of graph so needs a unique function
    $.get('http://localhost:5000/api/doorHistory/' + selectedDate, (newData) => {
        databaseData = newData.map((row) => ({
            id: row.doorID,
            val: row.status,
            time: row.time
        }))
        if (databaseData.length === 0) {
            document.getElementById("feedback").textContent = "No data for selected day";
        }
        else {
            document.getElementById("feedback").textContent = selectedDate;
            google.charts.load("current", {packages:["timeline"]}); //Use Google Charts timeline
            google.charts.setOnLoadCallback(drawD);
        }
    })
}

function drawD() {
    var data = new google.visualization.DataTable();
    data.addColumn({type: "string", id: "doorName"});
    data.addColumn({type: "string", id: "doorName"});
    data.addColumn({type: "string", role: "style"}); //This column is used for bar styling
    data.addColumn({type: "date", id: "start"});
    data.addColumn({type: "date", id: "end"});
    for (var i = 0; i < databaseData.length; i++) {
        var endTime;
        if ((i + 1) >= databaseData.length || databaseData[i + 1].id !== databaseData[i].id) { //If end of entries or next entry does not have the same zoneID, the end time is 23:59:59 for this entry
            if (today[0] === selectedDate) { //If day selected is today, end of entry is the current time
                todayFull = new Date();
                var now = todayFull.toISOString().split("T")[1].split(".")[0].split(":"); //Get current time by splitting the fulltime string gotten by creating a new date instance
                endTime = new Date(0, 0, 0, now[0], now[1], now[2]);
            }
            else {
                endTime = new Date(0, 0, 0, 23, 59, 59); //Date format is (year, month, day, hour, minute, second), ignore year, month and day as that is not important due to selected date
            }
        }
        else {
            endTime = databaseData[i + 1].time; //A timeline entry must have an end time, therefore the end date of an entry is the start time of the next entry
            endTime = endTime.split(":");
            endTime = new Date(0, 0, 0, endTime[0], endTime[1], endTime[2]);
        }
        var time = databaseData[i].time;
        time = time.split(":");
        time = new Date(0, 0, 0, time[0], time[1], time[2]);
        var status = databaseData[i].val;
        var colour;
        if (status === "alarm") { //Colour the bar appropriately based on status value
            colour = "red";
        }
        else if (status === "locked") {
            colour = "#00ee00";
        }
        else if (status === "closed") {
            colour = "blue";
        }
        else {
            colour = "#ffdd00";
        }
        data.addRows([[String(databaseData[i].id), status, colour, time, endTime]])
    }
    var chart = new google.visualization.Timeline(document.getElementById("graph"));
    var style = {
        fontName: "Verdana",
        height: 350,
    }
    chart.draw(data, style);
}

function temperature() {
    if (currentType != null) {
        document.getElementById(currentType).style.backgroundColor = ""; //If a previous type was selected, clear the hightlight that it was selected, reset style properties
        document.getElementById(currentType).style.color = "";
    }
    currentType = "temp";
    document.getElementById(currentType).style.backgroundColor = "#aaaaaa"; //Highlight selected button corresponding to the correct type
    document.getElementById(currentType).style.color = "white";
    if (selectedDate != null) { //Draw graph if date is also inputted
        document.getElementById("feedback").textContent = "";
        drawGraph();
    }
    else {
        document.getElementById("feedback").textContent = "Please select a date";
    }
}

function noise() {
    if (currentType != null) {
        document.getElementById(currentType).style.backgroundColor = "";
        document.getElementById(currentType).style.color = "";
    }
    currentType = "noise";
    document.getElementById(currentType).style.backgroundColor = "#aaaaaa";
    document.getElementById(currentType).style.color = "white";
    if (selectedDate != null) {
        document.getElementById("feedback").textContent = "";
        drawGraph();
    }
    else {
        document.getElementById("feedback").textContent = "Please select a date";
    }
}

function light() {
    if (currentType != null) {
        document.getElementById(currentType).style.backgroundColor = "";
        document.getElementById(currentType).style.color = "";
    }
    currentType = "light";
    document.getElementById(currentType).style.backgroundColor = "#aaaaaa";
    document.getElementById(currentType).style.color = "white";
    if (selectedDate != null) {
        document.getElementById("feedback").textContent = "";
        drawGraph();
    }
    else {
        document.getElementById("feedback").textContent = "Please select a date";
    }
}

function doors() {
    if (currentType != null) {
        document.getElementById(currentType).style.backgroundColor = "";
        document.getElementById(currentType).style.color = "";
    }
    currentType = "doors";
    document.getElementById(currentType).style.backgroundColor = "#aaaaaa";
    document.getElementById(currentType).style.color = "white";
    if (selectedDate != null) {
        document.getElementById("feedback").textContent = "";
        drawDoors();
    }
    else {
        document.getElementById("feedback").textContent = "Please select a date";
    }
}

function date() {
    selectedDate = document.getElementById("date").value;
    if (selectedDate === "") {
        document.getElementById("feedback").textContent = "Please select a date";
        selectedDate = null;
    }
    else if (currentType == null) {
        document.getElementById("feedback").textContent = "Please select a data type"
    }
    else if (currentType != null && selectedDate !== "") { //Draw graph if date and type is inputted
        document.getElementById("download").style.visibility = "visible";
        document.getElementById("feedback").textContent = "";
        if (currentType === "doors") {
            drawDoors();
        }
        else {
            drawGraph();
        }
    }
}

function download() {
    if (currentType === "doors") {
        var noOfRows = data.getNumberOfRows(); //Fix for outputting times instead of dates in timeline
        data.addColumn("timeofday", "startTime");
        data.addColumn("timeofday", "endTime");
        for (var i = 0; i < noOfRows; i++) { //Convert dates to times
            data.setCell(i, 5, [data.getValue(i, 3).getHours(), data.getValue(i, 3).getMinutes(), data.getValue(i, 3).getSeconds()]);
            data.setCell(i, 6, [data.getValue(i, 4).getHours(), data.getValue(i, 4).getMinutes(), data.getValue(i, 4).getSeconds()]);
        }
        data.removeColumn(2); //Remove style column from CSV
        data.removeColumn(2); //Remove start date, same index as removing a column shifts the rest up
        data.removeColumn(2); //Remove end date
    }
    var d2CSV = google.visualization.dataTableToCsv(data);
    var colHeadings = [];
    for (var i = 0; i < data.getNumberOfColumns(); i++) { //Get column names
        colHeadings.push(data.getColumnLabel(i));
    }
    d2CSV = colHeadings.join(",") + "\r\n" + d2CSV; //Add columns to start of CSV file
    var blob = new Blob([d2CSV], {type: "text/csv;charset=utf-8;"}); //Create new CSV file with contents of d2CSV
    var link = URL.createObjectURL(blob); //Create URL to download file
    window.open(link);
}