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
let zoneCount
let zDData
let dHData

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
    $.get('http://localhost:5000/api/envMeans/' + sDate + '/' + eDate , (newData) => {
        document.getElementById("mTemp").textContent = "Mean temperature: " + newData.mTemp + "°C";
        document.getElementById("mLight").textContent = "Mean light level: " + newData.mLight + "lx";
        document.getElementById("mSound").textContent = "Mean sound level: " + newData.mNoise +  "dB";
    })
    $.get('http://localhost:5000/api/envMeans/' + sDate + '/' + eDate , (newData) => {
        document.getElementById("mTemp").textContent = "Mean temperature: " + newData.mTemp + "°C";
        document.getElementById("mLight").textContent = "Mean light level: " + newData.mLight + "lx";
        document.getElementById("mSound").textContent = "Mean sound level: " + newData.mNoise +  "dB";
    })
    $.get('http://localhost:5000/api/zoneCount/' + sDate + '/' + eDate , (newData) => {
        zoneCount = newData.noOfZones;
        document.getElementById("noOfZones").textContent = "Number of zones:" + zoneCount;
        if (zoneCount > 0)
        {
            $.get('http://localhost:5000/api/zoneDayData/' + sDate + '/' + eDate , (newData) => {
            zDData = newData;
            google.charts.load("current", {packages:["corechart", "line"]});
            google.charts.setOnLoadCallback(tempMeansChart);
            google.charts.load("current", {packages:["corechart", "line"]});
            google.charts.setOnLoadCallback(lightMeansChart);
            google.charts.load("current", {packages:["corechart", "line"]});
            google.charts.setOnLoadCallback(soundMeansChart);
            })
        }
    })
    $.get('http://localhost:5000/api/doorCount/' + sDate + '/' + eDate , (newData) => {
        document.getElementById("noOfDoors").textContent = "Number of doors: " + newData.noOfDoors;
    })
    $.get('http://localhost:5000/api/dHistory/' + sDate + '/' + eDate , (newData) => {
        dHData = newData;
        google.charts.load("current", {packages:["bar"]});
        google.charts.setOnLoadCallback(doorHistoryChart);
    })
}

function userTypesChart() {
    var cData = new google.visualization.DataTable(); //Use to DataTable class of Google charts to store data
    cData.addColumn("string", "User type");
    cData.addColumn("number", "Count");
    uTData.forEach((entry) => {
        cData.addRows([[entry.type, entry.count]]);
    })
    var options = {
        title: "User types",
    };
    var uTChart = new google.visualization.PieChart(document.getElementById("userTypes"));
    uTChart.draw(cData, options);
    uTChartI = uTChart.getImageURI();
}

