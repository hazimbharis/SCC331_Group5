const {jsPDF} = window.jspdf;

var todayFull = new Date();
const today = todayFull.toISOString().split("T");
document.getElementById("startDate").setAttribute("max", today[0]);
document.getElementById("endDate").setAttribute("max", today[0]);
let sDate
let eDate
let uTData
let dCData
let mCData

function generate() {
    valid = true;
    errors = [];
    sDate = document.getElementById("startDate").value;
    eDate = document.getElementById("endDate").value;
    if (sDate.length === 0) { //Make sure start and end date are not empty
        valid = false;
        document.getElementById("startDate").style.borderColor = "red";
        errors.push("Please enter start date");
    }
    else {
        document.getElementById("startDate").style.borderColor = "";
    }
    if (eDate.length === 0) {
        valid = false;
        document.getElementById("endDate").style.borderColor = "red";
        errors.push("Please enter end date");
    }
    else {
        document.getElementById("endDate").style.borderColor = "";
    }
    if (sDate.length > 0 && eDate.length > 0) { //Make sure start date is before end date
        var s = new Date(sDate); //Get date into format the database expects
        var e = new Date(eDate);
        if (s.getTime() > e.getTime()) {
            valid = false;
            document.getElementById("startDate").style.borderColor = "red";
            document.getElementById("endDate").style.borderColor = "red";
            errors.push("Start date must be before or on end date");
        }
        else {
            document.getElementById("startDate").style.borderColor = "";
            document.getElementById("endDate").style.borderColor = "";
        }
    }
    if (valid === false) {
        document.getElementById("feedback").textContent = errors.join(", ")
    }
    else if (valid === true) {
        document.getElementById("feedback").textContent = "";
        document.getElementById("sDate").textContent = "Start date: " + sDate;
        document.getElementById("eDate").textContent = "End date: " + eDate;
        createReport();
    }
}

function createReport() {
    $.get('http://localhost:5000/api/countUsers/' + sDate + '/' + eDate , (newData) => {
        document.getElementById("noOfUsers").textContent = "Number of users: " + newData.noOfUsers;
        document.getElementById("meanUsers").textContent = "Mean number of users: " + newData.mean;
        document.getElementById("minUsers").textContent = "Minimum number of users: " + newData.min + " on " + newData.minDate.split("T")[0];
        document.getElementById("maxUsers").textContent = "Maximum number of users: " + newData.max + " on " + newData.maxDate.split("T")[0];
    })
    $.get('http://localhost:5000/api/userTypes/' + sDate + '/' + eDate , (newData) => {
        uTData = newData
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(userTypesChart);
    })
    $.get('http://localhost:5000/api/dayCount/' + sDate + '/' + eDate , (newData) => {
        dCData = newData
        google.charts.load("current", {packages:["corechart", "line"]});
        google.charts.setOnLoadCallback(dayCountChart);
    })
    $.get('http://localhost:5000/api/movementCount/' + sDate + '/' + eDate , (newData) => {
        mCData = newData
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(movementCountChart);
    })
}

function userTypesChart() {
    var cData = new google.visualization.DataTable(); //Use to DataTable class of Google charts to store data
    cData.addColumn("string", "User type");
    cData.addColumn("number", "Count");
    uTData.forEach((entry) => {
        cData.addRows([[entry.type, entry.count]])
    })
    var options = {
        title: "User types"
      };
    var uTChart = new google.visualization.PieChart(document.getElementById("userTypes"));
    uTChart.draw(cData, options);
    uTChartI = uTChart.getImageURI()
}

function dayCountChart() {
    var cData = new google.visualization.DataTable();
    cData.addColumn("datetime", "User type");
    cData.addColumn("number", "Number of users");
    dCData.forEach((entry) => {
        d = entry.Date.split("T")[0].split("-"); //Format date correctly
        cData.addRows([[new Date(d[0], d[1] - 1, d[2]), entry.noOfUsers]]) //Date month starts at 0
    })
    var options = {
        title: "Number of users per day",
        tooltip: {
            textStyle: {
                fontName: "Verdana",
                fontSize: 12,
            }
        }
      };
    var dCChart = new google.visualization.LineChart(document.getElementById("dayCount"));
    dCChart.draw(cData, options);
}

function movementCountChart() {
    var cData = new google.visualization.DataTable();
    cData.addColumn("string", "ZoneID");
    cData.addColumn("number", "Count");
    mCData.forEach((entry) => {
        cData.addRows([[String(entry.zoneID), entry.count]])
    })
    var options = {
        title: "Zone movement count"
      };
    var mCChart = new google.visualization.PieChart(document.getElementById("movementCount"));
    mCChart.draw(cData, options);
}

function download() {
    var pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px', 
        format: [1200, 1200]}); //Create pdf with specified size in pixels
    var rep = document.querySelector('#report');
    pdf.html(rep, {
        callback: function(doc) {
            doc.addImage(uTChartI, 'png', 400, 100, 300, 300);
            doc.save("report.pdf");
        },
        x: 10,
        y: 10
    });         
}