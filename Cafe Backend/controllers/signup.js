const {randomUUID} = require("crypto");
const nodeMailer = require("nodemailer");
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
    try
    {
        let verificationToken = String(randomUUID());
        let business = await Business.create({ownerName, businessName, email, password, verificationToken});
        await sendUniqueURLtoClient(business); //Sends a unique URL to client to verify email...
        return response.status(201).json({success: true});
    }
    catch(error)
    {
        if(error.code === 11000) return response.status(409).json({error: "DUPLICATE_EMAIL", message: "An account associated with this email already exists."});
        console.error(error);
        return response.status(500).json({error: "INTERNAL_SERVER_ERROR", message: "Something went wrong. Please try again later."});
    }
}

async function emailVerifiedAccountCanBeCreatedNow(request, response)
{
    let verificationToken = request.params.emailVerificationToken;
    if(!verificationToken)
        return response.status(404).json({error: "NOT_FOUND", message: "Verification link is invalid or expired"});
    try
    {
        let result = await Business.updateOne({verificationToken, verified: false}, {$set: {verified: true}, $unset: {expiresAt: "", verificationToken: ""}});
        if(result.matchedCount === 0)
            return response.status(404).json({error: "NOT_FOUND", message: "Verification link is invalid or expired"});
        else
            return response.status(200).json({message: "Account Verified."});
    }
    catch(error)
    {
        console.log("Error verifying an Account:", error.message);
        return response.status(500).json({error: "INTERNAL_SERVER_ERROR", message: "Something went wrong. Please try again."});
    }
}



//Helper Functions:
async function sendUniqueURLtoClient(business)
{
    let {email, businessName, ownerName, verificationToken} = business;
    if(!process.env.APP_BASE_URL)
        throw new Error("APP_BASE_URL is not defined");
    let uniqueURL = `${process.env.APP_BASE_URL}/signup/${verificationToken}`;
    //send this uniqueURL via email to client...
}

module.exports = {signupNewBusiness, emailVerifiedAccountCanBeCreatedNow};