const {loginBusiness} = require("../controllers/login.js");
const {Router} = require("express");
const router = Router();

router.post("/", loginBusiness);

module.exports = router;