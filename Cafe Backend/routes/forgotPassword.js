const {findThisAccount, resetPassword} = require("../controllers/forgotPassword.js");
const {Router} = require("express");
const router = Router();

router.post("/find-account", findThisAccount);
router.post("/reset-password", resetPassword);

module.exports = router;