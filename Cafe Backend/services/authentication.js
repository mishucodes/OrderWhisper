const JWT = require("jsonwebtoken");

function createTokenForClient(business)
{
    let payload = {_id: business._id, name: business.businessName, email: business.email};
    let token = JWT.sign(payload, process.env.JWT_SECRET);
    return token;
}

function validateToken(token)
{
    let payload = JWT.verify(token, process.env.JWT_SECRET);
    return payload;
}

module.exports = {createTokenForClient, validateToken};