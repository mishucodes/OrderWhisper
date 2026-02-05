const Business = require("../models/business.js");
const regExForEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const regExForPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]{8,}$/;

async function signupNewBusiness(request, response)
{
    let {ownerName, businessName, email, password} = request.body;
    ownerName = ownerName?.trim();
    businessName = businessName?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if(!ownerName || !businessName || !email || !password)
        return response.status(400).json({error: "MISSING_FIELDS", message: "Business name, Owner name, Email, and Password are required."});
    if(!regExForEmail.test(email))
        return response.status(400).json({error: "INVALID_EMAIL", message: "Invalid email. Please try again."});
    if(!regExForPassword.test(password))
        return response.status(400).json({error: "INVALID_PASSWORD", message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special characters"});
    if(await Business.findOne({email}))
        return response.status(409).json({error: "DUPLICATE_EMAIL", message: "An account associated with this email already exists."});
    try
    {
        await Business.create({ownerName, businessName, email, password});
        return response.status(201).json({success: true});
    }
    catch(error)
    {
        console.error(error);
        return response.status(500).json({error: "INTERNAL_SERVER_ERROR", message: "Something went wrong. Please try again later."});
    }
}

module.exports = {signupNewBusiness};