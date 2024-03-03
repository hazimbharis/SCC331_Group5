const {jsPDF} = window.jspdf;

var todayFull = new Date();
const today = todayFull.toISOString().split("T");
document.getElementById("startDate").setAttribute("max", today[0]);
document.getElementById("endDate").setAttribute("max", today[0]);
let sDate
let eDate

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
        console.log(newData)
        document.getElementById("noOfUsers").textContent = "Number of users: " + newData.noOfUsers;
        document.getElementById("meanUsers").textContent = "Mean number of users: " + newData.mean;
        document.getElementById("minUsers").textContent = "Minimum number of users: " + newData.min + " on " + newData.minDate.split("T")[0];
        document.getElementById("maxUsers").textContent = "Maximum number of users: " + newData.max + " on " + newData.maxDate.split("T")[0];
    })
}

function download() {
    var pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px', 
        format: [1200, 1200]}); //Create pdf with specified size in pixels
    var rep = document.querySelector('#report');
    pdf.html(rep, {
        callback: function(doc) {
            doc.save("report.pdf");
        },
        x: 10,
        y: 10
    });         
}