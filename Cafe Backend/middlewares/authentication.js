const {validateToken} = require("../services/authentication.js");

function redirectToHomepageIfLoggedIn(request, response, next)
{
    let cookieValue = request.cookies.token;
    if(!cookieValue) return next();
    let business = validateToken(cookieValue);
    if(!business) return next();
    return response.status(200).json({auth: "ALREADY_LOGGED_IN", redirectTo: "/home"});
}

module.exports = {redirectToHomepageIfLoggedIn};