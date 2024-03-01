var todayFull = new Date();
const today = todayFull.toISOString().split("T");
document.getElementById("startDate").setAttribute("max", today[0]);
document.getElementById("endDate").setAttribute("max", today[0]);

function generate() {
    valid = true;
    errors = [];
    sDate = document.getElementById("startDate").value;
    eDate = document.getElementById("endDate").value;
    if (sDate.length === 0) {
        valid = false;
        errors.push("Please enter start date");
    }
    if (eDate.length === 0) {
        valid = false;
        errors.push("Please enter end date");
    }
    if (valid === false) {
        document.getElementById("feedback").textContent = errors.join(", ")
    }
}