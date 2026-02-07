const {signupNewBusiness, emailVerifiedAccountCanBeCreatedNow} = require("../controllers/signup.js");
const {Router} = require("express");
const router = Router();

router.post("/", signupNewBusiness);
router.get("/:emailVerificationToken", emailVerifiedAccountCanBeCreatedNow);

module.exports = router;