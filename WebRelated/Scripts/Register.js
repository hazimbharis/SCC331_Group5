let type;
let box = document.getElementById("secondIns");

function processAdd() {
    let fName = document.getElementById("fName").value;
    let lName = document.getElementById("lName").value;
    let dOB = document.getElementById("dOB").value;
    let gender = document.getElementById("gender").value;
    let medCon = document.getElementById("medCon").value;
    if (type == "p") {
        let convs = document.getElementById("convictions").value;
        let startDate = document.getElementById("startDate").value;
        let endDate = document.getElementById("endDate").value;
        console.log(fName, lName, dOB, gender, medCon, convs, startDate, endDate);
    }
}

function prisonerMode() {
    type = "p";
    box.replaceChildren();
    document.getElementById("secondHead").textContent = "Prisoner information";
    var cLabel = document.createElement("label");
    cLabel.classList.add("formLabels");
    cLabel.textContent = "Convictions: ";
    var conv = document.createElement("input");
    conv.classList.add("form");
    conv.id = "convictions";
    conv.type = "text";
    conv.style.width = "500px";
    var br = document.createElement("br");
    var sLabel = document.createElement("label");
    sLabel.classList.add("formLabels");
    sLabel.textContent = "Start date: ";
    var startDate = document.createElement("input");
    startDate.classList.add("form");
    startDate.id = "startDate";
    startDate.type = "date";
    startDate.setAttribute("max", today[0]);
    var eLabel = document.createElement("label");
    eLabel.classList.add("formLabels");
    eLabel.textContent = " End date: ";
    var endDate = document.createElement("input");
    endDate.classList.add("form");
    endDate.id = "endDate";
    endDate.type = "date";
    endDate.setAttribute("max", today[0]);
    box.appendChild(cLabel);
    box.appendChild(conv);
    box.appendChild(br);
    box.appendChild(sLabel);
    box.appendChild(startDate);
    box.appendChild(eLabel);
    box.appendChild(endDate);
    document.getElementById("submit").style.visibility = "visible";
}

function staffMode() {
    type = "s";
    box.replaceChildren();
    document.getElementById("secondHead").textContent = "Staff information";
    var sLabel = document.createElement("label");
    sLabel.classList.add("formLabels");
    sLabel.textContent = "Role: ";
    var role = document.createElement("input");
    role.classList.add("form");
    role.id = "role";
    role.type = "text";
    box.appendChild(sLabel);
    box.appendChild(role);
}

function visitorMode() {
    type = "v";
    box.replaceChildren();
    document.getElementById("secondHead").textContent = "Visitor information";
    var pLabel = document.createElement("label");
    pLabel.classList.add("formLabels");
    pLabel.textContent = "Phone number: ";
    var pNo = document.createElement("input");
    pNo.classList.add("form");
    pNo.id = "pNo";
    pNo.type = "text";
    box.appendChild(pLabel);
    box.appendChild(pNo);
}

const date = new Date();
const today = date.toISOString().split("T");
document.getElementById("dOB").setAttribute("max", today[0]);