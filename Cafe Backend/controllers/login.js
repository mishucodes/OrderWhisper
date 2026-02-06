const {createHmac} = require("crypto");
const Business = require("../models/business.js");
const {createTokenForClient} = require("../services/authentication.js");
const regExForEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/; //Since I don't wanna query my DB unless I'm very sure.


async function loginBusiness(request, response)
{
    let {email, password} = request.body || {};
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if(!email || !password)
        return response.status(400).json({error: "MISSING_FIELDS", message: "Email & Password are required for Login."});
    if(!regExForEmail.test(email))
        return response.status(400).json({error: "INVALID_EMAIL", message: "Invalid email. Please try again."});
    let business = await Business.findOne({email});
    if(!business) return response.status(409).json({error: "WRONG_EMAIL", message: "No account is associated with this email address."});
    try
    {
        let salt = business.salt;
        let hashedPassword = business.password;
        let clientProvidedHash = createHmac("sha256", salt).update(password).digest("hex");
        if(hashedPassword !== clientProvidedHash)
            return response.status(401).json({error: "INVALID_PASSWORD", message: "Wrong password. Please try again!"});
        else
        {
            let token = createTokenForClient(business);
            return response
                .status(200)
                .cookie("token", token, {httpOnly: true, secure: false, sameSite: "lax", maxAge: 7*24*60*60*1000})
                .json({message: "Login successful!"});
        }
    }
    catch(error)
    {
        console.error(error);
        return response.status(500).json({error: "INTERNAL_SERVER_ERROR", message: "Something went wrong. Please try again later."});
    }
}

module.exports = {loginBusiness};