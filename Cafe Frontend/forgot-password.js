let findAccountButton = document.querySelector("#findAccount button");
let resetPasswordDiv = document.querySelector("#resetPassword");


findAccountButton.onclick = async function findAccount(event)
{
    event.preventDefault();
    let email = document.querySelector("#email").value;
    let url = document.querySelector("#findAccount form").action;
    let response = await fetch(url, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({email})});
    let data = await response.json();

    if(response.status === 200)
    {
        let h3 = document.createElement("h3");
        let businessEmail = document.createElement("p");
        let businessName = document.createElement("p");
        let ownerName = document.createElement("p");
        let resetPasswordButton = document.createElement("button");
        h3.textContent = "Found an Account:"
        businessEmail.textContent = email;
        businessName.textContent = data.businessName;
        ownerName.textContent = data.ownerName;
        resetPasswordButton.textContent = "Reset Password";
        resetPasswordButton.onclick = resetPassword;
        resetPasswordDiv.replaceChildren(h3, businessEmail, businessName, ownerName, resetPasswordButton);
        resetPasswordDiv.style.display = "block";
    }
    else if(response.status == 404)
    {
        let h3 = document.createElement("h3");
        let businessEmail = document.createElement("p");
        h3.textContent = "Error 404: No Account found for this email:"
        businessEmail.textContent = email;
        resetPasswordDiv.replaceChildren(h3, businessEmail);
        resetPasswordDiv.style.display = "block";
    }
    else if(response.status == 400)
    {
        let h3 = document.createElement("h3");
        let businessEmail = document.createElement("p");
        h3.textContent = "Error 400: This is not a valid Email Address:"
        businessEmail.textContent = email;
        resetPasswordDiv.replaceChildren(h3, businessEmail);
        resetPasswordDiv.style.display = "block";
    }
    else
    {
        let h3 = document.createElement("h3");
        h3.textContent = "Internal Server Error. Please try Again."
        resetPasswordDiv.replaceChildren(h3);
        resetPasswordDiv.style.display = "block";
    }
}


async function resetPassword(event)
{
    let url = "http://localhost:1234/forgot-password/reset-password";
    let email = document.querySelector("#email").value;
    let response = await fetch(url, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({email})});
    let data = await response.json();
    let h3 = document.createElement("h3");
    h3.textContent = data.message;
    resetPasswordDiv.replaceChildren(h3);
}