function dayCountChart() {
    var cData = new google.visualization.DataTable();
    cData.addColumn("datetime", "User type");
    cData.addColumn("number", "Number of users");
    dCData.forEach((entry) => {
        d = entry.Date.split("T")[0].split("-"); //Format date correctly
        cData.addRows([[new Date(d[0], d[1] - 1, d[2]), entry.noOfUsers]]); //Date month starts at 0
    })
    var options = {
        title: "Number of users per day",
        tooltip: {
            textStyle: {
                fontName: "Verdana",
                fontSize: 12,
            }
        },
        hAxis: {
            title: "Date",
            titleTextStyle: {
              bold: true,
              italic: false
            }
        },
        vAxis: {
            title: "No. of users",
            titleTextStyle: {
              bold: true,
              italic: false
            }
        },
        height: 350
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


function meansChart(type, title, yTitle) {
    var cData = new google.visualization.DataTable();
    cData.addColumn("datetime", "Date")
    for (var i = 1; i <= zoneCount; i++) { //Assumption zoneIDs are from 1 onwards and no numbers are skipped
        cData.addColumn("number", String(i));
    }
    var temp = new Array(zoneCount + 1); //+1 is for the date column
    for (var i = 0; i <= zoneCount; i++) { //Initialise with nulls in case some zone data is missing for day
        temp[i] = null;
    }
    var prevDate; //Used to track whether a date entry is finished
    zDData.forEach((entry) => {
        d = entry.date.split("T")[0].split("-");
        if (prevDate !== entry.date) {
            cData.addRows([temp]); //If record has a different day than previous record, means data for previous day is finished and can be added to graph
            temp = new Array(zoneCount + 1);
            for (var i = 0; i <= zoneCount; i++) {
                temp[i] = null;
            }
            temp[0] = new Date(d[0], d[1] - 1, d[2]);
        }
        temp[entry.zoneID] = entry[type];
        prevDate = entry.date;
    })
    cData.addRows([temp]); //Add last day entry
    var options = {
        title: title,
        tooltip: {
            textStyle: {
                fontName: "Verdana",
                fontSize: 12,
            }
        },
        hAxis: {
            title: "Date",
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
        height: 350
    };
    return [cData, options];
}

function tempMeansChart() {
    var chData = meansChart("temp", "Mean temperature for zones", "Degrees (°C)");
    var tMChart = new google.visualization.LineChart(document.getElementById("temp"));
    tMChart.draw(chData[0], chData[1]);
}

function lightMeansChart() {
    var chData = meansChart("light", "Mean light level for zones", "Lux (lx)");
    var tMChart = new google.visualization.LineChart(document.getElementById("light"));
    tMChart.draw(chData[0], chData[1]);
}

function soundMeansChart() {
    var chData = meansChart("noise", "Mean sound level for zones", "Decibels (dB)");
    var tMChart = new google.visualization.LineChart(document.getElementById("sound"));
    tMChart.draw(chData[0], chData[1]);
}

function doorHistoryChart() {
    var cData = new google.visualization.DataTable();
    cData.addColumn("string", "DoorID");
    cData.addColumn("number", "Open");
    cData.addColumn("number", "Closed");
    cData.addColumn("number", "Locked");
    cData.addColumn("number", "Alarm");
    var temp;
    var prevDate;
    var forDate;
    var prevID;
    var prevStatus;
    var fEDate = eDate.split("-");
    fEDate = new Date(fEDate[0], fEDate[1] - 1, fEDate[2], 23, 59, 59);
    dHData.forEach((entry) => {
        if (prevID !== entry.doorID) {
            if (temp != undefined) {
                ms = (fEDate.getTime() - prevDate.getTime()) / 60000;
                if (prevStatus === "open") {
                    temp[1] = temp[1] + ms;
                }
                else if(prevStatus === "closed") {
                    temp[2] = temp[2] + ms;
                }
                else if(prevStatus === "locked") {
                    temp[3] = temp[3] + ms;
                }
                else if(prevStatus === "alarm") {
                    temp[4] = temp[4] + ms;
                }
                cData.addRows([temp]);
            }
            temp = new Array(5);
            for (var i = 1; i < 5; i++) {
                temp[i] = 0;
            }
            temp[0] = String(entry.doorID);
        }
        d = entry.date.split("T")[0].split("-");
        t = entry.time.split(":");
        forDate = new Date(d[0], d[1] - 1, d[2], t[0], t[1], t[2]);
        if (prevStatus !== entry.status && prevID === entry.doorID) {
            ms = (forDate.getTime() - prevDate.getTime()) / 600000;
            if (prevStatus === "open") {
                temp[1] = temp[1] + ms;
            }
            else if(prevStatus === "closed") {
                temp[2] = temp[2] + ms;
            }
            else if(prevStatus === "locked") {
                temp[3] = temp[3] + ms;
            }
            else if(prevStatus === "alarm") {
                temp[4] = temp[4] + ms;
            }
        }
        prevID = entry.doorID;
        prevStatus = entry.status;
        prevDate = forDate;
    })
    if (prevDate != null) {
        ms = (fEDate.getTime() - prevDate.getTime()) / 60000;
        if (prevStatus === "open") {
            temp[1] = temp[1] + ms;
        }
        else if(prevStatus === "closed") {
            temp[2] = temp[2] + ms;
        }
        else if(prevStatus === "locked") {
            temp[3] = temp[3] + ms;
        }
        else if(prevStatus === "alarm") {
            temp[4] = temp[4] + ms;
        }
        cData.addRows([temp]);
    }
    var options = {
        chart: {
        title: "Door status for timeframe",
        },
        height: 350
    };
    var dHChart = new google.charts.Bar(document.getElementById("doorHistory"));
    dHChart.draw(cData, google.charts.Bar.convertOptions(options));
}

function download() {
    var pdf = new jsPDF(); //Create pdf with specified size in pixels
    // var rep = document.querySelector('#report');
    // pdf.html(rep, {
    //     callback: function(doc) {
            pdf.addImage(uTChartI, "png", 10, 10, 50, 50);
            pdf.save("report.pdf");
        // },
        // x: 10,
        // y: 10
    // });         
}