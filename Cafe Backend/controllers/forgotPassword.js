const Business = require("../models/business.js");

async function findThisAccount(request, response)
{
    let {email} = request.body || {};
    email = email?.trim().toLowerCase();

    if(!email) return response.status(400).json({error: "MISSING_FIELDS", message: "An Email Address is required to find an Account."});
    if(!verifyValidEmail(email)) return response.status(400).json({error: "INVALID_EMAIL", message: "Invalid email. Please try again."});
    let business = await Business.findOne({email});
    if(!business) return response.status(404).json({error: "WRONG_EMAIL", message: "No account is associated with this email address."});
    try
    {
        let ownerName = business.ownerName;
        let businessName = business.businessName;
        return response.status(200).json({ownerName, businessName});
    }
    catch(error)
    {
        console.error(error);
        return response.status(500).json({error: "INTERNAL_SERVER_ERROR", message: "Something went wrong. Please try again later."});
    }
}

async function resetPassword(request, response)
{
    let {email} = request.body || {};
    email = email?.trim().toLowerCase();
    if(!verifyValidEmail(email)) return response.status(400).json({error: "INVALID_EMAIL", message: "Invalid email. Please try again."});
    let business = await Business.findOne({email});
    if(!business) return response.status(404).json({error: "WRONG_EMAIL", message: "No account is associated with this email address."});
    //Sends a unique link to the email to reset password. I'll do this once I feel confident to jump to this topic.
    return response.status(200).json({message: "Check your Email to Reset the Password"});
}

async function updatePassword(request, response)
{
    //check whether the ID is correct &, if correct, what user does it refer to...
    //if everything alright, update the password in the Database...
}




//Helper Functions:
function verifyValidEmail(email)
{
    const regExForEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regExForEmail.test(email);
}

module.exports = {findThisAccount, resetPassword, updatePassword};