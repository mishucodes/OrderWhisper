const {findThisAccount, resetPassword, updatePassword} = require("../controllers/forgotPassword.js");
const {Router} = require("express");
const router = Router();

router.post("/find-account", findThisAccount);
router.post("/reset-password", resetPassword);
router.post("/:uniqueIDtoResetPassword", updatePassword);

module.exports = router;