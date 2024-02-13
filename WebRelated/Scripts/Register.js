let type;
let box = document.getElementById("secondIns");
const date = new Date();
const today = date.toISOString().split("T");

document.getElementById("dOB").setAttribute("max", today[0]);

function processAdd() {
    let feedback = document.getElementById("feedback");
    let valid = true;
    let fName = document.getElementById("fName").value;
    let errors = []
    if (fName.length == 0 || fName.length > 50) { //Need validation on this side in case frontend is tampered with
        valid = false;
        errors.push("First names must be between 1 and 50 characters");
        document.getElementById("fName").style.borderColor = "red";
    }
    else {
        document.getElementById("fName").style.borderColor = "#44414f";
    }
    let lName = document.getElementById("lName").value;
    if (lName.length == 0 || lName.length > 50) {
        valid = false;
        errors.push("Last name must be between 1 and 50 characters");
        document.getElementById("lName").style.borderColor = "red";
    }
    else {
        document.getElementById("lName").style.borderColor = "#44414f";
    }
    let dOB = document.getElementById("dOB").value;
    if (dOB.length == 0) {
        valid = false;
        errors.push("Date be provided");
        document.getElementById("dOB").style.borderColor = "red";
    }
    else
    {
        let dOBD = new Date(dOB);
        if (dOBD.getTime() > date.getTime()) {
            valid = false;
            errors.push("Date must be before today");
            document.getElementById("dOB").style.borderColor = "red";
        }
        else {
            document.getElementById("dOB").style.borderColor = "#44414f";
        }
    }
    let gender = document.getElementById("gender").value;
    if (gender.length == 0 || gender.length > 10) {
        valid = false;
        errors.push("Gender must be between 1 and 10 characters");
        document.getElementById("gender").style.borderColor = "red";
    }
    else {
        document.getElementById("gender").style.borderColor = "#44414f";
    }
    let medCon = document.getElementById("medCon").value;
    if (medCon.length > 100) {
        valid = false;
        errors.push("Medical conditions cannot be over 100 characters");
        document.getElementById("medCon").style.borderColor = "red";
    }
    else {
        document.getElementById("medCon").style.borderColor = "#44414f";
    }

    if (type == "P") {
        let convs = document.getElementById("convictions").value;
        if (convs.length == 0 || convs.length > 100) {
            valid = false;
            errors.push("Convictions cannot be over 100 characters");
            document.getElementById("convictions").style.borderColor = "red";
        }
        else {
            document.getElementById("convictions").style.borderColor = "#44414f";
        }
        let startDate = document.getElementById("startDate").value;
        if (startDate.length == 0) {
            valid = false;
            errors.push("Start date must be provided");
            document.getElementById("startDate").style.borderColor = "red";
        }
        else {
            document.getElementById("startDate").style.borderColor = "#44414f";
        }
        let endDate = document.getElementById("endDate").value;
        if (endDate.length == 0) {
            valid = false;
            errors.push("End date must be provided");
            document.getElementById("endDate").style.borderColor = "red";
        }
        else {
            document.getElementById("endDate").style.borderColor = "#44414f";
        }
        if (startDate.length > 0 && endDate.length > 0) {
            let sDate = new Date(startDate);
            let eDate = new Date(endDate);
            if (sDate.getTime() > eDate.getTime()) {
                valid = false;
                document.getElementById("startDate").style.borderColor = "red";
                document.getElementById("endDate").style.borderColor = "red";
                errors.push("Start date must be before or on end date");
            }
        }
        if (valid == true) {
            fetch('http://localhost:5000/api/addPrisoner', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prisoner: {
                        fName: fName,
                        lName: lName,
                        dOB: dOB,
                        gender: gender,
                        medCon: medCon,
                        type: type,
                        convs: convs,
                        startDate: startDate,
                        endDate: endDate
                    }
                })
            })
        }
        else {
            feedback.textContent = "Invalid fields: " + errors.join(", ");
        }
    }

    else if (type == "S")
    {
        let role = document.getElementById("role").value;
        if (role.length == 0 || role.length > 20) {
            valid = false;
            errors.push("Role must be between 1 and 20 characters");
            document.getElementById("role").style.borderColor = "red";
        }
        else {
            document.getElementById("role").style.borderColor = "#44414f";
        }
        if (valid == true) {
            fetch('http://localhost:5000/api/addStaff', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    staff: {
                        fName: fName,
                        lName: lName,
                        dOB: dOB,
                        gender: gender,
                        medCon: medCon,
                        type: type,
                        role: role
                    }
                })
            })
        }
        else {
            feedback.textContent = "Invalid fields: " + errors.join(", ");
        }
    }

    else if (type == "V")
    {
        let pNo = document.getElementById("pNo").value;
        if (pNo.length != 11) {
            valid = false;
            errors.push("Phone number must be 11 characters");
            document.getElementById("pNo").style.borderColor = "red";
        }
        else {
            document.getElementById("pNo").style.borderColor = "#44414f";
        }
        if (valid == true) {
            fetch('http://localhost:5000/api/addVisitor', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    visitor: {
                        fName: fName,
                        lName: lName,
                        dOB: dOB,
                        gender: gender,
                        medCon: medCon,
                        type: type,
                        pNo: pNo
                    }
                })
            })
        }
        else {
            feedback.textContent = "Invalid fields: " + errors.join(", ");
        }
    }
}

function prisonerMode() {
    type = "P";
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
    var eLabel = document.createElement("label");
    eLabel.classList.add("formLabels");
    eLabel.textContent = " End date: ";
    var endDate = document.createElement("input");
    endDate.classList.add("form");
    endDate.id = "endDate";
    endDate.type = "date";
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
    type = "S";
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
    document.getElementById("submit").style.visibility = "visible";
}

function visitorMode() {
    type = "V";
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
    document.getElementById("submit").style.visibility = "visible";
}