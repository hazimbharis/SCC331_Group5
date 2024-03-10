var messageBox = document.getElementById('Message-Container-SignUp');


function submitForm() {
    messageBox.style.color = 'red';


    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var organisationKEY = document.getElementById('organisationKey').value;
    
    console.log("Username: " + email);
    console.log("Password: " + password);
    console.log("Organization: " + organisationKEY);

    //alert("Signup Successful (check console for details)");
    //window.location.href = 'SuperUserLogin.html';

    if (validateCredentials(email, password)){
        $.get('http://localhost:5000/api/validateOrganisationKey/' + organisationKEY)
        .done(function(response) {
            console.log(response);
            if (response.message === 'Organisation key is valid') {
                console.log('Organisation key is valid.');
                messageBox.style.color = 'green';
                messageBox.innerHTML = 'Account Creation Successful!';
                addNewUser(email, password, organisationKEY);
    
            } else {
                console.log('Organisation key is invalid');
                messageBox.innerHTML = 'Invalid organisation key';
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 404) {
                console.log('Organisation key does not exist.');
                messageBox.innerHTML = 'Organisation key does not exist';
            } else {
                console.error('Error validating organisation key:', textStatus, errorThrown);
                messageBox.innerHTML = 'Error validating organisation key';
            }
        });
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

function addNewUser(email, pWord, organisationKEY){

}
