// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to detect logout request
router.get("/logout", utilities.handleErrors(accountController.accountLogout));


// Route to build regiter view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to build account management view
router.get(
  "/",
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccount));

// Router to register user usign post
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;