const Business = require("../models/business.js");
const regExForEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/; //Since I don't wanna query my DB unless I'm very sure.


async function findThisAccount(request, response)
{
    let {email} = request.body || {};
    email = email?.trim().toLowerCase();

    if(!email) return response.status(400).json({error: "MISSING_FIELDS", message: "An Email Address is required to find an Account."});
    if(!regExForEmail.test(email)) return response.status(400).json({error: "INVALID_EMAIL", message: "Invalid email. Please try again."});
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
    //sends a unique link to the email to reset password...
    return response.status(200).json({message: "Check your Email to Reset the Password"});
}

module.exports = {findThisAccount, resetPassword};