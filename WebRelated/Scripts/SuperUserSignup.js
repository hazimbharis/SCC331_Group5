var messageBox = document.getElementById('Message-Container-SignUp');


async function submitForm() {
    messageBox.style.color = 'red';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const organisationKEY = document.getElementById('organisationKey').value;

    console.log("Username: " + email);
    console.log("Password: " + password);
    console.log("Organization Key: " + organisationKEY);

    // Validate credentials
    if (!validateCredentials(email, password)) {
        return; // Exit early if credentials are invalid
    }

    try {
        // Validate organisation key
        const response = await $.get('http://localhost:5000/api/validateOrganisationKey/' + organisationKEY);
        if (response.message !== 'Organisation key is valid') {
            console.log('Organisation key is invalid');
            messageBox.innerHTML = 'Invalid organisation key';
            return; // Exit if organisation key is invalid
        }

        // Get organisation ID
        const orgID = await getOrganisationID(organisationKEY);
        console.log("ORG ID IS THIS: " + orgID);

        // Add new user
        await addNewUser(email, password, organisationKEY, orgID);
    } catch (error) {
        console.error('Error submitting form:', error);
        messageBox.innerHTML = 'Error submitting form';
    }
}

function validateCredentials(email, password) {
    const desiredPasswordLength = 8;
    // Check if email and password are empty
    if (!email.trim() || !password.trim()) {
        messageBox.innerHTML = 'Email and password cannot be empty';
        return false;
    }
    //Regular expression for email containg an @ and dot. Also checks for whitespaces
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    // Check if email matches the pattern
    if (!emailPattern.test(email)) {
        messageBox.innerHTML = 'Invalid email format';
        return false;
    }
    // Check if password meets correct length
    if (password.length < desiredPasswordLength) {
        messageBox.innerHTML = `Password must be at least ${desiredPasswordLength} characters long`;
        return false;
    }
    return true
} 
async function getOrganisationID(organisationKEY){
    
    try {
        const response = await $.get('http://localhost:5000/api/getOrganisationID/' + organisationKEY);
        const idValue = response[0].id;
        console.log("organisationID:", response);
        console.log("ORG ID: " + idValue);
        return idValue;
    } catch (error) {
        console.error('Error getting organisation ID:', error);
        throw error; // Rethrow the error to handle it in the caller
    }
}
function addNewUser(email, pWord, organisationKEY, orgID) {
    fetch('http://localhost:5000/api/users', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            newUser: {
                email: email,
                password: pWord,
                organisationID: orgID,
            }
        })
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        // Check the result received from the server
        if (data.result === "Success") {
            messageBox.style.color = 'green';
            messageBox.innerHTML = "Sign Up successful: " + orgID;
        } else if (data.result === "Failed") {
            messageBox.style.color = 'red';
            if (data.error.includes('Duplicate entry')) {
                messageBox.innerHTML = "User with this email already exists";
            } else {
                messageBox.innerHTML = "User could not be added at this time";
            }
        }
    })
    .catch(error => {
        console.error('Error adding user:', error);
        messageBox.innerHTML = "Error adding user: " + error.message;
    });
}

