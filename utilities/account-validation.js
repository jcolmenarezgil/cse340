const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the database
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/*  **********************************
  *  Login Validation Rules
  * ********************************* */
 validate.loginRules = () => {
    return [
        // email is required and must be a string
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("Please review email. Or register it!"),

        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
    ]
 }

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ******************************
* Check login data and return errors to login
* ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

/*  **********************************
  *  Account Info Update Validation Rules
  * ********************************* */
validate.accountInfoUpdateRules = () => {
    return [
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),

        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),

        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                const account_id = req.body.account_id
                const account = await accountModel.getAccountById(account_id)
                if (account_email != account.account_email) {
                    const emailExists = await accountModel.checkExistingEmail(account_email)
                    if (emailExists) {
                        throw new Error("Email exists. Please use a different email")
                    }
                }
            }),
    ]
}

/*  **********************************
  *  Account Password Update Validation Rules
  * ********************************* */
validate.accountPasswordUpdateRules = () => {
    return [
        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
* Check update data and return errors or continue
* ***************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Update Account Information",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
        return
    }
    next()
}

/* ******************************
* Check password update data and return errors or continue
* ***************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
    const { account_id } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const data = await accountModel.getAccountById(account_id)
        res.render("account/update", {
            errors,
            title: "Update Account Information",
            nav,
            account_firstname: data.account_firstname,
            account_lastname: data.account_lastname,
            account_email: data.account_email,
            account_id,
        })
        return
    }
    next()
}

module.exports = validate