const {signupNewBusiness} = require("../controllers/signup.js");
const {Router} = require("express");
const router = Router();

router.post("/", signupNewBusiness);

module.exports = router;