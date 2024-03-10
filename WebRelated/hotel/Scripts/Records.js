let data = []; //All data for prisoners/staff/visitor table
let currentType;
let arrayed = []; //Same as data except in array form
let currentDisplay = []; //All entries being currently displayed
let prevCol; //Tracks column that records are ordered by
let prevN;
let order; //Tracks if ascending or descending order

function resetTable(newType, headingNames) {
    prevCol = null;
    order = null;
    if (currentType != null) { //Reset previous choice highlight
        document.getElementById(currentType).style.backgroundColor = "";
        document.getElementById(currentType).style.color = "";
    }
    currentType = newType;
    document.getElementById(currentType).style.backgroundColor = "#e3d8d8"; //Highlight the current user type selected
    document.getElementById(currentType).style.color = "black";
    data = [];
    arrayed = [];
    var table = document.getElementById("table");
    table.replaceChildren(); //Remove all headings and entries
    var thead = document.createElement("tr");
    thead.setAttribute("id", "headings");
    var i = 0;
    headingNames.forEach((name) => { //Set all headings for appropriate table
        var h = document.createElement("th");
        h.textContent = name;
        h.setAttribute("id", name);
        h.setAttribute("onclick", "sortRecords(" + i + ")")
        thead.appendChild(h);
        i++;
    })
    table.appendChild(thead);
}

function displayData() {
    data.forEach((elem) => { //Convert object data to array
        var record = Object.values(elem);
        var i = 0;
        record.forEach((val) => {
            if (val == null) {
                record[i] = "";
            }
            i++;
        })
        arrayed.push(record);
    })
    currentDisplay = arrayed;
    currentDisplay.forEach((elem) => { //Add data records to table
        var record = document.createElement("tr");
        elem.forEach((val) => {
            var attr = document.createElement("td");
            attr.textContent = val;
            record.appendChild(attr);
        })
        table.appendChild(record);
    })
}

function prisoners() {
    var names = ["Id", "First names", "Last name", "DOB", "Gender", "Medical conditions", "Convictions", "Start date", "End date"];
    resetTable("prisoners", names);
    $.get('http://localhost:5000/api/prisoners', (newData) => { //Get prisoner records
        data = newData.map((row) => ({
            id: row.id,
            fn: row.firstNames,
            ln: row.lastName,
            dob: String(row.dob).split("T")[0],
            gen: row.gender,
            med: row.medicalConditions,
            con: row.convictions,
            sd: String(row.startDate).split("T")[0],
            ed: String(row.endDate).split("T")[0]
        }))
        displayData();
    })
}

function staff() {
    var names = ["Id", "First names", "Last name", "DOB", "Gender", "Medical conditions", "Role"];
    resetTable("staff", names)
    $.get('http://localhost:5000/api/staff', (newData) => { //Get staff records
        data = newData.map((row) => ({
            id: row.id,
            fn: row.firstNames,
            ln: row.lastName,
            dob: String(row.dob).split("T")[0],
            gen: row.gender,
            med: row.medicalConditions,
            rol: row.role
        }))
        displayData();
    })
}

function visitors() {
    var names = ["Id", "First names", "Last name", "DOB", "Gender", "Medical conditions", "Phone number"];
    resetTable("visitors", names);
    $.get('http://localhost:5000/api/visitors', (newData) => { //Get visitor records
        data = newData.map((row) => ({
            id: row.id,
            fn: row.firstNames,
            ln: row.lastName,
            dob: String(row.dob).split("T")[0],
            gen: row.gender,
            med: row.medicalConditions,
            pno: row.phoneNo
        }))
        displayData();
    })
}

function sortRecords(n) { //Allows user to sort records by clicking on the headings
    var table = document.getElementById("table");
    var entries = table.childElementCount;
    var chosenHeading = document.getElementById("headings").children[n]; //Get heading that was chosen using n
    var chosenCol = chosenHeading.getAttribute("id");
    if (prevCol !== chosenCol && prevCol != null) { //Reset heading if ordered by something previously
        document.getElementById(prevCol).textContent = prevCol;
    }
    for (var i = 1; i < entries; i++) { //Clear all entries
        table.removeChild(table.children[1]);
    }
    if (prevCol === chosenCol && order === "asc") { //If column clicked on is already the one ordering by ascending, order by descending
        chosenHeading.textContent = chosenCol + "↑";
        currentDisplay = currentDisplay.sort((x, y) => y[n].localeCompare(x[n]));
        order = "dsc"
    }
    else { //All other cases order by ascending
        chosenHeading.textContent = chosenCol + "↓";
        currentDisplay = currentDisplay.sort((x, y) => x[n].localeCompare(y[n]));
        prevCol = chosenCol;
        prevN = n;
        order = "asc";
    }
    currentDisplay.forEach((elem) => { //Display ordered data
        var record = document.createElement("tr");
        elem.forEach((val) => {
            var attr = document.createElement("td");
            attr.textContent = val;
            record.appendChild(attr);
        })
        table.appendChild(record);
    })
}

function search() { //Only search by name
    if (arrayed.length === 0) { //If there are no entries, no need to search
        return;
    }
    var searchTerm = document.getElementById("name").value.toLowerCase();
    var table = document.getElementById("table");
    var entries = table.childElementCount;
    currentDisplay = [];
    for (var i = 1; i < entries; i++) { //Clear all entries
        table.removeChild(table.children[1]);
    }
    arrayed.forEach(elem => { //Search through array and check if either first names or last name contains search term, use lowercase to match as many possible (so not case sensitive)
        if (elem[1].toLowerCase().includes(searchTerm) || elem[2].toLowerCase().includes(searchTerm)) {
            currentDisplay.push(elem);
        }
    })
    currentDisplay.forEach(elem => { //Display search results
        var record = document.createElement("tr");
        elem.forEach((val) => {
            var attr = document.createElement("td");
            attr.textContent = val;
            record.appendChild(attr);
        })
        table.appendChild(record);
    })
    if (prevCol != null) { //Workaround to keep order after search
        if (order === "asc") {
            order = "dsc";
        }
        else {
            order = "asc";
        }
        sortRecords(prevN);
    }
}